# Netlify Environment Variables Setup

## ⚠️ REQUIRED - Do This Now to Fix Build Error

Netlify needs your Supabase credentials as environment variables. The build is currently failing because these aren't configured yet.

## Step-by-Step Instructions:

### 1. Go to Netlify Environment Variables Page
Click this link: https://app.netlify.com/sites/febewurdsmyth/configuration/env

Or navigate manually:
1. Go to https://app.netlify.com
2. Click on your **febewurdsmyth** site
3. Click **Site configuration** in left sidebar
4. Click **Environment variables**

### 2. Add Each Variable

Click the **Add a variable** button and add these 4 variables one by one:

#### Variable 1: SUPABASE_URL
- **Key:** `SUPABASE_URL`
- **Value:** `https://nqfgblvxcgaodcpmrxua.supabase.co`
- **Scopes:** Select "All" or "Production, Deploy Previews, Branch Deploys"

#### Variable 2: SUPABASE_ANON_KEY
- **Key:** `SUPABASE_ANON_KEY`
- **Value:** Get this from your local `.env` file (the long eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... string)
- **Scopes:** Select "All" or "Production, Deploy Previews, Branch Deploys"

#### Variable 3: SUPABASE_SERVICE_KEY
- **Key:** `SUPABASE_SERVICE_KEY`
- **Value:** Get this from your local `.env` file (the other long eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... string)
- **Scopes:** Select "All" or "Production, Deploy Previews, Branch Deploys"

#### Variable 4: JWT_SECRET
- **Key:** `JWT_SECRET`
- **Value:** `wurdsmyth-super-secret-key-2024`
- **Scopes:** Select "All" or "Production, Deploy Previews, Branch Deploys"

### 3. Trigger New Deploy

After adding all 4 variables:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**

Or just wait - Netlify will automatically retry the build soon.

## Where to Find Your Keys

If you don't have your `.env` file handy:

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **Settings** (gear icon) → **API**
4. You'll see:
   - **Project URL** → This is your `SUPABASE_URL`
   - **anon public** key → This is your `SUPABASE_ANON_KEY`
   - **service_role** key → This is your `SUPABASE_SERVICE_KEY` (click "Reveal" to see it)

## Verification

After adding the variables and deploying:
1. Check the build logs - should see "Build succeeded"
2. Visit https://febewurdsmyth.netlify.app
3. Try registering a new account
4. Play a game to test progress tracking

## Troubleshooting

**Build still failing?**
- Make sure all 4 variables are added
- Check for typos in the variable names (they're case-sensitive)
- Verify scopes include "Production"
- Try manually triggering a new deploy

**"User not found" errors?**
- Make sure you ran the SQL schema in Supabase (see QUICK_SUPABASE_SETUP.md)
- Check Supabase Table Editor to verify tables exist

---

Once you add these environment variables, the build should succeed!
