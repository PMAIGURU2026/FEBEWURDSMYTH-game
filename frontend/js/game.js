/**
 * Game Logic for WURDSMYTH
 * Manages game state, user input, and game flow
 */

class GameManager {
    constructor() {
        this.currentGame = null;
        this.currentGuess = '';
        this.currentRow = 0;
        this.gameMode = CONFIG.GAME_MODES.CLASSIC;
        this.difficulty = CONFIG.DIFFICULTY_LEVELS.MEDIUM;
        this.wordData = null;
        this.isProcessing = false;
    }

    /**
     * Start a new game
     * @param {string} difficulty - Difficulty level
     * @param {string} gameMode - Game mode
     */
    async startGame(difficulty, gameMode) {
        try {
            ui.setLoading(true);
            ui.wizardSpeak(ui.getRandomMessage(CONFIG.WIZARD_MESSAGES.WELCOME));

            this.difficulty = difficulty;
            this.gameMode = gameMode;
            this.currentGuess = '';
            this.currentRow = 0;
            this.isProcessing = false;

            // Start game via API
            const response = await api.startGame(difficulty, gameMode);
            this.currentGame = response;
            this.wordData = response.wordData;

            // Update UI
            document.getElementById('current-mode').textContent = this.getGameModeName(gameMode);
            document.getElementById('current-difficulty').textContent = this.getDifficultyName(difficulty);

            // Create game board
            ui.createGameBoard(response.wordLength, response.maxGuesses);
            ui.resetKeyboard();

            // Display context content for non-classic modes
            if (gameMode !== CONFIG.GAME_MODES.CLASSIC) {
                ui.displayContextContent(this.wordData, gameMode);
            }

            // Update game info
            ui.updateGameInfo(response);

            // Show game screen
            ui.showScreen('game-screen');

            // Save game state
            this.saveGameState();

            ui.setLoading(false);
        } catch (error) {
            console.error('Error starting game:', error);
            ui.showToast('Failed to start game. Please try again.', 'error');
            ui.setLoading(false);
        }
    }

    /**
     * Handle key press
     * @param {string} key - Pressed key
     */
    async handleKeyPress(key) {
        if (this.isProcessing || !this.currentGame || this.currentGame.gameStatus !== 'active') {
            return;
        }

        if (key === 'ENTER') {
            await this.submitGuess();
        } else if (key === 'BACKSPACE') {
            this.deleteLetter();
        } else if (key.length === 1 && key.match(/[A-Z]/i)) {
            this.addLetter(key.toUpperCase());
        }
    }

    /**
     * Add letter to current guess
     * @param {string} letter - Letter to add
     */
    addLetter(letter) {
        if (this.currentGuess.length < this.currentGame.wordLength) {
            this.currentGuess += letter;
            ui.updateTile(this.currentRow, this.currentGuess.length - 1, letter, CONFIG.TILE_STATES.FILLED);
        }
    }

    /**
     * Delete last letter
     */
    deleteLetter() {
        if (this.currentGuess.length > 0) {
            this.currentGuess = this.currentGuess.slice(0, -1);
            ui.updateTile(this.currentRow, this.currentGuess.length, '', CONFIG.TILE_STATES.EMPTY);
        }
    }

    /**
     * Submit current guess
     */
    async submitGuess() {
        if (this.currentGuess.length !== this.currentGame.wordLength) {
            ui.showToast(`Word must be ${this.currentGame.wordLength} letters long`, 'warning');
            return;
        }

        try {
            this.isProcessing = true;
            ui.setLoading(true);

            // Validate word first
            const validationResult = await api.validateWord(this.currentGuess);

            if (!validationResult.valid) {
                ui.showToast('Word not in dictionary', 'error');
                this.shakeRow(this.currentRow);
                this.isProcessing = false;
                ui.setLoading(false);
                return;
            }

            // Submit guess
            const result = await api.submitGuess(this.currentGame.sessionId, this.currentGuess);

            // Animate feedback
            await ui.animateRowFeedback(
                this.currentRow,
                result.guessResult.feedback,
                this.currentGuess
            );

            // Add hover effects for definitions
            if (validationResult.details) {
                ui.addTileHoverEffects(validationResult.details);
            }

            // Update game state
            this.currentGame = result.gameState;
            ui.updateGameInfo(this.currentGame);

            // Check game status
            if (this.currentGame.gameStatus === 'won') {
                this.handleWin();
            } else if (this.currentGame.gameStatus === 'lost') {
                this.handleLoss();
            } else {
                // Continue game
                this.currentRow++;
                this.currentGuess = '';

                // Wizard feedback
                if (result.guessResult.feedback.includes(CONFIG.TILE_STATES.CORRECT)) {
                    ui.wizardSpeak(ui.getRandomMessage(CONFIG.WIZARD_MESSAGES.CORRECT_GUESS));
                } else {
                    ui.wizardSpeak(ui.getRandomMessage(CONFIG.WIZARD_MESSAGES.WRONG_GUESS));
                }
            }

            this.saveGameState();
            this.isProcessing = false;
            ui.setLoading(false);
        } catch (error) {
            console.error('Error submitting guess:', error);
            ui.showToast(error.message || 'Failed to submit guess', 'error');
            this.isProcessing = false;
            ui.setLoading(false);
        }
    }

    /**
     * Handle multiple choice selection
     * @param {string} choice - Selected choice
     */
    async handleMultipleChoice(choice) {
        this.currentGuess = choice;

        // Fill the board with the choice
        for (let i = 0; i < choice.length; i++) {
            ui.updateTile(this.currentRow, i, choice[i], CONFIG.TILE_STATES.FILLED);
        }

        // Auto-submit
        await this.submitGuess();
    }

    /**
     * Handle win condition
     */
    handleWin() {
        ui.wizardSpeak(ui.getRandomMessage(CONFIG.WIZARD_MESSAGES.WIN));
        ui.wizardCelebrate();
        ui.showToast('Congratulations! You won!', 'success');

        // Update statistics
        this.updateStatistics(true);

        // Show game over screen after animation
        setTimeout(() => {
            ui.showGameOver(this.currentGame, this.wordData);
        }, 1500);
    }

    /**
     * Handle loss condition
     */
    handleLoss() {
        ui.wizardSpeak(ui.getRandomMessage(CONFIG.WIZARD_MESSAGES.LOSE));
        ui.showToast(`The word was ${this.currentGame.targetWord}`, 'info');

        // Update statistics
        this.updateStatistics(false);

        // Show game over screen after animation
        setTimeout(() => {
            ui.showGameOver(this.currentGame, this.wordData);
        }, 1500);
    }

    /**
     * Shake row animation for invalid word
     * @param {number} rowIndex - Row to shake
     */
    shakeRow(rowIndex) {
        const row = document.querySelector(`[data-row="${rowIndex}"]`);
        if (row) {
            row.style.animation = 'shake 0.5s';
            setTimeout(() => {
                row.style.animation = '';
            }, 500);
        }
    }

    /**
     * Get hint for current game
     */
    async getHint() {
        if (!this.currentGame) return;

        try {
            ui.wizardSpeak(ui.getRandomMessage(CONFIG.WIZARD_MESSAGES.HINT));

            let hintMessage = `The word has ${this.currentGame.wordLength} letters.`;

            if (this.wordData && this.wordData.definition) {
                hintMessage += `\n\nDefinition: ${this.wordData.definition}`;
            }

            ui.showToast(hintMessage, 'info');
        } catch (error) {
            console.error('Error getting hint:', error);
            ui.showToast('Failed to get hint', 'error');
        }
    }

    /**
     * End current game
     */
    async endGame() {
        if (this.currentGame) {
            try {
                await api.endGame(this.currentGame.sessionId);
            } catch (error) {
                console.error('Error ending game:', error);
            }
        }

        this.currentGame = null;
        this.clearGameState();
    }

    /**
     * Update and save statistics
     * @param {boolean} isWin - Whether the game was won
     */
    updateStatistics(isWin) {
        const stats = this.getStatistics();

        stats.totalGames++;
        if (isWin) {
            stats.gamesWon++;
            if (this.currentGame.score > stats.bestScore) {
                stats.bestScore = this.currentGame.score;
            }
        }

        stats.winRate = ((stats.gamesWon / stats.totalGames) * 100).toFixed(1) + '%';

        this.saveStatistics(stats);
        ui.updateStats(stats);
    }

    /**
     * Get statistics from local storage
     * @returns {Object} Statistics object
     */
    getStatistics() {
        const defaultStats = {
            totalGames: 0,
            gamesWon: 0,
            winRate: '0%',
            bestScore: 0
        };

        try {
            const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.STATS);
            return stored ? JSON.parse(stored) : defaultStats;
        } catch (error) {
            console.error('Error loading statistics:', error);
            return defaultStats;
        }
    }

    /**
     * Save statistics to local storage
     * @param {Object} stats - Statistics object
     */
    saveStatistics(stats) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.STATS, JSON.stringify(stats));
        } catch (error) {
            console.error('Error saving statistics:', error);
        }
    }

    /**
     * Save current game state to local storage
     */
    saveGameState() {
        try {
            const gameState = {
                currentGame: this.currentGame,
                currentRow: this.currentRow,
                currentGuess: this.currentGuess,
                gameMode: this.gameMode,
                difficulty: this.difficulty,
                wordData: this.wordData
            };
            localStorage.setItem(CONFIG.STORAGE_KEYS.CURRENT_GAME, JSON.stringify(gameState));
        } catch (error) {
            console.error('Error saving game state:', error);
        }
    }

    /**
     * Load game state from local storage
     * @returns {Object|null} Saved game state
     */
    loadGameState() {
        try {
            const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.CURRENT_GAME);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error loading game state:', error);
            return null;
        }
    }

    /**
     * Clear game state from local storage
     */
    clearGameState() {
        try {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.CURRENT_GAME);
        } catch (error) {
            console.error('Error clearing game state:', error);
        }
    }

    /**
     * Get friendly game mode name
     * @param {string} mode - Game mode
     * @returns {string} Friendly name
     */
    getGameModeName(mode) {
        const names = {
            [CONFIG.GAME_MODES.CLASSIC]: 'Classic Wordle',
            [CONFIG.GAME_MODES.FILL_BLANK]: 'Fill in the Blank',
            [CONFIG.GAME_MODES.MULTIPLE_CHOICE]: 'Multiple Choice'
        };
        return names[mode] || mode;
    }

    /**
     * Get friendly difficulty name
     * @param {string} difficulty - Difficulty level
     * @returns {string} Friendly name
     */
    getDifficultyName(difficulty) {
        const names = {
            [CONFIG.DIFFICULTY_LEVELS.EASY]: 'Easy',
            [CONFIG.DIFFICULTY_LEVELS.MEDIUM]: 'Medium',
            [CONFIG.DIFFICULTY_LEVELS.HARD]: 'Hard',
            [CONFIG.DIFFICULTY_LEVELS.EXPERT]: 'Expert'
        };
        return names[difficulty] || difficulty;
    }
}

// Create and export game manager instance
const game = new GameManager();

// Add shake animation to CSS if not present
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
}
`;
document.head.appendChild(style);
