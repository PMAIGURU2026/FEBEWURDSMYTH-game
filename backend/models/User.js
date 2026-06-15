/**
 * User Model — accounts, auth, gamification
 * Tables: users, game_sessions, user_stats
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'wurdsmyth-secret-key-change-in-production';

// Points awarded per difficulty on a won game
const POINTS_MAP = {
  easy: 10,
  medium: 20,
  hard: 30,
  expert: 50
};

// Badge definitions — five required badges
const BADGES = {
  FIRST_PLAY: {
    id: 'first_play',
    name: 'First Play',
    description: 'Played your first game',
    icon: '🎮'
  },
  SEVEN_DAY_STREAK: {
    id: 'seven_day_streak',
    name: '7-Day Streak',
    description: 'Played 7 days in a row',
    icon: '🔥'
  },
  HUNDRED_POINTS: {
    id: 'hundred_points',
    name: 'Century',
    description: 'Earned 100 total points',
    icon: '💯'
  },
  WORD_MASTER: {
    id: 'word_master',
    name: 'Word Master',
    description: 'Won a game on Expert level',
    icon: '🏆'
  },
  SHARP_SHOOTER: {
    id: 'sharp_shooter',
    name: 'Sharp Shooter',
    description: 'Answered correctly on the very first try',
    icon: '🎯'
  }
};

/**
 * Calculate streak update for today's play.
 * Returns new current_streak, longest_streak, and last_played_date.
 */
function calcDailyStreak(stats) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const last = stats.last_played_date;

  if (!last) {
    const streak = 1;
    return { current_streak: streak, longest_streak: Math.max(streak, stats.longest_streak || 0), last_played_date: today };
  }

  const daysDiff = Math.round(
    (new Date(today) - new Date(last)) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff === 0) {
    // Already played today — keep streak as-is
    return {
      current_streak: stats.current_streak,
      longest_streak: stats.longest_streak,
      last_played_date: today
    };
  }

  if (daysDiff === 1) {
    // Consecutive day — extend streak
    const streak = stats.current_streak + 1;
    return {
      current_streak: streak,
      longest_streak: Math.max(streak, stats.longest_streak),
      last_played_date: today
    };
  }

  // Missed a day — reset
  return { current_streak: 1, longest_streak: stats.longest_streak, last_played_date: today };
}

/**
 * Check which new badges were earned and return them.
 * Mutates stats.badges_earned in place.
 */
function checkBadges(stats, gameResult, gamesPlayedTotal) {
  const earned = new Set((stats.badges_earned || []).map(b => b.id));
  const newBadges = [];

  function award(badge) {
    if (!earned.has(badge.id)) {
      earned.add(badge.id);
      const record = { id: badge.id, earned_at: new Date().toISOString() };
      stats.badges_earned.push(record);
      newBadges.push(badge);
    }
  }

  // 1. First Play
  if (gamesPlayedTotal >= 1) award(BADGES.FIRST_PLAY);

  // 2. 7-Day Streak
  if (stats.current_streak >= 7) award(BADGES.SEVEN_DAY_STREAK);

  // 3. 100 Points
  if (stats.total_points >= 100) award(BADGES.HUNDRED_POINTS);

  // 4. Word Master — won on Expert
  if (gameResult.won && gameResult.difficulty === 'expert') award(BADGES.WORD_MASTER);

  // 5. Sharp Shooter — won on first try
  if (gameResult.won && gameResult.guesses === 1) award(BADGES.SHARP_SHOOTER);

  return newBadges;
}

class UserModel {
  /** Register a new user */
  async register(username, email, password) {
    if (!username || !email || !password) {
      throw new Error('Username, email, and password are required');
    }

    // Check duplicates
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`)
      .maybeSingle();

    if (existing) throw new Error('Username or email already in use');

    const hashed = await bcrypt.hash(password, 10);

    const { data: user, error: uErr } = await supabase
      .from('users')
      .insert({ email, username, password: hashed })
      .select()
      .single();

    if (uErr) throw new Error(`Failed to create user: ${uErr.message}`);

    // Initialise user_stats row
    const { error: sErr } = await supabase
      .from('user_stats')
      .insert({ user_id: user.id });

    if (sErr) throw new Error(`Failed to init stats: ${sErr.message}`);

    const token = this.generateToken(user.id);
    return { user: this.sanitize(user), token };
  }

  /** Login */
  async login(username, password) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error || !user) throw new Error('Invalid username or password');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid username or password');

    const token = this.generateToken(user.id);
    const stats = await this.getStats(user.id);

    return { user: this.sanitize(user), token, stats };
  }

  /** Get user_stats for a user */
  async getStats(userId) {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch stats: ${error.message}`);
    return data;
  }

  /** Get user by ID */
  async getUser(userId) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !user) throw new Error('User not found');
    return this.sanitize(user);
  }

  /**
   * Record a completed game.
   * Awards points, updates daily streak, checks badges.
   */
  async updateProgress(userId, gameResult) {
    const { won, difficulty, mode, score, guesses } = gameResult;

    // Fetch current stats
    const { data: stats, error: fetchErr } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchErr || !stats) throw new Error('User stats not found');

    // Points: only awarded on a win
    const pointsEarned = won ? (POINTS_MAP[difficulty] || 0) : 0;
    stats.total_points = (stats.total_points || 0) + pointsEarned;

    // Daily streak
    const streakUpdate = calcDailyStreak(stats);
    stats.current_streak = streakUpdate.current_streak;
    stats.longest_streak = streakUpdate.longest_streak;
    stats.last_played_date = streakUpdate.last_played_date;

    // Count total games played (game_sessions) — after insert below
    const { count: sessionsCount } = await supabase
      .from('game_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    const totalGamesAfterThis = (sessionsCount || 0) + 1;

    // Insert game session
    const { error: insertErr } = await supabase
      .from('game_sessions')
      .insert({
        user_id: userId,
        score: score || 0,
        mode: mode || 'classic',
        level: difficulty || 'medium'
      });

    if (insertErr) throw new Error(`Failed to save game session: ${insertErr.message}`);

    // Ensure badges_earned is an array
    if (!Array.isArray(stats.badges_earned)) stats.badges_earned = [];

    // Check badges
    const newBadges = checkBadges(stats, gameResult, totalGamesAfterThis);

    // Persist updated stats
    const { error: updateErr } = await supabase
      .from('user_stats')
      .update({
        total_points: stats.total_points,
        current_streak: stats.current_streak,
        longest_streak: stats.longest_streak,
        badges_earned: stats.badges_earned,
        last_played_date: stats.last_played_date
      })
      .eq('user_id', userId);

    if (updateErr) throw new Error(`Failed to update stats: ${updateErr.message}`);

    return { stats, newBadges, pointsEarned };
  }

  /** Return all badge definitions */
  getAllBadges() {
    return Object.values(BADGES);
  }

  /** JWT helpers */
  generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  }

  verifyToken(token) {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  }

  /** Strip password from user object */
  sanitize(user) {
    const { password, ...safe } = user;
    return safe;
  }
}

module.exports = new UserModel();
