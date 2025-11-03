/**
 * Main application entry point for WURDSMYTH
 * Initializes the game and sets up event listeners
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    setupEventListeners();
    loadStatistics();
    updateModeDescription();
    showWelcomeMessage();
    checkForSavedGame();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Setup screen event listeners
    setupSetupScreen();

    // Game screen event listeners
    setupGameScreen();

    // Game over screen event listeners
    setupGameOverScreen();

    // Keyboard event listeners
    setupKeyboardListeners();

    // Wizard interaction
    setupWizardInteraction();
}

/**
 * Setup screen event listeners
 */
function setupSetupScreen() {
    const startGameBtn = document.getElementById('start-game-btn');
    const gameModeSelect = document.getElementById('game-mode');
    const difficultySelect = document.getElementById('difficulty');

    startGameBtn.addEventListener('click', async () => {
        const gameMode = gameModeSelect.value;
        const difficulty = difficultySelect.value;
        await game.startGame(difficulty, gameMode);
    });

    gameModeSelect.addEventListener('change', () => {
        updateModeDescription();
    });
}

/**
 * Setup game screen event listeners
 */
function setupGameScreen() {
    const hintBtn = document.getElementById('hint-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const quitBtn = document.getElementById('quit-btn');

    hintBtn.addEventListener('click', () => {
        game.getHint();
    });

    newGameBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to start a new game? Current progress will be lost.')) {
            await game.endGame();
            await game.startGame(game.difficulty, game.gameMode);
        }
    });

    quitBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to quit? Current progress will be lost.')) {
            await game.endGame();
            ui.showScreen('setup-screen');
        }
    });

    // Multiple choice buttons (delegated event listener)
    document.getElementById('word-choices').addEventListener('click', async (e) => {
        if (e.target.classList.contains('choice-btn')) {
            // Remove previous selection
            document.querySelectorAll('.choice-btn').forEach(btn => {
                btn.classList.remove('selected');
            });

            // Mark as selected
            e.target.classList.add('selected');

            // Handle choice
            const choice = e.target.dataset.choice;
            await game.handleMultipleChoice(choice);
        }
    });
}

/**
 * Setup game over screen event listeners
 */
function setupGameOverScreen() {
    const playAgainBtn = document.getElementById('play-again-btn');
    const mainMenuBtn = document.getElementById('main-menu-btn');

    playAgainBtn.addEventListener('click', async () => {
        await game.startGame(game.difficulty, game.gameMode);
    });

    mainMenuBtn.addEventListener('click', async () => {
        await game.endGame();
        ui.showScreen('setup-screen');
    });
}

/**
 * Setup keyboard event listeners
 */
function setupKeyboardListeners() {
    // Physical keyboard
    document.addEventListener('keydown', (e) => {
        if (game.currentGame && game.currentGame.gameStatus === 'active') {
            if (e.key === 'Enter') {
                game.handleKeyPress('ENTER');
            } else if (e.key === 'Backspace') {
                game.handleKeyPress('BACKSPACE');
            } else if (/^[a-zA-Z]$/.test(e.key)) {
                game.handleKeyPress(e.key.toUpperCase());
            }
        }
    });

    // On-screen keyboard
    document.getElementById('keyboard').addEventListener('click', (e) => {
        if (e.target.classList.contains('key')) {
            const key = e.target.dataset.key;
            game.handleKeyPress(key);
        }
    });
}

/**
 * Setup wizard interaction
 */
function setupWizardInteraction() {
    const wizard = document.getElementById('word-wizard');

    wizard.addEventListener('click', () => {
        const messages = [
            "Keep going! You're doing great! ⭐",
            "Believe in your vocabulary skills! 💪",
            "Every word is a new adventure! 🎯",
            "You've got the power of words! 🔮",
            "Learning is magical! ✨"
        ];
        ui.wizardSpeak(ui.getRandomMessage(messages));
    });
}

/**
 * Update mode description based on selected game mode
 */
function updateModeDescription() {
    const gameModeSelect = document.getElementById('game-mode');
    const modeDescription = document.getElementById('mode-description');

    const descriptions = {
        'classic': 'Guess the hidden word in 6 tries. Each guess reveals clues about letter positions. Green means correct position, yellow means the letter is in the word but wrong position, and gray means the letter is not in the word.',
        'fill_blank': 'Read the definition and sentence context, then guess the word that fits. You have 6 attempts to find the correct word that completes the sentence.',
        'multiple_choice': 'Read the definition and sentence, then choose the correct word from four options. Select carefully - you have limited attempts!'
    };

    const selectedMode = gameModeSelect.value;
    modeDescription.querySelector('p').textContent = descriptions[selectedMode] || descriptions.classic;
}

/**
 * Load and display statistics
 */
function loadStatistics() {
    const stats = game.getStatistics();
    ui.updateStats(stats);
}

/**
 * Show welcome message
 */
function showWelcomeMessage() {
    setTimeout(() => {
        ui.wizardSpeak(ui.getRandomMessage(CONFIG.WIZARD_MESSAGES.WELCOME));
    }, 500);
}

/**
 * Check for saved game and offer to resume
 */
function checkForSavedGame() {
    const savedGame = game.loadGameState();

    if (savedGame && savedGame.currentGame && savedGame.currentGame.gameStatus === 'active') {
        if (confirm('You have a game in progress. Would you like to resume?')) {
            resumeSavedGame(savedGame);
        } else {
            game.clearGameState();
        }
    }
}

/**
 * Resume a saved game
 * @param {Object} savedGame - Saved game state
 */
async function resumeSavedGame(savedGame) {
    try {
        // Restore game state
        game.currentGame = savedGame.currentGame;
        game.currentRow = savedGame.currentRow;
        game.currentGuess = savedGame.currentGuess;
        game.gameMode = savedGame.gameMode;
        game.difficulty = savedGame.difficulty;
        game.wordData = savedGame.wordData;

        // Update UI
        document.getElementById('current-mode').textContent = game.getGameModeName(game.gameMode);
        document.getElementById('current-difficulty').textContent = game.getDifficultyName(game.difficulty);

        // Recreate game board
        ui.createGameBoard(game.currentGame.wordLength, game.currentGame.maxGuesses);

        // Restore guesses
        if (game.currentGame.guesses) {
            for (let i = 0; i < game.currentGame.guesses.length; i++) {
                const guess = game.currentGame.guesses[i];
                // Update tiles
                for (let j = 0; j < guess.word.length; j++) {
                    ui.updateTile(i, j, guess.word[j], guess.feedback[j]);
                }
                // Update keyboard
                ui.updateKeyboard(guess.word, guess.feedback);
            }
        }

        // Restore current guess if any
        if (game.currentGuess) {
            for (let i = 0; i < game.currentGuess.length; i++) {
                ui.updateTile(game.currentRow, i, game.currentGuess[i], CONFIG.TILE_STATES.FILLED);
            }
        }

        // Display context content
        if (game.gameMode !== CONFIG.GAME_MODES.CLASSIC && game.wordData) {
            ui.displayContextContent(game.wordData, game.gameMode);
        }

        // Update game info
        ui.updateGameInfo(game.currentGame);

        // Show game screen
        ui.showScreen('game-screen');

        ui.showToast('Game resumed!', 'success');
        ui.wizardSpeak('Welcome back! Let\'s continue your adventure! 🎮');
    } catch (error) {
        console.error('Error resuming game:', error);
        ui.showToast('Failed to resume game. Starting fresh.', 'error');
        game.clearGameState();
    }
}

/**
 * Check API health on load
 */
async function checkAPIHealth() {
    try {
        await api.healthCheck();
        console.log('✅ API connection successful');
    } catch (error) {
        console.error('❌ API connection failed:', error);
        ui.showToast('Warning: Could not connect to game server. Some features may not work.', 'warning');
    }
}

// Check API health
checkAPIHealth();

// Service Worker registration (for PWA support in future)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('ServiceWorker registered'))
        //     .catch(err => console.log('ServiceWorker registration failed'));
    });
}

// Export for testing/debugging
window.game = game;
window.ui = ui;
window.api = api;

console.log('%c🎮 WURDSMYTH Game Loaded Successfully! 🎮', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cGame Objects Available:', 'color: #10b981; font-weight: bold;');
console.log('  - game: Game Manager');
console.log('  - ui: UI Service');
console.log('  - api: API Service');
console.log('%cHappy Playing! ✨', 'color: #fbbf24; font-weight: bold;');
