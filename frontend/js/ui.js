/**
 * UI Service for WURDSMYTH game
 * Handles all UI interactions, animations, and visual feedback
 */

class UIService {
    constructor() {
        this.wizard = document.getElementById('word-wizard');
        this.wizardSpeech = document.getElementById('wizard-speech');
        this.fireworksContainer = document.getElementById('fireworks-container');
        this.toastContainer = document.getElementById('toast-container');
        this.definitionTooltip = document.getElementById('definition-tooltip');
    }

    /**
     * Show a screen and hide others
     * @param {string} screenId - ID of screen to show
     */
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    /**
     * Make wizard speak
     * @param {string} message - Message to display
     * @param {number} duration - Display duration in ms
     */
    wizardSpeak(message, duration = CONFIG.ANIMATION_DURATION.WIZARD_SPEECH) {
        this.wizardSpeech.textContent = message;
        this.wizardSpeech.classList.add('active');

        setTimeout(() => {
            this.wizardSpeech.classList.remove('active');
        }, duration);
    }

    /**
     * Animate wizard celebration
     */
    wizardCelebrate() {
        this.wizard.classList.add('wizard-celebrating');
        setTimeout(() => {
            this.wizard.classList.remove('wizard-celebrating');
        }, 1500);
    }

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type (success, error, warning, info)
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        this.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, CONFIG.ANIMATION_DURATION.TOAST);
    }

    /**
     * Create fireworks animation
     */
    createFireworks() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];
        const fireworkCount = 50;

        for (let i = 0; i < fireworkCount; i++) {
            setTimeout(() => {
                this.createSingleFirework(colors);
            }, i * 100);
        }
    }

    /**
     * Create a single firework
     * @param {Array} colors - Array of colors
     */
    createSingleFirework(colors) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight * 0.6);
        const color = colors[Math.floor(Math.random() * colors.length)];

        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = color;

            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 50 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            particle.style.setProperty('--vx', vx + 'px');
            particle.style.setProperty('--vy', vy + 'px');

            this.fireworksContainer.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }

    /**
     * Show definition tooltip
     * @param {HTMLElement} element - Element to show tooltip near
     * @param {string} word - Word to display
     * @param {string} definition - Definition to display
     */
    showDefinitionTooltip(element, word, definition) {
        const tooltipWord = document.getElementById('tooltip-word');
        const tooltipDefinition = document.getElementById('tooltip-definition');

        tooltipWord.textContent = word;
        tooltipDefinition.textContent = definition;

        const rect = element.getBoundingClientRect();
        const tooltipRect = this.definitionTooltip.getBoundingClientRect();

        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;

        // Adjust if tooltip goes off screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 10;
        }

        this.definitionTooltip.style.left = left + 'px';
        this.definitionTooltip.style.top = top + 'px';
        this.definitionTooltip.classList.add('active');
    }

    /**
     * Hide definition tooltip
     */
    hideDefinitionTooltip() {
        this.definitionTooltip.classList.remove('active');
    }

    /**
     * Create game board
     * @param {number} wordLength - Length of the word
     * @param {number} maxGuesses - Maximum number of guesses
     */
    createGameBoard(wordLength, maxGuesses = CONFIG.MAX_GUESSES) {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';

        for (let i = 0; i < maxGuesses; i++) {
            const row = document.createElement('div');
            row.className = 'board-row';
            row.dataset.row = i;

            for (let j = 0; j < wordLength; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.dataset.col = j;
                row.appendChild(tile);
            }

            gameBoard.appendChild(row);
        }
    }

    /**
     * Update tile
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {string} letter - Letter to display
     * @param {string} state - Tile state
     */
    updateTile(row, col, letter, state = CONFIG.TILE_STATES.FILLED) {
        const boardRow = document.querySelector(`[data-row="${row}"]`);
        if (!boardRow) return;

        const tile = boardRow.querySelector(`[data-col="${col}"]`);
        if (!tile) return;

        tile.textContent = letter;
        tile.className = `tile ${state}`;

        if (state === CONFIG.TILE_STATES.FILLED) {
            tile.classList.add('filled');
        }
    }

    /**
     * Animate row with feedback
     * @param {number} rowIndex - Row index
     * @param {Array} feedback - Feedback array
     * @param {string} word - The guessed word
     */
    async animateRowFeedback(rowIndex, feedback, word) {
        const row = document.querySelector(`[data-row="${rowIndex}"]`);
        const tiles = row.querySelectorAll('.tile');

        for (let i = 0; i < tiles.length; i++) {
            await new Promise(resolve => {
                setTimeout(() => {
                    tiles[i].className = `tile ${feedback[i]}`;
                    resolve();
                }, i * 150);
            });
        }

        // Update keyboard
        this.updateKeyboard(word, feedback);
    }

    /**
     * Update keyboard based on feedback
     * @param {string} word - The guessed word
     * @param {Array} feedback - Feedback array
     */
    updateKeyboard(word, feedback) {
        for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            const key = document.querySelector(`[data-key="${letter}"]`);
            if (!key) continue;

            const currentState = feedback[i];
            const keyClasses = key.classList;

            // Only update if the new state is better
            if (currentState === CONFIG.TILE_STATES.CORRECT) {
                keyClasses.remove(CONFIG.TILE_STATES.PRESENT, CONFIG.TILE_STATES.ABSENT);
                keyClasses.add(CONFIG.TILE_STATES.CORRECT);
            } else if (currentState === CONFIG.TILE_STATES.PRESENT && !keyClasses.contains(CONFIG.TILE_STATES.CORRECT)) {
                keyClasses.remove(CONFIG.TILE_STATES.ABSENT);
                keyClasses.add(CONFIG.TILE_STATES.PRESENT);
            } else if (currentState === CONFIG.TILE_STATES.ABSENT && !keyClasses.contains(CONFIG.TILE_STATES.CORRECT) && !keyClasses.contains(CONFIG.TILE_STATES.PRESENT)) {
                keyClasses.add(CONFIG.TILE_STATES.ABSENT);
            }
        }
    }

    /**
     * Update game info display
     * @param {Object} gameState - Current game state
     */
    updateGameInfo(gameState) {
        document.getElementById('current-score').textContent = gameState.score || 0;
        document.getElementById('guess-counter').textContent = `${gameState.currentGuess}/${gameState.maxGuesses}`;
    }

    /**
     * Display context content for non-classic modes
     * @param {Object} wordData - Word data including definition, sentence, choices
     * @param {string} gameMode - Current game mode
     */
    displayContextContent(wordData, gameMode) {
        const contextContent = document.getElementById('context-content');
        const definitionBox = document.getElementById('definition-box');
        const sentenceBox = document.getElementById('sentence-box');
        const choicesBox = document.getElementById('choices-box');

        if (gameMode === CONFIG.GAME_MODES.CLASSIC) {
            contextContent.classList.add('hidden');
            return;
        }

        contextContent.classList.remove('hidden');

        // Show definition
        if (wordData.definition) {
            document.getElementById('word-definition').textContent = wordData.definition;
            definitionBox.classList.remove('hidden');
        }

        // Show sentence for fill in the blank
        if (gameMode === CONFIG.GAME_MODES.FILL_BLANK && wordData.sentence) {
            document.getElementById('word-sentence').textContent = wordData.sentence;
            sentenceBox.classList.remove('hidden');
        }

        // Show choices for multiple choice
        if (gameMode === CONFIG.GAME_MODES.MULTIPLE_CHOICE && wordData.choices) {
            const choicesContainer = document.getElementById('word-choices');
            choicesContainer.innerHTML = '';

            wordData.choices.forEach(choice => {
                const button = document.createElement('button');
                button.className = 'choice-btn';
                button.textContent = choice;
                button.dataset.choice = choice;
                choicesContainer.appendChild(button);
            });

            choicesBox.classList.remove('hidden');
        }
    }

    /**
     * Show game over screen
     * @param {Object} gameState - Final game state
     * @param {Object} wordData - Word data including definition
     */
    showGameOver(gameState, wordData) {
        const isWin = gameState.gameStatus === 'won';

        document.getElementById('result-icon').textContent = isWin ? '🎉' : '🎯';
        document.getElementById('result-title').textContent = isWin ? 'Victory!' : 'Good Try!';
        document.getElementById('result-message').textContent = isWin
            ? `Congratulations! You guessed the word in ${gameState.currentGuess} ${gameState.currentGuess === 1 ? 'try' : 'tries'}!`
            : `The word was a tough one! Let's try another!`;

        document.getElementById('revealed-word').textContent = gameState.targetWord;
        document.getElementById('revealed-definition').textContent = wordData?.definition || '';

        // Score breakdown
        if (isWin) {
            const baseScore = 1000;
            const guessBonus = (gameState.maxGuesses - gameState.currentGuess) * 100;
            const timeBonus = Math.max(0, gameState.score - baseScore - guessBonus);

            document.getElementById('base-score').textContent = baseScore;
            document.getElementById('guess-bonus').textContent = guessBonus;
            document.getElementById('time-bonus').textContent = timeBonus;
            document.getElementById('final-score').textContent = gameState.score;
        } else {
            document.getElementById('base-score').textContent = 0;
            document.getElementById('guess-bonus').textContent = 0;
            document.getElementById('time-bonus').textContent = 0;
            document.getElementById('final-score').textContent = 0;
        }

        this.showScreen('game-over-screen');

        if (isWin) {
            this.createFireworks();
            this.wizardCelebrate();
        }
    }

    /**
     * Update statistics display
     * @param {Object} stats - Statistics object
     */
    updateStats(stats) {
        document.getElementById('total-games').textContent = stats.totalGames || 0;
        document.getElementById('win-rate').textContent = stats.winRate || '0%';
        document.getElementById('best-score').textContent = stats.bestScore || 0;
    }

    /**
     * Reset keyboard
     */
    resetKeyboard() {
        document.querySelectorAll('.key').forEach(key => {
            key.classList.remove(CONFIG.TILE_STATES.ABSENT, CONFIG.TILE_STATES.PRESENT, CONFIG.TILE_STATES.CORRECT);
        });
    }

    /**
     * Add tile hover effects with definitions
     * @param {Object} wordDetails - Word details object
     */
    addTileHoverEffects(wordDetails) {
        const tiles = document.querySelectorAll('.tile.correct, .tile.present, .tile.absent');
        tiles.forEach((tile, index) => {
            if (tile.textContent && wordDetails) {
                tile.classList.add('has-definition');
                tile.dataset.definition = wordDetails.definition;

                tile.addEventListener('mouseenter', (e) => {
                    if (wordDetails.definition) {
                        this.showDefinitionTooltip(tile, wordDetails.word, wordDetails.definition);
                    }
                });

                tile.addEventListener('mouseleave', () => {
                    this.hideDefinitionTooltip();
                });
            }
        });
    }

    /**
     * Show loading state
     * @param {boolean} isLoading - Loading state
     */
    setLoading(isLoading) {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.disabled = isLoading;
        });
    }

    /**
     * Get random message from array
     * @param {Array} messages - Array of messages
     * @returns {string} Random message
     */
    getRandomMessage(messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    }
}

// Create and export UI instance
const ui = new UIService();
