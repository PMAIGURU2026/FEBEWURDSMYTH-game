-- WURDSMYTH Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  games_lost INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  win_streak INTEGER DEFAULT 0,
  perfect_games INTEGER DEFAULT 0,
  speed_wins INTEGER DEFAULT 0,
  expert_wins INTEGER DEFAULT 0,
  modes_played TEXT[] DEFAULT '{}',
  badges TEXT[] DEFAULT '{}',
  achievements JSONB DEFAULT '[]',
  game_history JSONB DEFAULT '[]',
  statistics JSONB DEFAULT '{"easy": {"played": 0, "won": 0}, "medium": {"played": 0, "won": 0}, "hard": {"played": 0, "won": 0}, "expert": {"played": 0, "won": 0}}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_total_score ON user_progress(total_score DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Users can read their own data
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

-- Users can update their own data
CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Allow inserts during registration (handled by service key)
CREATE POLICY "Enable insert for service role"
  ON users FOR INSERT
  WITH CHECK (true);

-- RLS Policies for user_progress table
-- Users can read their own progress
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Users can update their own progress
CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Allow inserts during registration (handled by service key)
CREATE POLICY "Enable insert for service role"
  ON user_progress FOR INSERT
  WITH CHECK (true);

-- Public read access for leaderboard (anyone can view top scores)
CREATE POLICY "Public read access for leaderboard"
  ON user_progress FOR SELECT
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE users IS 'Stores user account information';
COMMENT ON TABLE user_progress IS 'Stores game progress, statistics, and achievements for each user';
COMMENT ON COLUMN user_progress.modes_played IS 'Array of game modes the user has played';
COMMENT ON COLUMN user_progress.badges IS 'Array of badge IDs the user has earned';
COMMENT ON COLUMN user_progress.game_history IS 'JSON array of last 50 games played';
COMMENT ON COLUMN user_progress.statistics IS 'JSON object with per-difficulty statistics';
