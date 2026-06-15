const User = require('../models/User');

/** POST /api/auth/register */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const result = await User.register(username, email, password);
    res.status(201).json({ message: 'User registered successfully', ...result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/** POST /api/auth/login */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const result = await User.login(username, password);
    res.status(200).json({ message: 'Login successful', ...result });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

/** GET /api/auth/me  (protected) */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.getUser(req.userId);
    const stats = await User.getStats(req.userId);
    res.status(200).json({ user, stats });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/** POST /api/auth/progress  (protected) */
exports.updateProgress = async (req, res) => {
  try {
    const result = await User.updateProgress(req.userId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/** GET /api/auth/badges  (protected) */
exports.getBadges = async (req, res) => {
  try {
    const stats = await User.getStats(req.userId);
    const allBadges = User.getAllBadges();
    const earnedIds = new Set((stats.badges_earned || []).map(b => b.id));
    res.status(200).json({
      earnedBadges: allBadges.filter(b => earnedIds.has(b.id)),
      allBadges
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/** GET /api/auth/leaderboard  (public) */
exports.getLeaderboard = async (req, res) => {
  try {
    const supabase = require('../config/supabase');
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const { data: topStats, error } = await supabase
      .from('user_stats')
      .select('user_id, total_points, current_streak, longest_streak, badges_earned')
      .order('total_points', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    const board = await Promise.all(
      topStats.map(async (s) => {
        const { data: u } = await supabase
          .from('users')
          .select('username')
          .eq('id', s.user_id)
          .maybeSingle();
        return {
          username: u?.username || 'Unknown',
          total_points: s.total_points,
          current_streak: s.current_streak,
          badges_count: (s.badges_earned || []).length
        };
      })
    );

    res.status(200).json({ leaderboard: board });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
