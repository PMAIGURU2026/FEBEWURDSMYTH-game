/**
 * Main application entry point for WURDSMYTH
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Auth gate: redirect to login unless user is signed in or chose guest play
    const user = JSON.parse(localStorage.getItem('wurdsmyth_user') || 'null');
    const isGuest = localStorage.getItem('wurdsmyth_guest') === 'true';

    if (!user && !isGuest) {
        window.location.href = 'auth.html';
        return;
    }

    setupEventListeners();
    loadStatistics();
    updateModeDescription();
    showWelcomeMessage();
    checkForSavedGame();

    // Show the right banner
    if (user) {
        loadUserDashboard();
    } else {
        document.getElementById('guest-banner').classList.remove('hidden');
    }
}

/** Load and display the signed-in user's dashboard */
async function loadUserDashboard() {
    const user = JSON.parse(localStorage.getItem('wurdsmyth_user') || 'null');
    const token = localStorage.getItem('wurdsmyth_token');
    if (!user || !token) return;

    document.getElementById('user-dashboard').classList.remove('hidden');
    document.getElementById('user-greeting').textContent = `Welcome back, ${user.username}! 🧙`;

    try {
        const { stats } = await api.getUserProfile(token);
        if (stats) {
            document.getElementById('dash-streak').textContent = stats.current_streak || 0;
            document.getElementById('dash-points').textContent = stats.total_points || 0;

            const badges = Array.isArray(stats.badges_earned) ? stats.badges_earned : [];
            document.getElementById('dash-badges').textContent = badges.length;

            // Badge icons — map known badge ids to icons
            const BADGE_ICONS = {
                first_play: '🎮',
                seven_day_streak: '🔥',
                hundred_points: '💯',
                word_master: '🏆',
                sharp_shooter: '🎯'
            };
            const badgeRow = document.getElementById('badge-row');
            badgeRow.innerHTML = '';
            badges.forEach(b => {
                const icon = BADGE_ICONS[b.id] || '🏅';
                const chip = document.createElement('span');
                chip.className = 'badge-chip';
                chip.textContent = icon + ' ' + b.id.replace(/_/g, ' ');
                badgeRow.appendChild(chip);
            });
        }
    } catch (err) {
        console.error('Failed to load user dashboard:', err);
    }
}

function setupEventListeners() {
    setupSetupScreen();
    setupGameScreen();
    setupGameOverScreen();
    setupKeyboardListeners();
    setupWizardInteraction();
    setupAuthButtons();
}

function setupAuthButtons() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('wurdsmyth_token');
            localStorage.removeItem('wurdsmyth_user');
            localStorage.removeItem('wurdsmyth_guest');
            window.location.href = 'auth.html';
        });
    }
}

function setupSetupScreen() {
    const startGameBtn = document.getElementById('start-game-btn');
    const gameModeSelect = document.getElementById('game-mode');

    startGameBtn.addEventListener('click', async () => {
        const gameMode = gameModeSelect.value;
        const difficulty = document.getElementById('difficulty').value;
        await game.startGame(difficulty, gameMode);
    });

    gameModeSelect.addEventListener('change', () => {
        updateModeDescription();
    });
}

function setupGameScreen() {
    const hintBtn = document.getElementById('hint-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const quitBtn = document.getElementById('quit-btn');

    hintBtn.addEventListener('click', () => { game.getHint(); });

    newGameBtn.addEventListener('click', async () => {
        if (confirm('Start a new game? Current progress will be lost.')) {
            await game.endGame();
            await game.startGame(game.difficulty, game.gameMode);
        }
    });

    quitBtn.addEventListener('click', async () => {
        if (confirm('Quit? Current progress will be lost.')) {
            await game.endGame();
            ui.showScreen('setup-screen');
        }
    });

    document.getElementById('word-choices').addEventListener('click', async (e) => {
        if (e.target.classList.contains('choice-btn')) {
            document.querySelectorAll('.choice-btn').forEach(btn => btn.classList.remove('selected'));
            e.target.classList.add('selected');
            await game.handleMultipleChoice(e.target.dataset.choice);
        }
    });
}

function setupGameOverScreen() {
    document.getElementById('play-again-btn').addEventListener('click', async () => {
        await game.startGame(game.difficulty, game.gameMode);
    });

    document.getElementById('main-menu-btn').addEventListener('click', async () => {
        await game.endGame();
        ui.showScreen('setup-screen');
    });
}

function setupKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
        if (game.currentGame && game.currentGame.gameStatus === 'active') {
            if (e.key === 'Enter') game.handleKeyPress('ENTER');
            else if (e.key === 'Backspace') game.handleKeyPress('BACKSPACE');
            else if (/^[a-zA-Z]$/.test(e.key)) game.handleKeyPress(e.key.toUpperCase());
        }
    });

    document.getElementById('keyboard').addEventListener('click', (e) => {
        if (e.target.classList.contains('key')) {
            game.handleKeyPress(e.target.dataset.key);
        }
    });
}

function setupWizardInteraction() {
    document.getElementById('word-wizard').addEventListener('click', () => {
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

function updateModeDescription() {
    const descriptions = {
        'classic': 'Guess the hidden word in 6 tries. Green = correct spot, yellow = wrong spot, gray = not in word.',
        'fill_blank': 'Read the definition and sentence context, then type the word that fills the blank.',
        'multiple_choice': 'Read the definition and sentence, then select the correct word from four options.'
    };
    const selected = document.getElementById('game-mode').value;
    document.getElementById('mode-description').querySelector('p').textContent =
        descriptions[selected] || descriptions.classic;
}

function loadStatistics() {
    const stats = game.getStatistics();
    ui.updateStats(stats);
}

function showWelcomeMessage() {
    setTimeout(() => {
        ui.wizardSpeak(ui.getRandomMessage(CONFIG.WIZARD_MESSAGES.WELCOME));
    }, 500);
}

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

async function resumeSavedGame(savedGame) {
    try {
        game.currentGame = savedGame.currentGame;
        game.currentRow = savedGame.currentRow;
        game.currentGuess = savedGame.currentGuess;
        game.gameMode = savedGame.gameMode;
        game.difficulty = savedGame.difficulty;
        game.wordData = savedGame.wordData;

        document.getElementById('current-mode').textContent = game.getGameModeName(game.gameMode);
        document.getElementById('current-difficulty').textContent = game.getDifficultyName(game.difficulty);

        ui.createGameBoard(game.currentGame.wordLength, game.currentGame.maxGuesses);

        if (game.currentGame.guesses) {
            for (let i = 0; i < game.currentGame.guesses.length; i++) {
                const guess = game.currentGame.guesses[i];
                for (let j = 0; j < guess.word.length; j++) {
                    ui.updateTile(i, j, guess.word[j], guess.feedback[j]);
                }
                ui.updateKeyboard(guess.word, guess.feedback);
            }
        }

        if (game.currentGuess) {
            for (let i = 0; i < game.currentGuess.length; i++) {
                ui.updateTile(game.currentRow, i, game.currentGuess[i], CONFIG.TILE_STATES.FILLED);
            }
        }

        if (game.gameMode !== CONFIG.GAME_MODES.CLASSIC && game.wordData) {
            ui.displayContextContent(game.wordData, game.gameMode);
        }

        ui.updateGameInfo(game.currentGame);
        ui.showScreen('game-screen');

        ui.showToast('Game resumed!', 'success');
        ui.wizardSpeak('Welcome back! Let\'s continue your adventure! 🎮');
    } catch (error) {
        console.error('Error resuming game:', error);
        ui.showToast('Failed to resume game. Starting fresh.', 'error');
        game.clearGameState();
    }
}

async function checkAPIHealth() {
    try {
        await api.healthCheck();
    } catch (error) {
        ui.showToast('Warning: Could not connect to game server. Some features may not work.', 'warning');
    }
}

function toggleMusic() {
    const on = AudioEngine.toggle();
    const btn = document.getElementById('music-btn');
    if (btn) btn.textContent = on ? '🎵 Music: ON' : '🎵 Music: OFF';
}

// Click logo to toggle music
document.querySelector('.header-logo-float')?.addEventListener('click', toggleMusic);

checkAPIHealth();

window.game = game;
window.ui = ui;
window.api = api;

console.log('%c🎮 WURDSMYTH Loaded!', 'color: #6366f1; font-size: 18px; font-weight: bold;');
