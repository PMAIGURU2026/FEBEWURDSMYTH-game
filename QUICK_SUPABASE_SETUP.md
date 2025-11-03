# Quick Supabase Setup - DO THIS NOW

## IMMEDIATE ACTION REQUIRED

You need to create the database tables in Supabase before the app will work.

### Step-by-Step Instructions:

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard
   - Select your project → SQL Editor

2. **Run the Schema SQL**
   - Open the file: `backend/database/supabase_schema.sql`
   - Copy ALL the SQL code
   - Paste it into the SQL Editor
   - Click the green **RUN** button

3. **Verify Tables Created**
   - Click **Table Editor** in left sidebar
   - You should see two tables:
     - ✅ `users`
     - ✅ `user_progress`

4. **Configure Netlify Environment Variables** (for production)
   - Go to: https://app.netlify.com/sites/febewurdsmyth/settings/deploys#environment
   - Add these 4 variables (use the values from your Supabase dashboard and local .env file):

   ```
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_KEY=<your-service-role-key>
   JWT_SECRET=<your-jwt-secret>
   ```

   - Click **Save**

5. **Redeploy**
   - After setting environment variables, trigger a new deploy
   - Or wait for the next commit to auto-deploy

---

## What This Does

- Creates `users` table for storing accounts
- Creates `user_progress` table for tracking game stats, badges, XP
- Sets up Row Level Security to protect user data
- Creates indexes for fast queries
- Enables the leaderboard and badge system

## If You Get Errors

- Make sure you're logged into the correct Supabase project
- Check that you have admin access to the project
- Try running the SQL in smaller sections if needed
- Verify your environment variables are correctly set in Netlify

---

**IMPORTANT:** The app won't work until you run the SQL schema!
