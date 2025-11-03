# Supabase Setup Guide for WURDSMYTH

This guide will help you set up the Supabase database for the WURDSMYTH game.

## Prerequisites

- Supabase account (already created)
- Project ID: `nqfgblvxcgaodcpmrxua`
- Supabase URL: `https://nqfgblvxcgaodcpmrxua.supabase.co`

## Step 1: Create Database Tables

1. Go to your Supabase project: https://supabase.com/dashboard/project/nqfgblvxcgaodcpmrxua
2. Click on the **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `backend/database/supabase_schema.sql`
5. Paste it into the SQL editor
6. Click **Run** to execute the SQL

This will create:
- `users` table - stores user accounts
- `user_progress` table - stores game progress, badges, and statistics
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for automatic timestamp updates

## Step 2: Verify Tables

After running the SQL, verify the tables were created:

1. Click on **Table Editor** in the left sidebar
2. You should see two tables:
   - `users`
   - `user_progress`

## Step 3: Environment Variables

The `.env` file has already been configured with your credentials:

```env
SUPABASE_URL=https://nqfgblvxcgaodcpmrxua.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
JWT_SECRET=wurdsmyth-super-secret-key-2024
```

## Step 4: Configure Netlify

For production deployment, add these environment variables in Netlify:

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site: **febewurdsmyth**
3. Go to **Site settings** → **Environment variables**
4. Add the following variables:

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | `https://nqfgblvxcgaodcpmrxua.supabase.co` |
| `SUPABASE_ANON_KEY` | Your Supabase Anon Key |
| `SUPABASE_SERVICE_KEY` | Your Supabase Service Key |
| `JWT_SECRET` | `wurdsmyth-super-secret-key-2024` |

5. Click **Save**
6. Redeploy your site for the changes to take effect

## Step 5: Test Locally

1. Install dependencies:
   ```bash
   cd ~/Desktop/WURDSMYTH
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to http://localhost:8888

4. Test registration:
   - Click "Login/Register"
   - Create a new account
   - Play a game to test progress tracking

## Database Schema

### Users Table
- `id` (UUID) - Primary key
- `username` (VARCHAR) - Unique username
- `email` (VARCHAR) - Unique email
- `password` (VARCHAR) - Bcrypt hashed password
- `created_at` (TIMESTAMPTZ) - Account creation time
- `last_login` (TIMESTAMPTZ) - Last login time

### User Progress Table
- `id` (BIGSERIAL) - Primary key
- `user_id` (UUID) - Foreign key to users table
- `level` (INTEGER) - Current user level
- `xp` (INTEGER) - Total experience points
- `total_score` (INTEGER) - Total score across all games
- `games_played` (INTEGER) - Total games played
- `games_won` (INTEGER) - Total games won
- `games_lost` (INTEGER) - Total games lost
- `current_streak` (INTEGER) - Current win streak
- `best_streak` (INTEGER) - Best win streak ever
- `win_streak` (INTEGER) - Current consecutive wins
- `perfect_games` (INTEGER) - Games won in 1 guess
- `speed_wins` (INTEGER) - Games won under 30 seconds
- `expert_wins` (INTEGER) - Games won on expert difficulty
- `modes_played` (TEXT[]) - Array of game modes played
- `badges` (TEXT[]) - Array of earned badge IDs
- `achievements` (JSONB) - Array of achievements
- `game_history` (JSONB) - Last 50 games played
- `statistics` (JSONB) - Per-difficulty statistics
- `updated_at` (TIMESTAMPTZ) - Last update time

## Available Badges

The system includes 12 unlockable badges:

1. **First Steps** 🎮 - Played your first game
2. **Victory** 🏆 - Won your first game
3. **Hot Streak** 🔥 - Win 3 games in a row
4. **Unstoppable** ⚡ - Win 5 games in a row
5. **Dedicated** 🎯 - Played 10 games
6. **Enthusiast** 🌟 - Played 50 games
7. **Champion** 👑 - Won 10 games
8. **Perfect!** 💎 - Won in 1 guess
9. **Vocabulary Master** 📚 - Beat Expert level
10. **Speed Demon** ⏱️ - Won in under 30 seconds
11. **Explorer** 🗺️ - Tried all game modes
12. **Word Wizard** 🧙 - Reached level 10

## Troubleshooting

### Connection Issues
- Verify your Supabase URL and keys are correct
- Check that the tables exist in Supabase
- Ensure Row Level Security policies are properly set

### Registration Fails
- Check the browser console for errors
- Verify the backend is receiving the request
- Check Supabase logs in the dashboard

### Progress Not Saving
- Ensure you're logged in (token in localStorage)
- Check that the user_progress table exists
- Verify the JWT token is valid

## Security Notes

- The `.env` file is already in `.gitignore` - never commit it to Git
- The SUPABASE_SERVICE_KEY has full access - keep it secret
- Row Level Security ensures users can only access their own data
- Passwords are hashed with bcrypt before storage
- JWT tokens expire after 7 days

## Next Steps

After setup is complete:
1. Test user registration and login
2. Play some games to verify progress tracking
3. Check that badges are awarded correctly
4. View the leaderboard
5. Deploy to production on Netlify
