# 🎮 WURDSMYTH — Word Wizard Game

An interactive educational word game featuring multiple difficulty levels, game modes, a magical Word Wizard companion, user accounts powered by Supabase, and gamification badges/streaks. Built with vanilla JavaScript, Node.js, and Express, deployed on Vercel.

![WURDSMYTH Game](https://img.shields.io/badge/Game-WURDSMYTH-6366f1?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ecf8e?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-10b981?style=for-the-badge)

## ✨ Features

### 🎯 Three Game Modes
- **Classic Wordle** — Guess the hidden word in 6 tries with color-coded tile feedback
- **Fill in the Blank** — Complete sentences using contextual definition clues
- **Multiple Choice** — Choose the correct word from four options

### 📚 Four Difficulty Levels
- **Easy** (10 pts) — Common everyday words
- **Medium** (20 pts) — Academic vocabulary
- **Hard** (30 pts) — Advanced Barron's-style words
- **Expert** (50 pts) — Master-level vocabulary

### 🏆 Gamification
- **Points** — Earned per correct game based on difficulty
- **Day Streaks** — Track consecutive days played; current & longest streak saved to Supabase
- **Badges** — Five unlockable badges stored in your account:
  - 🎮 First Play — play your first game
  - 🔥 7-Day Streak — play 7 days in a row
  - 💯 Century — earn 100 total points
  - 🏆 Word Master — win an Expert-level game
  - 🎯 Sharp Shooter — guess correctly on the very first try

### 🔮 Interactive Features
- **Word Wizard Companion** — Animated character with contextual encouragement
- **Hover Tooltips** — See word definitions on completed tiles
- **Fireworks Celebration** — Visual effect on victory
- **User Dashboard** — Streak, points, and badges displayed on the home screen
- **Game State Persistence** — Resume interrupted games

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- A free Supabase account (https://supabase.com)
- A free Vercel account (https://vercel.com) for deployment

### Local Development

```bash
git clone https://github.com/PMAIGURU2026/FEBEWURDSMYTH-game.git
cd FEBEWURDSMYTH-game

# Install dependencies
npm install

# Set up environment variables
cp backend/.env.example backend/.env
# Fill in your Supabase credentials

# Also fill in frontend/js/supabase-client.js with SUPABASE_URL and SUPABASE_ANON_KEY

# Run the database schema in Supabase SQL Editor
# (copy backend/database/supabase_schema.sql and run it)

# Start the backend
node backend/server.js

# Open frontend/index.html in your browser (or serve it)
python3 -m http.server 8080   # from inside the frontend/ folder
```

### Deploy to Vercel

See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions.

---

## 📖 How to Play

### Classic Mode
1. Guess a word matching the hidden word's length
2. Press ENTER — tiles flip and change color:
   - 🟩 **Green** — correct letter, correct position
   - 🟨 **Yellow** — correct letter, wrong position
   - ⬜ **Gray** — letter not in the word
3. Use clues to find the word within 6 tries

### Fill in the Blank
- Read the definition and example sentence, then type the missing word

### Multiple Choice
- Read the definition and sentence, click the correct word from four options

**Tips:** 💡 Click the wizard for encouragement · 🔍 Hover tiles for definitions · 💾 Games auto-save

---

## 📁 Project Structure

```
FEBEWURDSMYTH-game/
├── api/
│   └── index.js              # Vercel serverless function
├── frontend/
│   ├── index.html            # Main game page
│   ├── auth.html             # Login / register page
│   ├── css/styles.css        # All styles and animations
│   └── js/
│       ├── config.js         # App config and constants
│       ├── supabase-client.js# Frontend Supabase JS client
│       ├── api.js            # API service layer
│       ├── ui.js             # UI management and animations
│       ├── game.js           # Game logic
│       └── main.js           # App entry point
├── backend/
│   ├── server.js             # Local Express dev server
│   ├── config/
│   │   ├── supabase.js       # Supabase client (service key)
│   │   └── wordList.js       # Vocabulary database
│   ├── controllers/
│   │   └── authController.js # Auth + progress endpoints
│   ├── middleware/auth.js    # JWT middleware
│   ├── models/
│   │   ├── User.js           # User accounts + gamification
│   │   └── Game.js           # In-memory game sessions
│   └── database/
│       └── supabase_schema.sql
├── netlify/functions/api.js  # Legacy Netlify function (kept for reference)
├── vercel.json               # Vercel routing + build config
├── package.json
├── DEPLOYMENT.md             # Deployment instructions
└── NOTES.md                  # Architecture decisions
```

---

## 🔧 API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | JWT | Profile + stats |
| POST | `/api/auth/progress` | JWT | Save game result |
| GET | `/api/auth/badges` | JWT | Earned badges |
| GET | `/api/auth/leaderboard` | — | Top players |
| POST | `/api/game/start` | optional | Start game |
| POST | `/api/game/guess` | — | Submit guess |
| POST | `/api/game/validate` | — | Validate word |
| GET | `/api/game/:id` | — | Game state |
| DELETE | `/api/game/:id` | — | End session |

---

## 📊 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla JavaScript (ES6+), HTML5, CSS3 |
| Backend | Node.js, Express.js |
| Database | Supabase (PostgreSQL) |
| Auth | Custom JWT (bcrypt + jsonwebtoken) |
| Deployment | Vercel (serverless functions + static hosting) |

---

## 👩‍💻 Author

**Paula Lawton**
- GitHub: [@PMAIGURU2026](https://github.com/PMAIGURU2026)
- Email: paula.lawton@pursuit.org
- Repository: [FEBEWURDSMYTH-game](https://github.com/PMAIGURU2026/FEBEWURDSMYTH-game)

---

## 🎓 Academic Use

Created at Pursuit (L2/L3 portfolio project) demonstrating:
- Full-stack JavaScript development
- Supabase database integration
- Serverless architecture on Vercel
- JWT-based authentication
- Gamification systems (points, streaks, badges)
- Responsive UI/UX design

---

**Live Demo:** https://febewurdsmyth.vercel.app  
**API Backend:** https://febewurdsmyth.vercel.app/api/health  
**Repository:** https://github.com/PMAIGURU2026/FEBEWURDSMYTH-game
