# WURDSMYTH — Upgrade Notes (L2/L3 Portfolio)

This file documents the key decisions, schema, badge definitions, and Vercel deployment steps taken when upgrading from the original Netlify version to the current Supabase + Vercel stack.

---

## Why These Changes?

| Decision | Reason |
|---|---|
| Supabase over raw PostgreSQL | Free hosted DB with built-in RLS, real-time, and a JS client library — no infra to manage |
| Three-table schema | Clean separation: identity (`users`), events (`game_sessions`), aggregates (`user_stats`) |
| Vercel over Netlify | Simpler monorepo config, better Node cold-start perf, same-domain API avoids CORS issues |
| Custom JWT auth | Keeps auth logic transparent and educational; no dependency on Supabase Auth |
| Relative `/api` URL in production | Frontend and API share the same Vercel domain, so no CORS or hardcoded URLs |
| Points on win only | A correct "answer" in a Wordle game = winning the game; partial credit would need per-letter tracking |

---

## Supabase Table Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key, auto-generated |
| email | VARCHAR(255) | Unique, required |
| username | VARCHAR(255) | Unique, required |
| created_at | TIMESTAMPTZ | Default NOW() |
| password | VARCHAR(255) | bcrypt-hashed, never exposed |

### `game_sessions`
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key, auto-generated |
| user_id | UUID | FK → users.id |
| score | INTEGER | Game engine score |
| mode | VARCHAR(50) | classic / fill_blank / multiple_choice |
| level | VARCHAR(50) | easy / medium / hard / expert |
| completed_at | TIMESTAMPTZ | Default NOW() |

### `user_stats`
| Column | Type | Notes |
|---|---|---|
| user_id | UUID | Primary key, FK → users.id |
| total_points | INTEGER | Cumulative points across all won games |
| current_streak | INTEGER | Consecutive days played |
| longest_streak | INTEGER | All-time best streak |
| badges_earned | JSONB | Array of `{ id, earned_at }` objects |
| last_played_date | DATE | Date of most recent game (for streak calc) |

---

## Points System

Points are awarded **only on a won game**, based on difficulty:

| Difficulty | Points per win |
|---|---|
| Easy | 10 |
| Medium | 20 |
| Hard | 30 |
| Expert | 50 |

---

## Daily Streak Logic

On each game completion, `last_played_date` is compared to today:
- **Same day** → streak unchanged (already counted today)
- **Yesterday** → `current_streak += 1`
- **2+ days ago** → `current_streak` resets to 1

`longest_streak` is updated whenever `current_streak` exceeds it.

---

## Badge Definitions

| Badge | id | Icon | Unlock Condition |
|---|---|---|---|
| First Play | `first_play` | 🎮 | Completed 1 game (any result) |
| 7-Day Streak | `seven_day_streak` | 🔥 | `current_streak >= 7` |
| Century | `hundred_points` | 💯 | `total_points >= 100` |
| Word Master | `word_master` | 🏆 | Won a game on Expert level |
| Sharp Shooter | `sharp_shooter` | 🎯 | Won on the first guess |

Badges are stored as `[{ id: "first_play", earned_at: "2025-06-14T..." }, ...]` in `user_stats.badges_earned`.

---

## Vercel Deployment Steps

1. **Push to GitHub** — code lives at https://github.com/PMAIGURU2026/FEBEWURDSMYTH-game
2. **Import on Vercel** — vercel.com → Add New Project → import from GitHub
3. **Set environment variables** in Vercel Dashboard → Project → Settings → Environment Variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `JWT_SECRET`
4. **Deploy** — Vercel auto-deploys every push to `main`
5. **Run SQL schema** — paste `backend/database/supabase_schema.sql` into Supabase SQL Editor and click Run

### `vercel.json` routing explained

```json
{
  "builds": [
    { "src": "api/index.js", "use": "@vercel/node" },       // serverless function
    { "src": "frontend/**/*", "use": "@vercel/static" }      // static files
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/index.js" },         // all /api/* → function
    { "src": "/css/(.*)", "dest": "/frontend/css/$1" },
    { "src": "/js/(.*)", "dest": "/frontend/js/$1" },
    { "src": "/auth.html", "dest": "/frontend/auth.html" },
    { "src": "/(.*)", "dest": "/frontend/index.html" }        // SPA fallback
  ]
}
```

---

## Files Changed From Original

| File | Change |
|---|---|
| `backend/database/supabase_schema.sql` | Replaced 2-table schema with 3-table schema |
| `backend/models/User.js` | Rewritten for new tables + points/streak/badges |
| `backend/controllers/authController.js` | Updated to use `user_stats` not `user_progress` |
| `frontend/js/config.js` | Production URL changed from Netlify to `/api` (Vercel) |
| `frontend/js/api.js` | Added `saveGameResult` and `getUserProfile` |
| `frontend/js/game.js` | `updateStatistics` now async; saves to Supabase on game end |
| `frontend/js/main.js` | Auth redirect gate + dashboard loader |
| `frontend/index.html` | Added Supabase CDN, user dashboard, guest banner |
| `frontend/auth.html` | Guest button sets localStorage flag |
| `frontend/js/supabase-client.js` | **New** — frontend Supabase JS client |
| `api/index.js` | **New** — Vercel serverless function |
| `vercel.json` | **New** — Vercel routing config |
| `package.json` | Updated for Vercel dev dependencies |
| `DEPLOYMENT.md` | **New** — consolidated from 7 Netlify docs |
| `README.md` | Updated with real name, GitHub handle, Vercel URLs |

---

## What Was NOT Changed

- Game logic (`backend/models/Game.js`, word processing)
- Color scheme (CSS variables in `styles.css`)
- Word Wizard feature
- All three game modes (Classic, Fill in the Blank, Multiple Choice)
- All four difficulty levels
