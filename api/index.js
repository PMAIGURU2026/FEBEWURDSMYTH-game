/**
 * WURDSMYTH API — Vercel Serverless Function
 * All /api/* routes are handled here via Express + serverless-http.
 */

const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Guard: Supabase credentials must exist before models are imported
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.warn('Supabase env vars not set — auth and progress features will fail.');
}

const Game = require('../backend/models/Game');
const {
  getRandomWordByLevel,
  isValidWord,
  getWordDetails,
  getWordsByLevel
} = require('../backend/config/wordList');

const { authMiddleware, optionalAuth } = require('../backend/middleware/auth');
const authController = require('../backend/controllers/authController');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ── Health ──────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'WURDSMYTH API is running',
    timestamp: new Date().toISOString(),
    features: ['authentication', 'gamification', 'badges', 'supabase']
  });
});

// ── Auth routes ──────────────────────────────────────────────────────────────

app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authMiddleware, authController.getProfile);
app.post('/api/auth/progress', authMiddleware, authController.updateProgress);
app.get('/api/auth/badges', authMiddleware, authController.getBadges);
app.get('/api/auth/leaderboard', authController.getLeaderboard);

// ── Game routes ───────────────────────────────────────────────────────────────

app.post('/api/game/start', optionalAuth, (req, res) => {
  try {
    const { difficulty = 'medium', gameMode = 'classic' } = req.body;
    const sessionId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const wordData = getRandomWordByLevel(difficulty);
    if (!wordData) return res.status(400).json({ error: 'Invalid difficulty level' });

    const gameState = Game.createGame(sessionId, wordData.word);
    const response = {
      ...gameState,
      gameMode,
      difficulty,
      userId: req.userId || null,
      wordData: gameMode !== 'classic' ? {
        definition: wordData.definition,
        sentence: wordData.sentence,
        choices: gameMode === 'multiple_choice' ? wordData.choices : undefined
      } : undefined
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to start game' });
  }
});

app.post('/api/game/guess', (req, res) => {
  try {
    const { sessionId, guess } = req.body;
    if (!sessionId || !guess) return res.status(400).json({ error: 'Session ID and guess are required' });
    if (!isValidWord(guess)) return res.status(400).json({ error: 'Word not in dictionary' });

    const result = Game.processGuess(sessionId, guess);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/game/stats', (req, res) => {
  res.status(200).json({
    activeGames: Game.getActiveGamesCount(),
    serverUptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.post('/api/game/validate', (req, res) => {
  try {
    const { word } = req.body;
    if (!word) return res.status(400).json({ error: 'Word is required' });

    const isValid = isValidWord(word);
    const details = isValid ? getWordDetails(word) : null;

    res.status(200).json({ valid: isValid, word: word.toUpperCase(), details });
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate word' });
  }
});

app.get('/api/game/words/:level', (req, res) => {
  try {
    const words = getWordsByLevel(req.params.level);
    if (!words || words.length === 0) return res.status(404).json({ error: 'Invalid difficulty level' });

    res.status(200).json({
      level: req.params.level,
      count: words.length,
      words: words.map(w => ({ word: w.word, definition: w.definition }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get words' });
  }
});

app.get('/api/game/:sessionId/hint', (req, res) => {
  try {
    const gameState = Game.getGame(req.params.sessionId);
    if (gameState.gameStatus !== 'active') return res.status(400).json({ error: 'Game is not active' });
    res.status(200).json({ wordLength: gameState.wordLength, hintsUsed: true });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/api/game/:sessionId', (req, res) => {
  try {
    res.status(200).json(Game.getGame(req.params.sessionId));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.delete('/api/game/:sessionId', (req, res) => {
  try {
    Game.deleteGame(req.params.sessionId);
    res.status(200).json({ message: 'Game session ended' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to end game' });
  }
});

// ── Fallback ──────────────────────────────────────────────────────────────────

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = serverless(app);
