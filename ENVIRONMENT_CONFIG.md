# 🔐 Environment Configuration Guide

## Local Development

Your `.env` file in `backend/.env` (already configured):

```env
PORT=3000
NODE_ENV=development
```

**✅ This works perfectly for local testing!**

---

## Netlify Production Deployment

### Option 1: Environment Variables in Netlify Dashboard (Recommended)

Netlify serverless functions don't need a `.env` file. Instead:

1. **Go to Netlify Dashboard**
   - Your Site → Site settings → Environment variables

2. **Add these variables** (if needed):
   ```
   NODE_ENV = production
   ```

**Note:** For this project, you actually don't need any environment variables in Netlify! The default configuration works perfectly.

### Option 2: Using netlify.toml (Already Configured)

Your `netlify.toml` already handles the configuration:

```toml
[build]
  command = "cd backend && npm install"
  functions = "backend"
  publish = "frontend"
```

---

## What Changes for Production?

### Backend (Netlify)

**No `.env` file needed!** Netlify automatically:
- Sets `NODE_ENV=production`
- Handles serverless function routing
- Manages ports internally

### Frontend (GitHub Pages)

**Only one change needed** - Update `frontend/js/config.js`:

```javascript
const CONFIG = {
    // API Configuration
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : 'https://YOUR-NETLIFY-SITE.netlify.app/api', // ⚠️ UPDATE THIS!
```

**Replace `YOUR-NETLIFY-SITE` with your actual Netlify URL!**

---

## Complete Deployment Checklist

### Step 1: Local .env (Already Done ✅)
```env
PORT=3000
NODE_ENV=development
```

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 3: Deploy to Netlify
- No `.env` configuration needed
- Netlify handles everything automatically

### Step 4: Update Frontend Config
```bash
# Edit frontend/js/config.js with your Netlify URL
# Then commit:
git add frontend/js/config.js
git commit -m "Configure production API endpoint"
git push origin main
```

### Step 5: Enable GitHub Pages
- Settings → Pages → Source: main branch

---

## Advanced Configuration (Optional)

If you want to add custom environment variables in Netlify:

### Via Netlify Dashboard:
1. Go to: Site settings → Environment variables
2. Click "Add a variable"
3. Examples:
   ```
   NODE_ENV = production
   MAX_GUESSES = 6
   CUSTOM_MESSAGE = "Welcome to WURDSMYTH!"
   ```

### Access in Code:
```javascript
// In your backend code
const nodeEnv = process.env.NODE_ENV;
const maxGuesses = process.env.MAX_GUESSES || 6;
```

---

## Environment Files Summary

### Files You Have:

```
backend/
├── .env                  # Local development (not deployed)
└── .env.example          # Template for others
```

### What Gets Deployed:

- **GitHub:** Everything except `.env` (blocked by `.gitignore`)
- **Netlify:** Uses environment variables from dashboard, not `.env` file

---

## Security Best Practices ✅

Your project already follows best practices:

1. **✅ `.gitignore` excludes `.env`** - Secrets never pushed to GitHub
2. **✅ `.env.example` provided** - Shows what variables are needed
3. **✅ No API keys in code** - All sensitive data in environment variables
4. **✅ CORS enabled** - But restricted to specific origins

---

## Testing Your Configuration

### Local Testing:
```bash
cd backend
npm start
# Should see: "WURDSMYTH API server running on port 3000"
```

### Production Testing:
```bash
# Test Netlify backend
curl https://your-site.netlify.app/api/health

# Expected response:
# {"status":"OK","message":"WURDSMYTH API is running"}
```

---

## Common Issues & Solutions

### Issue: "Cannot find module"
**Solution:** Make sure `package.json` has all dependencies
```bash
cd backend
npm install
```

### Issue: "Port already in use"
**Solution:** Kill process on port 3000
```bash
lsof -ti:3000 | xargs kill -9
```

### Issue: Netlify functions not working
**Solution:** Check `netlify.toml` configuration
```toml
[build]
  functions = "backend"  # ← Must point to backend folder
```

### Issue: Frontend can't connect to backend
**Solution:** Update `frontend/js/config.js` with correct Netlify URL

---

## Quick Reference

### What You Need to Change for Deployment:

**❌ DON'T change:**
- `backend/.env` (stays for local development)
- `netlify.toml` (already configured)
- Backend code (works as-is)

**✅ DO change:**
- `frontend/js/config.js` line 10 (add your Netlify URL)

**That's it!** One file, one line change. 🎉

---

## Example: Before vs After Deployment

### Before (Local Development):
```javascript
// frontend/js/config.js
API_BASE_URL: 'http://localhost:3000/api'
```

### After (Production):
```javascript
// frontend/js/config.js
API_BASE_URL: window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://your-actual-site.netlify.app/api'
```

This way it works both locally AND in production! 🚀

---

## Need More Environment Variables?

If your project grows and you need more variables:

### Add to `.env.example`:
```env
PORT=3000
NODE_ENV=development
MAX_GUESSES=6
WORD_API_KEY=your_api_key_here
DATABASE_URL=your_database_url
```

### Add to Netlify Dashboard:
- Site settings → Environment variables → Add each one

### Access in Code:
```javascript
const maxGuesses = process.env.MAX_GUESSES || 6;
const apiKey = process.env.WORD_API_KEY;
```

---

## Summary

**For this project, you're already set! ✅**

- **Local:** `.env` file works (already configured)
- **Netlify:** No `.env` needed (automatic configuration)
- **Only change:** Update `frontend/js/config.js` with Netlify URL

**That's it!** Your environment configuration is deployment-ready! 🎉
