/**
 * User Model - Manages user accounts, authentication, and progress
 * Now using Supabase for persistent storage
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'wurdsmyth-secret-key-change-in-production';

/**
 * Badge definitions with unlock criteria
 */
const BADGES = {
  FIRST_GAME: {
    id: 'first_game',
    name: 'First Steps',
    description: 'Played your first game',
    icon: '🎮',
    criteria: { gamesPlayed: 1 }
  },
  FIRST_WIN: {
    id: 'first_win',
    name: 'Victory',
    description: 'Won your first game',
    icon: '🏆',
    criteria: { gamesWon: 1 }
  },
  STREAK_3: {
    id: 'streak_3',
    name: 'Hot Streak',
    description: 'Win 3 games in a row',
    icon: '🔥',
    criteria: { winStreak: 3 }
  },
  STREAK_5: {
    id: 'streak_5',
    name: 'Unstoppable',
    description: 'Win 5 games in a row',
    icon: '⚡',
    criteria: { winStreak: 5 }
  },
  GAMES_10: {
    id: 'games_10',
    name: 'Dedicated',
    description: 'Played 10 games',
    icon: '🎯',
    criteria: { gamesPlayed: 10 }
  },
  GAMES_50: {
    id: 'games_50',
    name: 'Enthusiast',
    description: 'Played 50 games',
    icon: '🌟',
    criteria: { gamesPlayed: 50 }
  },
  WINS_10: {
    id: 'wins_10',
    name: 'Champion',
    description: 'Won 10 games',
    icon: '👑',
    criteria: { gamesWon: 10 }
  },
  PERFECT_GAME: {
    id: 'perfect_game',
    name: 'Perfect!',
    description: 'Won in 1 guess',
    icon: '💎',
    criteria: { perfectGames: 1 }
  },
  VOCAB_MASTER: {
    id: 'vocab_master',
    name: 'Vocabulary Master',
    description: 'Beat Expert level',
    icon: '📚',
    criteria: { expertWins: 1 }
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Won in under 30 seconds',
    icon: '⏱️',
    criteria: { speedWins: 1 }
  },
  EXPLORER: {
    id: 'explorer',
    name: 'Explorer',
    description: 'Tried all game modes',
    icon: '🗺️',
    criteria: { modesPlayed: 3 }
  },
  WORD_WIZARD: {
    id: 'word_wizard',
    name: 'Word Wizard',
    description: 'Reached level 10',
    icon: '🧙',
    criteria: { level: 10 }
  }
};

class UserModel {
  /**
   * Register a new user
   */
  async register(username, email, password) {
    // Validate input
    if (!username || !email || !password) {
      throw new Error('Username, email, and password are required');
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .or(`username.eq.${username},email.eq.${email}`)
      .single();

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    const now = new Date().toISOString();

    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        username,
        email,
        password: hashedPassword,
        created_at: now,
        last_login: now
      })
      .select()
      .single();

    if (userError) {
      throw new Error(`Failed to create user: ${userError.message}`);
    }

    // Initialize user progress
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        level: 1,
        xp: 0,
        total_score: 0,
        games_played: 0,
        games_won: 0,
        games_lost: 0,
        current_streak: 0,
        best_streak: 0,
        win_streak: 0,
        perfect_games: 0,
        speed_wins: 0,
        expert_wins: 0,
        modes_played: [],
        badges: [],
        achievements: [],
        game_history: [],
        statistics: {
          easy: { played: 0, won: 0 },
          medium: { played: 0, won: 0 },
          hard: { played: 0, won: 0 },
          expert: { played: 0, won: 0 }
        }
      })
      .select()
      .single();

    if (progressError) {
      throw new Error(`Failed to initialize progress: ${progressError.message}`);
    }

    // Generate token
    const token = this.generateToken(userId);

    return {
      user: this.sanitizeUser(user),
      token,
      progress
    };
  }

  /**
   * Login user
   */
  async login(username, password) {
    // Find user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (userError || !user) {
      throw new Error('Invalid username or password');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error('Invalid username or password');
    }

    // Update last login
    const now = new Date().toISOString();
    await supabase
      .from('users')
      .update({ last_login: now })
      .eq('id', user.id);

    // Generate token
    const token = this.generateToken(user.id);

    // Get progress
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return {
      user: this.sanitizeUser(user),
      token,
      progress
    };
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded.userId;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Generate JWT token
   */
  generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  }

  /**
   * Get user by ID
   */
  async getUser(userId) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new Error('User not found');
    }
    return this.sanitizeUser(user);
  }

  /**
   * Get user progress
   */
  async getProgress(userId) {
    const { data: progress, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !progress) {
      throw new Error('Progress not found');
    }
    return progress;
  }

  /**
   * Update game progress
   */
  async updateProgress(userId, gameResult) {
    // Get current progress
    const { data: progress, error: fetchError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError || !progress) {
      throw new Error('Progress not found');
    }

    const { won, difficulty, gameMode, score, guesses, timeElapsed } = gameResult;

    // Update basic stats
    progress.games_played++;
    progress.total_score += score || 0;

    if (won) {
      progress.games_won++;
      progress.current_streak++;
      progress.win_streak++;

      if (progress.current_streak > progress.best_streak) {
        progress.best_streak = progress.current_streak;
      }

      // Check for perfect game (1 guess)
      if (guesses === 1) {
        progress.perfect_games++;
      }

      // Check for speed win (under 30 seconds)
      if (timeElapsed && timeElapsed < 30000) {
        progress.speed_wins++;
      }

      // Check for expert win
      if (difficulty === 'expert') {
        progress.expert_wins++;
      }
    } else {
      progress.games_lost++;
      progress.current_streak = 0;
      progress.win_streak = 0;
    }

    // Update difficulty stats
    if (progress.statistics[difficulty]) {
      progress.statistics[difficulty].played++;
      if (won) {
        progress.statistics[difficulty].won++;
      }
    }

    // Track modes played
    if (!progress.modes_played.includes(gameMode)) {
      progress.modes_played.push(gameMode);
    }

    // Add XP
    const xpGained = this.calculateXP(gameResult);
    progress.xp += xpGained;

    // Level up check
    const newLevel = this.calculateLevel(progress.xp);
    const leveledUp = newLevel > progress.level;
    progress.level = newLevel;

    // Add to history
    progress.game_history.unshift({
      ...gameResult,
      timestamp: new Date().toISOString(),
      xpGained
    });

    // Keep last 50 games
    if (progress.game_history.length > 50) {
      progress.game_history = progress.game_history.slice(0, 50);
    }

    // Check for new badges
    const newBadges = this.checkBadges(progress);

    // Update in database
    const { error: updateError } = await supabase
      .from('user_progress')
      .update({
        level: progress.level,
        xp: progress.xp,
        total_score: progress.total_score,
        games_played: progress.games_played,
        games_won: progress.games_won,
        games_lost: progress.games_lost,
        current_streak: progress.current_streak,
        best_streak: progress.best_streak,
        win_streak: progress.win_streak,
        perfect_games: progress.perfect_games,
        speed_wins: progress.speed_wins,
        expert_wins: progress.expert_wins,
        modes_played: progress.modes_played,
        badges: progress.badges,
        game_history: progress.game_history,
        statistics: progress.statistics
      })
      .eq('user_id', userId);

    if (updateError) {
      throw new Error(`Failed to update progress: ${updateError.message}`);
    }

    return {
      progress,
      newBadges,
      leveledUp,
      xpGained
    };
  }

  /**
   * Calculate XP from game result
   */
  calculateXP(gameResult) {
    const { won, difficulty, score, guesses } = gameResult;

    let xp = 0;

    if (won) {
      xp += 100; // Base XP for winning

      // Difficulty multiplier
      const multipliers = { easy: 1, medium: 1.5, hard: 2, expert: 3 };
      xp *= (multipliers[difficulty] || 1);

      // Bonus for fewer guesses
      if (guesses === 1) xp += 200;
      else if (guesses <= 3) xp += 50;

      // Score bonus
      xp += Math.floor((score || 0) / 10);
    } else {
      xp += 25; // Participation XP
    }

    return Math.floor(xp);
  }

  /**
   * Calculate level from XP
   */
  calculateLevel(xp) {
    // Level formula: level = floor(sqrt(xp / 100)) + 1
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  /**
   * Check and award badges
   */
  checkBadges(progress) {
    const newBadges = [];

    // Map camelCase to snake_case for database fields
    const fieldMap = {
      gamesPlayed: 'games_played',
      gamesWon: 'games_won',
      winStreak: 'win_streak',
      perfectGames: 'perfect_games',
      speedWins: 'speed_wins',
      expertWins: 'expert_wins',
      modesPlayed: 'modes_played',
      level: 'level'
    };

    Object.values(BADGES).forEach(badge => {
      // Skip if already has badge
      if (progress.badges.includes(badge.id)) {
        return;
      }

      // Check criteria
      let earned = true;
      for (const [key, value] of Object.entries(badge.criteria)) {
        const dbField = fieldMap[key] || key;

        if (key === 'modesPlayed') {
          if ((progress.modes_played || []).length < value) {
            earned = false;
          }
        } else if ((progress[dbField] || 0) < value) {
          earned = false;
        }
      }

      if (earned) {
        progress.badges.push(badge.id);
        newBadges.push(badge);
      }
    });

    return newBadges;
  }

  /**
   * Get all badges
   */
  getAllBadges() {
    return Object.values(BADGES);
  }

  /**
   * Get user badges with details
   */
  async getUserBadges(userId) {
    const progress = await this.getProgress(userId);
    return progress.badges.map(badgeId => {
      return Object.values(BADGES).find(b => b.id === badgeId);
    }).filter(Boolean);
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit = 10) {
    // Get all user progress sorted by total_score
    const { data: allProgress, error } = await supabase
      .from('user_progress')
      .select('*')
      .order('total_score', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch leaderboard: ${error.message}`);
    }

    // Get usernames for each entry
    const leaderboard = await Promise.all(
      allProgress.map(async (progress) => {
        const { data: user } = await supabase
          .from('users')
          .select('username')
          .eq('id', progress.user_id)
          .single();

        return {
          username: user?.username || 'Unknown',
          level: progress.level,
          totalScore: progress.total_score,
          gamesWon: progress.games_won,
          badges: progress.badges.length
        };
      })
    );

    return leaderboard;
  }

  /**
   * Remove sensitive data from user object
   */
  sanitizeUser(user) {
    const { password, ...sanitized } = user;
    return sanitized;
  }

  /**
   * Get all users (admin only - for debugging)
   */
  getAllUsers() {
    return Array.from(users.values()).map(this.sanitizeUser);
  }
}

module.exports = new UserModel();
