# 🎮 WURDSMYTH - Word Wizard Game

An interactive educational word game featuring multiple difficulty levels, game modes, and a magical word wizard companion! Built with vanilla JavaScript, Node.js, and Express.

![WURDSMYTH Game](https://img.shields.io/badge/Game-WURDSMYTH-6366f1?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-10b981?style=for-the-badge)

## ✨ Features

### 🎯 Multiple Game Modes
- **Classic Wordle**: Guess the hidden word in 6 tries with color-coded feedback
- **Fill in the Blank**: Complete sentences with contextual clues
- **Multiple Choice**: Choose the correct word from four options

### 📚 Four Difficulty Levels
- **Easy**: Common everyday words
- **Medium**: Academic vocabulary
- **Hard**: Advanced Barron's-style words
- **Expert**: Master-level vocabulary

### 🔮 Interactive Features
- **Word Wizard Companion**: Animated character providing encouragement and hints
- **Hover Tooltips**: See word definitions by hovering over completed tiles
- **Fireworks Celebration**: Visual celebration on victory
- **Score Tracking**: Points based on guesses and time
- **Statistics**: Track your progress and win rate
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Game State Persistence**: Resume interrupted games

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   cd Desktop
   git clone https://github.com/YOUR_USERNAME/FEBEWURDSMYTH-game.git
   cd FEBEWURDSMYTH-game
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env if needed (defaults work for local development)
   ```

4. **Start the Backend Server**
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```
   Backend will run on `http://localhost:3000`

5. **Open the Frontend**
   - Open `frontend/index.html` in your browser
   - Or use a local server (recommended):
   ```bash
   # Using Python 3
   cd frontend
   python3 -m http.server 8000
   ```
   Then visit `http://localhost:8000`

## 📖 How to Play

### Classic Mode
1. Guess a word of the specified length
2. Press ENTER to submit
3. Tiles change color to show your accuracy:
   - 🟩 **Green**: Correct letter in correct position
   - 🟨 **Yellow**: Correct letter in wrong position
   - ⬜ **Gray**: Letter not in the word
4. Use the clues to guess the word in 6 tries

### Fill in the Blank Mode
1. Read the definition and sentence
2. Type the word that fits the blank
3. You have 6 attempts

### Multiple Choice Mode
1. Read the definition and sentence
2. Click the correct word from four choices
3. Be careful - wrong choices count against your attempts!

### Pro Tips
- 💡 Click the wizard for encouragement
- 🔍 Hover over tiles to see word definitions
- 💾 Your game auto-saves - resume anytime!
- 🎯 Use hints if you're stuck

## 🌐 Deployment Instructions

### Backend Deployment (Netlify Functions)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Create Netlify Configuration**
   The `netlify.toml` file is already included in the project.

3. **Deploy Backend**
   ```bash
   cd backend
   netlify login
   netlify init
   # Follow prompts to create a new site or link existing
   netlify deploy --prod
   ```

4. **Note Your Backend URL**
   After deployment, you'll get a URL like: `https://your-app.netlify.app`

5. **Update Frontend Configuration**
   Edit `frontend/js/config.js`:
   ```javascript
   API_BASE_URL: 'https://your-backend-url.netlify.app/api'
   ```

### Frontend Deployment (GitHub Pages)

1. **Update API URL in Config**
   Make sure `frontend/js/config.js` has your Netlify backend URL.

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for GitHub Pages deployment"
   git push origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select **main** branch
   - Select **/frontend** as the folder
   - Click **Save**

4. **Access Your Game**
   Your game will be live at: `https://YOUR_USERNAME.github.io/FEBEWURDSMYTH-game/`

### Alternative: Deploy Both on Netlify

1. **Create netlify.toml** (already included)

2. **Deploy Everything**
   ```bash
   netlify login
   netlify init
   netlify deploy --prod
   ```

3. **Update Config**
   If using same Netlify site, the API_BASE_URL can be relative:
   ```javascript
   API_BASE_URL: '/api'
   ```

## 📁 Project Structure

```
WURDSMYTH/
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── css/
│   │   └── styles.css      # All styles and animations
│   ├── js/
│   │   ├── config.js       # Configuration and constants
│   │   ├── api.js          # API service layer
│   │   ├── ui.js           # UI management and animations
│   │   ├── game.js         # Game logic
│   │   └── main.js         # Application entry point
│   └── assets/             # Images and other assets
├── backend/
│   ├── server.js           # Express server setup
│   ├── package.json        # Backend dependencies
│   ├── .env.example        # Environment variables template
│   ├── config/
│   │   └── wordList.js     # Vocabulary database
│   ├── models/
│   │   └── Game.js         # Game state management
│   ├── controllers/
│   │   └── gameController.js # Game logic controllers
│   ├── routes/
│   │   └── gameRoutes.js   # API routes
│   └── middleware/         # Custom middleware
├── .gitignore              # Git ignore rules
├── netlify.toml            # Netlify configuration
└── README.md               # This file
```

## 🔧 API Endpoints

### Game Management
- `POST /api/game/start` - Start a new game
- `POST /api/game/guess` - Submit a guess
- `GET /api/game/:sessionId` - Get game state
- `DELETE /api/game/:sessionId` - End game session

### Word Management
- `POST /api/game/validate` - Validate a word
- `GET /api/game/words/:level` - Get words by difficulty
- `GET /api/game/:sessionId/hint` - Get hint

### Statistics
- `GET /api/game/stats` - Get server statistics
- `GET /api/health` - Health check

## 🎨 Customization

### Adding New Words
Edit `backend/config/wordList.js` and add words to the appropriate difficulty level:

```javascript
{
  word: 'EXAMPLE',
  definition: 'A thing characteristic of its kind',
  sentence: 'This is an ____ of a great word!',
  choices: ['EXAMPLE', 'SAMPLE', 'INSTANCE', 'MODEL']
}
```

### Changing Colors
Edit CSS variables in `frontend/css/styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --success-color: #10b981;
    /* ... other colors */
}
```

### Wizard Messages
Edit messages in `frontend/js/config.js`:

```javascript
WIZARD_MESSAGES: {
    WELCOME: ["Your custom message here!"]
}
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is in use
lsof -ti:3000 | xargs kill -9

# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
Make sure your backend has CORS enabled (already configured in `server.js`)

### Frontend can't connect to backend
1. Check if backend is running
2. Verify API_BASE_URL in `frontend/js/config.js`
3. Check browser console for errors

## 📊 Tech Stack

### Frontend
- Vanilla JavaScript (ES6+)
- HTML5
- CSS3 with Animations
- Google Fonts (Poppins, Press Start 2P)

### Backend
- Node.js
- Express.js
- CORS middleware
- dotenv for environment variables

### Deployment
- GitHub Pages (Frontend)
- Netlify (Backend)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- Repository: [FEBEWURDSMYTH-game](https://github.com/YOUR_USERNAME/FEBEWURDSMYTH-game)

## 🙏 Acknowledgments

- Inspired by Wordle and educational vocabulary games
- Word definitions based on Barron's vocabulary building approach
- Icons and emojis from Unicode standard

## 📧 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/YOUR_USERNAME/FEBEWURDSMYTH-game/issues) page
2. Create a new issue with detailed information
3. Contact your professor if this is for academic purposes

## 🎓 Academic Use

This project was created as an educational full-stack web application demonstrating:
- Frontend-backend integration
- RESTful API design
- Game state management
- Responsive UI/UX design
- Modern JavaScript practices
- Deployment workflows

---

Made with ❤️ and ✨ by a Word Wizard Apprentice

**Live Demo**: [Your GitHub Pages URL]
**API Backend**: [Your Netlify URL]
**Repository**: [Your GitHub Repository URL]
