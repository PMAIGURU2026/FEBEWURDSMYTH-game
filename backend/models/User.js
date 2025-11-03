/**
 * User Model - Manages user accounts, authentication, and progress
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// In-memory storage (for development - replace with database in production)
const users = new Map();
const userProgress = new Map();

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
    const existingUser = Array.from(users.values()).find(
      u => u.username === username || u.email === email
    );

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    const user = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    // Initialize user progress
    const progress = {
      userId,
      level: 1,
      xp: 0,
      totalScore: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      currentStreak: 0,
      bestStreak: 0,
      winStreak: 0,
      perfectGames: 0,
      speedWins: 0,
      expertWins: 0,
      modesPlayed: new Set(),
      badges: [],
      achievements: [],
      gameHistory: [],
      statistics: {
        easy: { played: 0, won: 0 },
        medium: { played: 0, won: 0 },
        hard: { played: 0, won: 0 },
        expert: { played: 0, won: 0 }
      }
    };

    users.set(userId, user);
    userProgress.set(userId, progress);

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
    const user = Array.from(users.values()).find(u => u.username === username);

    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error('Invalid username or password');
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    users.set(user.id, user);

    // Generate token
    const token = this.generateToken(user.id);

    // Get progress
    const progress = userProgress.get(user.id);

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
  getUser(userId) {
    const user = users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.sanitizeUser(user);
  }

  /**
   * Get user progress
   */
  getProgress(userId) {
    const progress = userProgress.get(userId);
    if (!progress) {
      throw new Error('Progress not found');
    }
    return {
      ...progress,
      modesPlayed: Array.from(progress.modesPlayed)
    };
  }

  /**
   * Update game progress
   */
  updateProgress(userId, gameResult) {
    const progress = userProgress.get(userId);
    if (!progress) {
      throw new Error('Progress not found');
    }

    const { won, difficulty, gameMode, score, guesses, timeElapsed } = gameResult;

    // Update basic stats
    progress.gamesPlayed++;
    progress.totalScore += score || 0;

    if (won) {
      progress.gamesWon++;
      progress.currentStreak++;
      progress.winStreak++;

      if (progress.currentStreak > progress.bestStreak) {
        progress.bestStreak = progress.currentStreak;
      }

      // Check for perfect game (1 guess)
      if (guesses === 1) {
        progress.perfectGames++;
      }

      // Check for speed win (under 30 seconds)
      if (timeElapsed && timeElapsed < 30000) {
        progress.speedWins++;
      }

      // Check for expert win
      if (difficulty === 'expert') {
        progress.expertWins++;
      }
    } else {
      progress.gamesLost++;
      progress.currentStreak = 0;
      progress.winStreak = 0;
    }

    // Update difficulty stats
    if (progress.statistics[difficulty]) {
      progress.statistics[difficulty].played++;
      if (won) {
        progress.statistics[difficulty].won++;
      }
    }

    // Track modes played
    progress.modesPlayed.add(gameMode);

    // Add XP
    const xpGained = this.calculateXP(gameResult);
    progress.xp += xpGained;

    // Level up check
    const newLevel = this.calculateLevel(progress.xp);
    const leveledUp = newLevel > progress.level;
    progress.level = newLevel;

    // Add to history
    progress.gameHistory.unshift({
      ...gameResult,
      timestamp: new Date().toISOString(),
      xpGained
    });

    // Keep last 50 games
    if (progress.gameHistory.length > 50) {
      progress.gameHistory = progress.gameHistory.slice(0, 50);
    }

    // Check for new badges
    const newBadges = this.checkBadges(progress);

    userProgress.set(userId, progress);

    return {
      progress: {
        ...progress,
        modesPlayed: Array.from(progress.modesPlayed)
      },
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

    Object.values(BADGES).forEach(badge => {
      // Skip if already has badge
      if (progress.badges.includes(badge.id)) {
        return;
      }

      // Check criteria
      let earned = true;
      for (const [key, value] of Object.entries(badge.criteria)) {
        if (key === 'modesPlayed') {
          if (progress.modesPlayed.size < value) {
            earned = false;
          }
        } else if ((progress[key] || 0) < value) {
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
  getUserBadges(userId) {
    const progress = this.getProgress(userId);
    return progress.badges.map(badgeId => {
      return Object.values(BADGES).find(b => b.id === badgeId);
    }).filter(Boolean);
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(limit = 10) {
    const allProgress = Array.from(userProgress.values());

    return allProgress
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit)
      .map(progress => {
        const user = users.get(progress.userId);
        return {
          username: user?.username,
          level: progress.level,
          totalScore: progress.totalScore,
          gamesWon: progress.gamesWon,
          badges: progress.badges.length
        };
      });
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
