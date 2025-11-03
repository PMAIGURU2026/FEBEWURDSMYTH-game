/**
 * Game Model - Manages game state and logic
 */

class Game {
  constructor() {
    this.games = new Map(); // Store active games by sessionId
  }

  /**
   * Create a new game session
   * @param {string} sessionId - Unique session identifier
   * @param {string} targetWord - The word to guess
   * @returns {Object} - New game state
   */
  createGame(sessionId, targetWord) {
    const gameState = {
      sessionId,
      targetWord: targetWord.toUpperCase(),
      guesses: [],
      maxGuesses: 6,
      gameStatus: 'active', // active, won, lost
      currentGuess: 0,
      score: 0,
      startTime: Date.now(),
      endTime: null
    };

    this.games.set(sessionId, gameState);
    return this.getPublicGameState(gameState);
  }

  /**
   * Get game state without revealing the target word
   * @param {Object} gameState - Full game state
   * @returns {Object} - Public game state
   */
  getPublicGameState(gameState) {
    return {
      sessionId: gameState.sessionId,
      guesses: gameState.guesses,
      maxGuesses: gameState.maxGuesses,
      gameStatus: gameState.gameStatus,
      currentGuess: gameState.currentGuess,
      score: gameState.score,
      wordLength: gameState.targetWord.length,
      targetWord: gameState.gameStatus !== 'active' ? gameState.targetWord : null
    };
  }

  /**
   * Process a guess
   * @param {string} sessionId - Session identifier
   * @param {string} guess - The guessed word
   * @returns {Object} - Result of the guess
   */
  processGuess(sessionId, guess) {
    const gameState = this.games.get(sessionId);

    if (!gameState) {
      throw new Error('Game session not found');
    }

    if (gameState.gameStatus !== 'active') {
      throw new Error('Game is already finished');
    }

    if (gameState.currentGuess >= gameState.maxGuesses) {
      throw new Error('Maximum guesses reached');
    }

    const guessUpper = guess.toUpperCase();
    const targetWord = gameState.targetWord;

    if (guessUpper.length !== targetWord.length) {
      throw new Error(`Word must be ${targetWord.length} letters long`);
    }

    // Calculate letter feedback
    const feedback = this.calculateFeedback(guessUpper, targetWord);

    // Create guess result
    const guessResult = {
      word: guessUpper,
      feedback,
      guessNumber: gameState.currentGuess + 1
    };

    gameState.guesses.push(guessResult);
    gameState.currentGuess++;

    // Check if won
    if (guessUpper === targetWord) {
      gameState.gameStatus = 'won';
      gameState.endTime = Date.now();
      gameState.score = this.calculateScore(gameState);
    }
    // Check if lost
    else if (gameState.currentGuess >= gameState.maxGuesses) {
      gameState.gameStatus = 'lost';
      gameState.endTime = Date.now();
    }

    return {
      guessResult,
      gameState: this.getPublicGameState(gameState)
    };
  }

  /**
   * Calculate feedback for a guess
   * @param {string} guess - The guessed word
   * @param {string} target - The target word
   * @returns {Array} - Feedback array
   */
  calculateFeedback(guess, target) {
    const feedback = new Array(guess.length).fill('absent');
    const targetLetters = target.split('');
    const guessLetters = guess.split('');

    // First pass: mark correct positions
    for (let i = 0; i < guessLetters.length; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        feedback[i] = 'correct';
        targetLetters[i] = null; // Mark as used
        guessLetters[i] = null;
      }
    }

    // Second pass: mark present letters
    for (let i = 0; i < guessLetters.length; i++) {
      if (guessLetters[i] !== null) {
        const targetIndex = targetLetters.indexOf(guessLetters[i]);
        if (targetIndex !== -1) {
          feedback[i] = 'present';
          targetLetters[targetIndex] = null; // Mark as used
        }
      }
    }

    return feedback;
  }

  /**
   * Calculate final score
   * @param {Object} gameState - Game state
   * @returns {number} - Score
   */
  calculateScore(gameState) {
    if (gameState.gameStatus !== 'won') {
      return 0;
    }

    const baseScore = 1000;
    const guessBonus = (gameState.maxGuesses - gameState.currentGuess) * 100;
    const timeBonus = Math.max(0, 500 - Math.floor((gameState.endTime - gameState.startTime) / 1000) * 10);

    return baseScore + guessBonus + timeBonus;
  }

  /**
   * Get game by session ID
   * @param {string} sessionId - Session identifier
   * @returns {Object} - Public game state
   */
  getGame(sessionId) {
    const gameState = this.games.get(sessionId);
    if (!gameState) {
      throw new Error('Game session not found');
    }
    return this.getPublicGameState(gameState);
  }

  /**
   * Delete a game session
   * @param {string} sessionId - Session identifier
   */
  deleteGame(sessionId) {
    this.games.delete(sessionId);
  }

  /**
   * Get all active games count
   * @returns {number} - Number of active games
   */
  getActiveGamesCount() {
    return this.games.size;
  }
}

module.exports = new Game();
