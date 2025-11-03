# 🧪 WURDSMYTH Testing Guide

## Local Testing Instructions

### 1. Test Backend Locally

**Start the backend server:**

```bash
cd backend
npm install
npm start
```

You should see: `WURDSMYTH API server running on port 3000`

**Test API endpoints:**

Open a new terminal and run these commands:

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Expected response:
# {"status":"OK","message":"WURDSMYTH API is running"}

# Test starting a game
curl -X POST http://localhost:3000/api/game/start \
  -H "Content-Type: application/json" \
  -d '{"difficulty":"medium","gameMode":"classic"}'

# Test word validation
curl -X POST http://localhost:3000/api/game/validate \
  -H "Content-Type: application/json" \
  -d '{"word":"HAPPY"}'
```

### 2. Test Frontend Locally

**Option A: Using Python (Recommended)**

```bash
cd frontend
python3 -m http.server 8000
```

Then open: `http://localhost:8000`

**Option B: Using Node.js http-server**

```bash
npm install -g http-server
cd frontend
http-server -p 8000
```

**Option C: Direct file (may have CORS issues)**

Simply open `frontend/index.html` in your browser.

### 3. Manual Testing Checklist

#### Setup Screen Tests
- [ ] All difficulty levels are selectable
- [ ] All game modes are selectable
- [ ] Mode description changes when switching modes
- [ ] Statistics display correctly (0 for new users)
- [ ] Start button works

#### Classic Mode Tests
- [ ] Game board creates correct number of tiles
- [ ] Keyboard input works (both physical and on-screen)
- [ ] Letters appear in tiles when typed
- [ ] Backspace removes letters
- [ ] Submit validates word length
- [ ] Invalid words show error toast
- [ ] Valid words submit successfully
- [ ] Tiles animate with correct colors (green/yellow/gray)
- [ ] Keyboard keys update with colors
- [ ] Win condition triggers celebration
- [ ] Lose condition shows correct message
- [ ] Hover over tiles shows definitions

#### Fill-in-Blank Mode Tests
- [ ] Definition displays
- [ ] Sentence with blank displays
- [ ] Can type and submit word
- [ ] Correct word wins game
- [ ] Incorrect word continues game

#### Multiple Choice Mode Tests
- [ ] Definition displays
- [ ] Sentence displays
- [ ] Four choices appear
- [ ] Can select a choice
- [ ] Selection highlights
- [ ] Correct choice wins
- [ ] Incorrect choice continues

#### UI/UX Tests
- [ ] Wizard character floats
- [ ] Wizard speaks on events
- [ ] Clicking wizard shows encouragement
- [ ] Toast notifications appear and disappear
- [ ] Fireworks display on win
- [ ] Score updates correctly
- [ ] Statistics update after game
- [ ] Game state saves (refresh page during game)
- [ ] Can resume saved game

#### Responsive Tests
- [ ] Works on desktop (>1024px)
- [ ] Works on tablet (768px-1024px)
- [ ] Works on mobile (<768px)
- [ ] Touch events work on mobile
- [ ] All text is readable on small screens

---

## API Endpoint Testing

### Health Check
```bash
GET /api/health
```
**Expected Response:**
```json
{
  "status": "OK",
  "message": "WURDSMYTH API is running"
}
```

### Start Game
```bash
POST /api/game/start
Content-Type: application/json

{
  "difficulty": "medium",
  "gameMode": "classic"
}
```
**Expected Response:**
```json
{
  "sessionId": "game_1234567890_abc123",
  "guesses": [],
  "maxGuesses": 6,
  "gameStatus": "active",
  "currentGuess": 0,
  "score": 0,
  "wordLength": 7,
  "gameMode": "classic",
  "difficulty": "medium"
}
```

### Submit Guess
```bash
POST /api/game/guess
Content-Type: application/json

{
  "sessionId": "game_1234567890_abc123",
  "guess": "ANALYZE"
}
```
**Expected Response:**
```json
{
  "guessResult": {
    "word": "ANALYZE",
    "feedback": ["correct", "present", "absent", ...],
    "guessNumber": 1
  },
  "gameState": {
    "sessionId": "game_1234567890_abc123",
    "guesses": [...],
    "gameStatus": "active",
    ...
  }
}
```

### Validate Word
```bash
POST /api/game/validate
Content-Type: application/json

{
  "word": "HAPPY"
}
```
**Expected Response:**
```json
{
  "valid": true,
  "word": "HAPPY",
  "details": {
    "word": "HAPPY",
    "definition": "Feeling or showing pleasure or contentment",
    "sentence": "She felt ____ when she received good news."
  }
}
```

---

## Browser Console Testing

Open browser DevTools (F12) and check:

### Check API Connection
```javascript
// Test API directly
fetch('http://localhost:3000/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### Check Game Objects
```javascript
// These should be available in console
console.log(game);    // Game Manager
console.log(ui);      // UI Service
console.log(api);     // API Service
console.log(CONFIG);  // Configuration
```

### Start Test Game
```javascript
// Start a test game
await game.startGame('easy', 'classic');
```

### Simulate Gameplay
```javascript
// Type some letters
game.handleKeyPress('H');
game.handleKeyPress('A');
game.handleKeyPress('P');
game.handleKeyPress('P');
game.handleKeyPress('Y');

// Submit
await game.handleKeyPress('ENTER');
```

---

## Performance Testing

### Check Load Times
1. Open DevTools → Network tab
2. Reload page
3. Check:
   - [ ] Page loads in < 2 seconds
   - [ ] All CSS loads
   - [ ] All JavaScript loads
   - [ ] No 404 errors

### Check Memory Usage
1. Open DevTools → Performance tab
2. Start recording
3. Play a complete game
4. Stop recording
5. Check:
   - [ ] No memory leaks
   - [ ] Smooth animations
   - [ ] No JavaScript errors

---

## Automated Testing (Future Enhancement)

### Backend Tests (Jest)

Create `backend/tests/game.test.js`:

```javascript
const request = require('supertest');
const app = require('../server');

describe('Game API', () => {
  test('Health check works', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  test('Can start a game', async () => {
    const response = await request(app)
      .post('/api/game/start')
      .send({ difficulty: 'easy', gameMode: 'classic' });
    expect(response.status).toBe(201);
    expect(response.body.sessionId).toBeDefined();
  });
});
```

### Frontend Tests (Optional)

Could add Cypress or Playwright for E2E testing.

---

## Common Test Scenarios

### Scenario 1: Complete Classic Game (Win)
1. Start Classic mode, Easy difficulty
2. Type a valid 5-letter word
3. Press Enter
4. Repeat until word is guessed
5. Verify fireworks appear
6. Verify score is calculated
7. Verify statistics update

### Scenario 2: Complete Classic Game (Lose)
1. Start Classic mode, Hard difficulty
2. Type 6 different wrong words
3. Verify game ends
4. Verify correct word is revealed
5. Verify score is 0

### Scenario 3: Fill-in-Blank Mode
1. Start Fill-in-Blank mode
2. Read definition and sentence
3. Type the correct word
4. Verify win

### Scenario 4: Multiple Choice Mode
1. Start Multiple Choice mode
2. Read definition and sentence
3. Click correct choice
4. Verify immediate win

### Scenario 5: Game State Persistence
1. Start any game mode
2. Make 2-3 guesses
3. Refresh the page
4. Verify prompt to resume
5. Resume game
6. Verify state is restored correctly

---

## Bug Testing

Test these edge cases:

### Input Validation
- [ ] Typing more than word length
- [ ] Submitting with fewer letters
- [ ] Special characters
- [ ] Numbers
- [ ] Empty submission

### Navigation
- [ ] Back button during game
- [ ] Refresh during game
- [ ] Closing browser during game
- [ ] Multiple tabs

### API Errors
- [ ] Backend offline (should show error)
- [ ] Slow network (should show loading)
- [ ] Invalid session ID
- [ ] Invalid word format

---

## Deployment Testing

### After Deploying to Netlify
1. Visit health endpoint: `https://your-site.netlify.app/api/health`
2. Should return 200 OK
3. Check Netlify Functions logs

### After Deploying to GitHub Pages
1. Visit your GitHub Pages URL
2. Open DevTools console
3. Verify no CORS errors
4. Play complete game
5. Check all features work

---

## Test Data

### Valid Words for Testing (Easy Level)
- HAPPY
- BRAVE
- SMILE
- PEACE
- DREAM
- QUICK
- BRIGHT
- FRIEND

### Valid Words for Testing (Medium Level)
- ANALYZE
- DIVERSE
- EVIDENT
- JUSTIFY
- PERSIST
- REQUIRE
- SUSTAIN
- COMPLEX

### Valid Words for Testing (Hard Level)
- ABYSMAL
- AFFABLE
- ASTUTE
- CANDID
- DILIGENT
- ELOQUENT
- PRAGMATIC
- RESILIENT

---

## Success Criteria

Your game is ready when:

✅ All game modes work correctly
✅ All difficulty levels load appropriate words
✅ API endpoints respond correctly
✅ Frontend communicates with backend
✅ Animations play smoothly
✅ No console errors
✅ Works on mobile devices
✅ Statistics track correctly
✅ Game state persists
✅ Deployment is successful

---

## Report Issues

If you find bugs during testing:

1. **Document the bug:**
   - What you did
   - What you expected
   - What actually happened
   - Browser and OS
   - Screenshots if applicable

2. **Check console for errors**

3. **Try to reproduce**

4. **Create GitHub issue** (optional)

---

Happy Testing! 🧪✨
