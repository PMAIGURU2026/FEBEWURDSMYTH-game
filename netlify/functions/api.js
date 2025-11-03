/**
 * Netlify Serverless Function for WURDSMYTH API
 * This wraps the Express app as a serverless function
 */

const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import models
const Game = require('../../backend/models/Game');
const User = require('../../backend/models/User');

// Import utilities
const {
  getRandomWordByLevel,
  isValidWord,
  getWordDetails,
  getWordsByLevel
} = require('../../backend/config/wordList');

// Import middleware
const { authMiddleware, optionalAuth } = require('../../backend/middleware/auth');

// Import controllers
const authController = require('../../backend/controllers/authController');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'WURDSMYTH API is running',
    timestamp: new Date().toISOString(),
    features: ['authentication', 'gamification', 'badges']
  });
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Register
app.post('/api/auth/register', authController.register);

// Login
app.post('/api/auth/login', authController.login);

// Get profile (protected)
app.get('/api/auth/me', authMiddleware, authController.getProfile);

// Update progress (protected)
app.post('/api/auth/progress', authMiddleware, authController.updateProgress);

// Get badges (protected)
app.get('/api/auth/badges', authMiddleware, authController.getBadges);

// Get leaderboard (public)
app.get('/api/auth/leaderboard', authController.getLeaderboard);

// ==========================================
// GAME ROUTES
// ==========================================

// Start game (with optional auth)
app.post('/api/game/start', optionalAuth, (req, res) => {
  try {
    const { difficulty = 'medium', gameMode = 'classic' } = req.body;
    const sessionId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const wordData = getRandomWordByLevel(difficulty);
    if (!wordData) {
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    const gameState = Game.createGame(sessionId, wordData.word);
    const response = {
      ...gameState,
      gameMode,
      difficulty,
      userId: req.userId || null, // Attach user ID if logged in
      wordData: gameMode !== 'classic' ? {
        definition: wordData.definition,
        sentence: wordData.sentence,
        choices: gameMode === 'multiple_choice' ? wordData.choices : undefined
      } : undefined
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ error: 'Failed to start game' });
  }
});

// Submit guess
app.post('/api/game/guess', (req, res) => {
  try {
    const { sessionId, guess } = req.body;

    if (!sessionId || !guess) {
      return res.status(400).json({ error: 'Session ID and guess are required' });
    }

    if (!isValidWord(guess)) {
      return res.status(400).json({ error: 'Word not in dictionary' });
    }

    const result = Game.processGuess(sessionId, guess);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error processing guess:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get game state
app.get('/api/game/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const gameState = Game.getGame(sessionId);
    res.status(200).json(gameState);
  } catch (error) {
    console.error('Error getting game state:', error);
    res.status(404).json({ error: error.message });
  }
});

// Validate word
app.post('/api/game/validate', (req, res) => {
  try {
    const { word } = req.body;

    if (!word) {
      return res.status(400).json({ error: 'Word is required' });
    }

    const isValid = isValidWord(word);
    const wordDetails = isValid ? getWordDetails(word) : null;

    res.status(200).json({
      valid: isValid,
      word: word.toUpperCase(),
      details: wordDetails
    });
  } catch (error) {
    console.error('Error validating word:', error);
    res.status(500).json({ error: 'Failed to validate word' });
  }
});

// Get hint
app.get('/api/game/:sessionId/hint', (req, res) => {
  try {
    const { sessionId } = req.params;
    const gameState = Game.getGame(sessionId);

    if (gameState.gameStatus !== 'active') {
      return res.status(400).json({ error: 'Game is not active' });
    }

    res.status(200).json({
      wordLength: gameState.wordLength,
      hintsUsed: true
    });
  } catch (error) {
    console.error('Error getting hint:', error);
    res.status(404).json({ error: error.message });
  }
});

// End game
app.delete('/api/game/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    Game.deleteGame(sessionId);
    res.status(200).json({ message: 'Game session ended' });
  } catch (error) {
    console.error('Error ending game:', error);
    res.status(500).json({ error: 'Failed to end game' });
  }
});

// Get statistics
app.get('/api/game/stats', (req, res) => {
  try {
    const activeGames = Game.getActiveGamesCount();
    res.status(200).json({
      activeGames,
      serverUptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Get words by difficulty
app.get('/api/game/words/:level', (req, res) => {
  try {
    const { level } = req.params;
    const words = getWordsByLevel(level);

    if (!words || words.length === 0) {
      return res.status(404).json({ error: 'Invalid difficulty level' });
    }

    res.status(200).json({
      level,
      count: words.length,
      words: words.map(w => ({
        word: w.word,
        definition: w.definition
      }))
    });
  } catch (error) {
    console.error('Error getting words:', error);
    res.status(500).json({ error: 'Failed to get words' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export as serverless function
module.exports.handler = serverless(app);
