/**
 * Supabase server-side client (uses service role key for full DB access).
 * Credentials must be in .env locally or Vercel environment variables in production.
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  // Warn but do not exit — lets the app start even without DB (game routes still work)
  console.warn(
    '[Supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY. ' +
    'Auth and progress features will fail. Set these in .env or Vercel env vars.'
  );
}

const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '', {
  auth: { autoRefreshToken: false, persistSession: false }
});

module.exports = supabase;
