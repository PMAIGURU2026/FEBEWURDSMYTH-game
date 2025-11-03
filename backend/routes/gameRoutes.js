const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Game routes
router.post('/start', gameController.startGame);
router.post('/guess', gameController.submitGuess);
router.post('/validate', gameController.validateWord);
router.get('/stats', gameController.getStats);
router.get('/words/:level', gameController.getWordsByDifficulty);
router.get('/:sessionId', gameController.getGameState);
router.get('/:sessionId/hint', gameController.getHint);
router.delete('/:sessionId', gameController.endGame);

module.exports = router;
