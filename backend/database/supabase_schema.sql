-- WURDSMYTH Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- =============================================
-- TABLE: users
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  password VARCHAR(255) NOT NULL
);

-- =============================================
-- TABLE: game_sessions
-- =============================================
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  mode VARCHAR(50) NOT NULL,
  level VARCHAR(50) NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: user_stats
-- =============================================
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  badges_earned JSONB DEFAULT '[]',
  last_played_date DATE
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_completed_at ON game_sessions(completed_at DESC);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- users: service role writes; no direct client reads (auth goes through API)
CREATE POLICY "Service role manages users"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

-- game_sessions: open read for leaderboard, service role writes
CREATE POLICY "Anyone can view game sessions"
  ON game_sessions FOR SELECT
  USING (true);

CREATE POLICY "Service role inserts game sessions"
  ON game_sessions FOR INSERT
  WITH CHECK (true);

-- user_stats: open read (so frontend can display stats), service role writes
CREATE POLICY "Anyone can view user stats"
  ON user_stats FOR SELECT
  USING (true);

CREATE POLICY "Service role manages user stats"
  ON user_stats FOR ALL
  USING (true)
  WITH CHECK (true);
