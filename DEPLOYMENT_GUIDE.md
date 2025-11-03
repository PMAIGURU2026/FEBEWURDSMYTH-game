# 🚀 WURDSMYTH Deployment Guide

Complete step-by-step instructions for deploying your WURDSMYTH word game.

## 📋 Prerequisites

Before you begin, make sure you have:
- ✅ A GitHub account
- ✅ A Netlify account (free tier is fine)
- ✅ Git installed on your computer
- ✅ All project files committed to git

## 🎯 Deployment Overview

We'll deploy:
1. **Backend** → Netlify (Serverless Functions)
2. **Frontend** → GitHub Pages (Static Hosting)

---

## Part 1: Create GitHub Repository

### Step 1: Create Repository on GitHub

1. Go to [GitHub](https://github.com)
2. Click the **+** icon in the top right
3. Select **New repository**
4. Fill in the details:
   - **Repository name**: `FEBEWURDSMYTH-game`
   - **Description**: "Educational word game with multiple difficulty levels and game modes"
   - **Visibility**: Public (required for GitHub Pages)
   - **DO NOT** initialize with README (we already have one)
5. Click **Create repository**

### Step 2: Push Your Code to GitHub

Open Terminal in your project directory and run:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/FEBEWURDSMYTH-game.git

# Verify the remote was added
git remote -v

# Push your code
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### Step 3: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files

✅ **GitHub Repository URL**: `https://github.com/YOUR_USERNAME/FEBEWURDSMYTH-game`

---

## Part 2: Deploy Backend to Netlify

### Step 1: Sign Up/Login to Netlify

1. Go to [Netlify](https://www.netlify.com/)
2. Click **Sign up** or **Log in**
3. Choose "Sign up with GitHub" for easier integration

### Step 2: Install Netlify CLI (Optional but Recommended)

```bash
npm install -g netlify-cli
```

### Step 3: Deploy via Netlify Dashboard

#### Option A: Using Netlify Dashboard (Easiest)

1. Log into [Netlify Dashboard](https://app.netlify.com/)
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub**
4. Authorize Netlify to access your repositories
5. Select your `FEBEWURDSMYTH-game` repository
6. Configure build settings:
   - **Branch to deploy**: `main`
   - **Build command**: `cd backend && npm install`
   - **Publish directory**: `frontend`
   - **Functions directory**: `backend`
7. Click **Deploy site**

#### Option B: Using Netlify CLI

```bash
# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Choose your team
# - Site name: febewurdsmyth-game (or your choice)
# - Build command: cd backend && npm install
# - Publish directory: frontend
# - Functions directory: backend

# Deploy to production
netlify deploy --prod
```

### Step 4: Note Your Backend URL

After deployment, Netlify will give you a URL like:
- `https://febewurdsmyth-game.netlify.app`
- or `https://random-name-123.netlify.app`

**Save this URL! You'll need it for the next step.**

✅ **Backend API URL**: `https://your-site-name.netlify.app/api`

---

## Part 3: Configure Frontend to Use Deployed Backend

### Step 1: Update API Configuration

Edit `frontend/js/config.js` on your computer:

```javascript
const CONFIG = {
    // API Configuration
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : 'https://YOUR-NETLIFY-SITE.netlify.app/api', // ⚠️ UPDATE THIS!

    // ... rest of config stays the same
};
```

**Replace `YOUR-NETLIFY-SITE` with your actual Netlify site name!**

### Step 2: Commit and Push Changes

```bash
git add frontend/js/config.js
git commit -m "Configure production API endpoint"
git push origin main
```

---

## Part 4: Deploy Frontend to GitHub Pages

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**:
   - Branch: `main`
   - Folder: `/` (root)
5. Click **Save**

### Step 2: Create GitHub Pages Configuration

Create a new file in your project root:

**File: `.nojekyll`** (empty file)
```bash
touch .nojekyll
```

This tells GitHub Pages not to process your files with Jekyll.

### Step 3: Update Repository Settings for Frontend Path

Since our frontend is in a subfolder, we need to either:

#### Option A: Move Frontend Files to Root (Recommended)

```bash
# Move all frontend files to root
mv frontend/* .
mv frontend/.* . 2>/dev/null || true
rmdir frontend

# Update paths in HTML if needed
# The files should work as-is

# Commit changes
git add .
git commit -m "Restructure for GitHub Pages deployment"
git push origin main
```

#### Option B: Use GitHub Pages with Subfolder

1. In GitHub Settings → Pages
2. Change folder to `/frontend`
3. Click Save

### Step 4: Wait for Deployment

- GitHub Pages takes 1-3 minutes to deploy
- You'll see a green checkmark when ready
- The URL will be displayed in the Pages settings

✅ **Frontend URL**: `https://YOUR_USERNAME.github.io/FEBEWURDSMYTH-game/`

---

## Part 5: Test Your Deployment

### Backend Testing

Test your backend API:

1. Visit: `https://your-netlify-site.netlify.app/api/health`
2. You should see: `{"status":"OK","message":"WURDSMYTH API is running"}`

If you get a 404 or error:
- Check Netlify Functions are deployed
- Verify `netlify.toml` is in your repository root
- Check Netlify deploy logs for errors

### Frontend Testing

1. Visit your GitHub Pages URL
2. Click "Start Adventure"
3. Try playing a game
4. Check browser console (F12) for errors

**Common Issues:**
- **CORS errors**: Check backend is deployed and API_BASE_URL is correct
- **404 on API calls**: Verify Netlify Functions are working
- **Blank page**: Check browser console for JavaScript errors

---

## 📝 Quick Reference - All Your Links

Once deployed, you'll have these URLs:

```
📦 GitHub Repository
https://github.com/YOUR_USERNAME/FEBEWURDSMYTH-game

🎮 Live Game (Frontend)
https://YOUR_USERNAME.github.io/FEBEWURDSMYTH-game/

🔌 API Backend
https://your-netlify-site.netlify.app/api

💚 API Health Check
https://your-netlify-site.netlify.app/api/health
```

---

## 🔧 Updating Your Deployment

### To Update Frontend

```bash
# Make your changes
git add .
git commit -m "Your update message"
git push origin main

# GitHub Pages will auto-deploy in 1-3 minutes
```

### To Update Backend

```bash
# Make your changes to backend files
git add .
git commit -m "Update backend"
git push origin main

# Netlify will auto-deploy
# Or manually trigger: netlify deploy --prod
```

---

## 🐛 Troubleshooting

### Problem: GitHub Pages shows 404

**Solution:**
- Wait 2-3 minutes after enabling Pages
- Check that Pages is enabled in Settings
- Verify files are in the correct directory

### Problem: Frontend can't connect to backend

**Solution:**
- Verify `API_BASE_URL` in `config.js` is correct
- Check Netlify site is deployed and running
- Test API health endpoint directly

### Problem: Netlify build fails

**Solution:**
- Check `netlify.toml` is in root directory
- Verify `package.json` is in `backend/` directory
- Check Netlify deploy logs for specific errors

### Problem: Game loads but doesn't work

**Solution:**
- Open browser console (F12)
- Look for JavaScript errors
- Check Network tab for failed API calls
- Verify backend API is responding

---

## 📧 Submitting to Your Professor

Provide these links:

```
Student Name: [Your Name]
Project: WURDSMYTH Word Game

🔗 GitHub Repository:
https://github.com/YOUR_USERNAME/FEBEWURDSMYTH-game

🎮 Live Game:
https://YOUR_USERNAME.github.io/FEBEWURDSMYTH-game/

🔌 Backend API:
https://your-netlify-site.netlify.app

💚 API Health Check:
https://your-netlify-site.netlify.app/api/health

📖 Features:
- Three game modes (Classic, Fill-in-Blank, Multiple Choice)
- Four difficulty levels (Easy, Medium, Hard, Expert)
- Interactive Word Wizard character
- Hover tooltips for definitions
- Score tracking and statistics
- Responsive design
- Full-stack implementation (Frontend + Backend)
```

---

## 🎉 Success Checklist

Before submitting, verify:

- [ ] GitHub repository is public and accessible
- [ ] All code is pushed to GitHub
- [ ] README.md is complete and helpful
- [ ] GitHub Pages site loads correctly
- [ ] Netlify backend is deployed and responding
- [ ] Game is fully playable online
- [ ] All three game modes work
- [ ] Statistics are tracked
- [ ] Wizard character animates
- [ ] Responsive design works on mobile
- [ ] No console errors in browser
- [ ] API health check returns 200 OK

---

## 🆘 Need Help?

1. **Check Logs**:
   - Netlify: Dashboard → Site → Deploys → [Latest Deploy] → Deploy log
   - GitHub: Actions tab (if enabled)

2. **Common Commands**:
   ```bash
   # Check current git status
   git status

   # View commit history
   git log --oneline

   # Check remote URLs
   git remote -v

   # Force deploy to Netlify
   netlify deploy --prod
   ```

3. **Resources**:
   - [Netlify Documentation](https://docs.netlify.com/)
   - [GitHub Pages Documentation](https://docs.github.com/en/pages)
   - Project README.md

---

**Good luck with your deployment! 🚀✨**

If everything is working, congratulations! You've successfully deployed a full-stack web application! 🎉
