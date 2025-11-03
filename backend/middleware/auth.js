const User = require('../models/User');

/**
 * Authentication middleware
 * Verifies JWT token and attaches userId to request
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const userId = User.verifyToken(token);

    // Attach userId to request
    req.userId = userId;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Optional auth middleware
 * Attaches userId if token is provided, but doesn't fail if not
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const userId = User.verifyToken(token);
      req.userId = userId;
    }

    next();
  } catch (error) {
    // Continue without auth
    next();
  }
};

module.exports = { authMiddleware, optionalAuth };
