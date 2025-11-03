const User = require('../models/User');

/**
 * Register new user
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await User.register(username, email, password);

    res.status(201).json({
      message: 'User registered successfully',
      ...result
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await User.login(username, password);

    res.status(200).json({
      message: 'Login successful',
      ...result
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: error.message });
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
exports.getProfile = (req, res) => {
  try {
    const user = User.getUser(req.userId);
    const progress = User.getProgress(req.userId);

    res.status(200).json({
      user,
      progress
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(404).json({ error: error.message });
  }
};

/**
 * Update game progress
 * POST /api/auth/progress
 */
exports.updateProgress = (req, res) => {
  try {
    const gameResult = req.body;
    const result = User.updateProgress(req.userId, gameResult);

    res.status(200).json(result);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get user badges
 * GET /api/auth/badges
 */
exports.getBadges = (req, res) => {
  try {
    const badges = User.getUserBadges(req.userId);
    const allBadges = User.getAllBadges();

    res.status(200).json({
      earnedBadges: badges,
      allBadges
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get leaderboard
 * GET /api/auth/leaderboard
 */
exports.getLeaderboard = (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = User.getLeaderboard(limit);

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: error.message });
  }
};
