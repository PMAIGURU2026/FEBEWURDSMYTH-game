# Quick Supabase Setup - DO THIS NOW

## IMMEDIATE ACTION REQUIRED

You need to create the database tables in Supabase before the app will work.

### Step-by-Step Instructions:

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard/project/nqfgblvxcgaodcpmrxua/editor
   - Or navigate to your project → SQL Editor

2. **Run the Schema SQL**
   - Open the file: `backend/database/supabase_schema.sql`
   - Copy ALL the SQL code
   - Paste it into the SQL Editor
   - Click the green **RUN** button

3. **Verify Tables Created**
   - Go to: https://supabase.com/dashboard/project/nqfgblvxcgaodcpmrxua/editor
   - Click **Table Editor** in left sidebar
   - You should see two tables:
     - ✅ `users`
     - ✅ `user_progress`

4. **Configure Netlify Environment Variables** (for production)
   - Go to: https://app.netlify.com/sites/febewurdsmyth/settings/deploys#environment
   - Add these variables:

   ```
   SUPABASE_URL=https://nqfgblvxcgaodcpmrxua.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xZmdibHZ4Y2dhb2RjcG1yeHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMjQ1ODYsImV4cCI6MjA3NzcwMDU4Nn0.j8uTWazs_CD-y_4_9mcndeDfpQkbmFpESZo2jrHhhbQ
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xZmdibHZ4Y2dhb2RjcG1yeHVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjEyNDU4NiwiZXhwIjoyMDc3NzAwNTg2fQ.FQbCAAKruTo2h7ncnvKhymR/tlx7dwczt1kOFsWp1LofDK+Uedyi3nv5CrmnAfCx18cCEXMF5EpMYkscw9SOXw
   JWT_SECRET=wurdsmyth-super-secret-key-2024
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
- Verify the project ID matches: `nqfgblvxcgaodcpmrxua`
- Check that you have admin access to the project
- Try running the SQL in smaller sections if needed

---

**IMPORTANT:** The app won't work until you run the SQL schema!
