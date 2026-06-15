# WURDSMYTH — Deployment Guide

This single file replaces the previous Netlify-focused deployment docs. The project now deploys on **Vercel** with **Supabase** as the database.

---

## Live URLs

| Resource | URL |
|---|---|
| GitHub Repo | https://github.com/PMAIGURU2026/FEBEWURDSMYTH-game |
| Live Game | https://febewurdsmyth.vercel.app |
| API Health | https://febewurdsmyth.vercel.app/api/health |

---

## Step 1 — Set Up Supabase

1. Create a free project at https://supabase.com
2. Go to **SQL Editor** and run the entire contents of `backend/database/supabase_schema.sql`
3. Confirm three tables exist in **Table Editor**: `users`, `game_sessions`, `user_stats`
4. Copy your credentials from **Settings → API**:
   - Project URL (`SUPABASE_URL`)
   - Anon / public key (`SUPABASE_ANON_KEY`)
   - Service role key (`SUPABASE_SERVICE_KEY`)
5. Paste the anon key and project URL into `frontend/js/supabase-client.js`

---

## Step 2 — Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to https://vercel.com → **Add New Project**
2. Import the GitHub repo `PMAIGURU2026/FEBEWURDSMYTH-game`
3. Vercel auto-detects the config from `vercel.json` — no build settings to change
4. Before deploying, set **Environment Variables** (Settings → Environment Variables):
   ```
   SUPABASE_URL        = <your project URL>
   SUPABASE_ANON_KEY   = <your anon key>
   SUPABASE_SERVICE_KEY= <your service role key>
   JWT_SECRET          = <any long random string>
   ```
5. Click **Deploy**

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

Follow the prompts. Set env vars either via the CLI (`vercel env add`) or in the dashboard.

---

## Step 3 — Local Development

```bash
# Clone
git clone https://github.com/PMAIGURU2026/FEBEWURDSMYTH-game.git
cd FEBEWURDSMYTH-game

# Install dependencies
npm install

# Copy and fill in credentials
cp backend/.env.example backend/.env
# edit backend/.env with your Supabase values

# Start backend
node backend/server.js
# → running on http://localhost:3000

# Open frontend in browser
open frontend/index.html
# or serve it: python3 -m http.server 8080 (in the frontend/ folder)
```

---

## Step 4 — Redeploy After Changes

```bash
git add .
git commit -m "Your change description"
git push origin main
# Vercel auto-deploys from the main branch
```

---

## Environment Variables Reference

| Variable | Where to get it |
|---|---|
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key |
| `SUPABASE_SERVICE_KEY` | Supabase → Settings → API → service_role secret key |
| `JWT_SECRET` | Any long random string you choose |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| API returns 500 | Check Vercel logs → verify env vars are set |
| Supabase auth fails | Confirm tables exist; re-run `supabase_schema.sql` |
| Login page loops | Clear localStorage in DevTools → Application → Storage |
| CORS errors locally | Run backend with `node backend/server.js`, not by opening HTML directly |

---

## Vercel Project Structure

```
FEBEWURDSMYTH-game/
├── api/
│   └── index.js          ← Vercel serverless function (all /api/* routes)
├── frontend/             ← Static files served by Vercel
│   ├── index.html
│   ├── auth.html
│   ├── css/styles.css
│   └── js/
│       ├── config.js
│       ├── supabase-client.js
│       ├── api.js
│       ├── ui.js
│       ├── game.js
│       └── main.js
├── backend/              ← Shared Node.js logic (imported by api/index.js)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── database/
│       └── supabase_schema.sql
├── vercel.json           ← Routing + build config
└── package.json
```
