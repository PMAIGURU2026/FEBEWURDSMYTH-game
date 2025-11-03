const Game = require('../models/Game');
const {
  getRandomWordByLevel,
  isValidWord,
  getWordDetails,
  getWordsByLevel
} = require('../config/wordList');

/**
 * Start a new game
 * POST /api/game/start
 */
exports.startGame = (req, res) => {
  try {
    const { difficulty = 'medium', gameMode = 'classic' } = req.body;
    const sessionId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get a random word based on difficulty
    const wordData = getRandomWordByLevel(difficulty);

    if (!wordData) {
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    // Create game based on mode
    const gameState = Game.createGame(sessionId, wordData.word);

    // Add game mode specific data
    const response = {
      ...gameState,
      gameMode,
      difficulty,
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
};

/**
 * Submit a guess
 * POST /api/game/guess
 */
exports.submitGuess = (req, res) => {
  try {
    const { sessionId, guess } = req.body;

    if (!sessionId || !guess) {
      return res.status(400).json({ error: 'Session ID and guess are required' });
    }

    // Validate word exists in our dictionary
    if (!isValidWord(guess)) {
      return res.status(400).json({ error: 'Word not in dictionary' });
    }

    const result = Game.processGuess(sessionId, guess);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error processing guess:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get current game state
 * GET /api/game/:sessionId
 */
exports.getGameState = (req, res) => {
  try {
    const { sessionId } = req.params;
    const gameState = Game.getGame(sessionId);
    res.status(200).json(gameState);
  } catch (error) {
    console.error('Error getting game state:', error);
    res.status(404).json({ error: error.message });
  }
};

/**
 * Validate a word
 * POST /api/game/validate
 */
exports.validateWord = (req, res) => {
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
};

/**
 * Get word hint
 * GET /api/game/:sessionId/hint
 */
exports.getHint = (req, res) => {
  try {
    const { sessionId } = req.params;
    const gameState = Game.getGame(sessionId);

    if (gameState.gameStatus !== 'active') {
      return res.status(400).json({ error: 'Game is not active' });
    }

    // Get word details (without revealing the word)
    res.status(200).json({
      wordLength: gameState.wordLength,
      hintsUsed: true
    });
  } catch (error) {
    console.error('Error getting hint:', error);
    res.status(404).json({ error: error.message });
  }
};

/**
 * End game session
 * DELETE /api/game/:sessionId
 */
exports.endGame = (req, res) => {
  try {
    const { sessionId } = req.params;
    Game.deleteGame(sessionId);
    res.status(200).json({ message: 'Game session ended' });
  } catch (error) {
    console.error('Error ending game:', error);
    res.status(500).json({ error: 'Failed to end game' });
  }
};

/**
 * Get statistics
 * GET /api/game/stats
 */
exports.getStats = (req, res) => {
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
};

/**
 * Get words by difficulty level
 * GET /api/game/words/:level
 */
exports.getWordsByDifficulty = (req, res) => {
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
};
