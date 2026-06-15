/**
 * Configuration file for WURDSMYTH game
 */

const CONFIG = {
    // API Configuration
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : '/api', // Vercel serves API and frontend from the same domain

    // Game Settings
    MAX_GUESSES: 6,

    // Game Modes
    GAME_MODES: {
        CLASSIC: 'classic',
        FILL_BLANK: 'fill_blank',
        MULTIPLE_CHOICE: 'multiple_choice'
    },

    // Difficulty Levels
    DIFFICULTY_LEVELS: {
        EASY: 'easy',
        MEDIUM: 'medium',
        HARD: 'hard',
        EXPERT: 'expert'
    },

    // Tile States
    TILE_STATES: {
        EMPTY: 'empty',
        FILLED: 'filled',
        ABSENT: 'absent',
        PRESENT: 'present',
        CORRECT: 'correct'
    },

    // Local Storage Keys
    STORAGE_KEYS: {
        STATS: 'wurdsmyth_stats',
        CURRENT_GAME: 'wurdsmyth_current_game',
        SETTINGS: 'wurdsmyth_settings'
    },

    // Wizard Messages
    WIZARD_MESSAGES: {
        WELCOME: [
            "Welcome, brave word warrior! 📚",
            "Ready to embark on a vocabulary adventure? ✨",
            "Let's explore the realm of words together! 🔮"
        ],
        CORRECT_GUESS: [
            "Brilliant! You're a true wordsmith! 🌟",
            "Excellent guess! Keep it up! 💫",
            "Marvelous! Your vocabulary is impressive! ✨",
            "Spectacular! You've mastered that word! 🎯"
        ],
        WRONG_GUESS: [
            "Not quite, but keep trying! 💪",
            "Close one! You're getting warmer! 🔥",
            "Good attempt! Try another approach! 🤔",
            "Don't give up! You've got this! 💡"
        ],
        WIN: [
            "🎉 Victory! You've conquered this word!",
            "🏆 Amazing! You're a true word wizard!",
            "⭐ Spectacular performance! You win!",
            "🌟 Brilliant! You've mastered the challenge!"
        ],
        LOSE: [
            "Good effort! Every try makes you stronger! 💪",
            "Almost there! Let's try another word! 🎯",
            "Great attempt! Ready for the next challenge? 🔮",
            "Nice try! Practice makes perfect! ✨"
        ],
        HINT: [
            "Here's a little magical hint for you! 💡",
            "Let me sprinkle some wisdom your way! ✨",
            "A clue from the word wizard! 🔮"
        ]
    },

    // Animation Durations (milliseconds)
    ANIMATION_DURATION: {
        TILE_FLIP: 500,
        TILE_BOUNCE: 300,
        WIZARD_SPEECH: 3000,
        TOAST: 3000,
        FIREWORKS: 3000
    }
};

// Freeze the config to prevent modifications
Object.freeze(CONFIG);
