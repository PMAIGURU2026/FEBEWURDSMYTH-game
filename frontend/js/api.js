/**
 * API Service for WURDSMYTH game
 * Handles all communication with the backend
 */

class APIService {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    /**
     * Generic fetch wrapper with error handling
     */
    async fetch(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An error occurred');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * Start a new game
     * @param {string} difficulty - Difficulty level
     * @param {string} gameMode - Game mode
     * @returns {Promise<Object>} Game state
     */
    async startGame(difficulty = 'medium', gameMode = 'classic') {
        return this.fetch('/game/start', {
            method: 'POST',
            body: JSON.stringify({ difficulty, gameMode })
        });
    }

    /**
     * Submit a guess
     * @param {string} sessionId - Game session ID
     * @param {string} guess - The guessed word
     * @returns {Promise<Object>} Guess result
     */
    async submitGuess(sessionId, guess) {
        return this.fetch('/game/guess', {
            method: 'POST',
            body: JSON.stringify({ sessionId, guess })
        });
    }

    /**
     * Get current game state
     * @param {string} sessionId - Game session ID
     * @returns {Promise<Object>} Game state
     */
    async getGameState(sessionId) {
        return this.fetch(`/game/${sessionId}`);
    }

    /**
     * Validate a word
     * @param {string} word - Word to validate
     * @returns {Promise<Object>} Validation result
     */
    async validateWord(word) {
        return this.fetch('/game/validate', {
            method: 'POST',
            body: JSON.stringify({ word })
        });
    }

    /**
     * Get hint for current game
     * @param {string} sessionId - Game session ID
     * @returns {Promise<Object>} Hint data
     */
    async getHint(sessionId) {
        return this.fetch(`/game/${sessionId}/hint`);
    }

    /**
     * End game session
     * @param {string} sessionId - Game session ID
     * @returns {Promise<Object>} Confirmation
     */
    async endGame(sessionId) {
        return this.fetch(`/game/${sessionId}`, {
            method: 'DELETE'
        });
    }

    /**
     * Get game statistics
     * @returns {Promise<Object>} Statistics
     */
    async getStats() {
        return this.fetch('/game/stats');
    }

    /**
     * Get words by difficulty level
     * @param {string} level - Difficulty level
     * @returns {Promise<Object>} Words list
     */
    async getWordsByDifficulty(level) {
        return this.fetch(`/game/words/${level}`);
    }

    /**
     * Health check
     * @returns {Promise<Object>} Server health status
     */
    async healthCheck() {
        return this.fetch('/health');
    }
}

// Create and export API instance
const api = new APIService(CONFIG.API_BASE_URL);
