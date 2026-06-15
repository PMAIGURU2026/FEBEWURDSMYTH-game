/**
 * Frontend Supabase client (uses the anon/public key — read-only with RLS).
 *
 * Credentials come from frontend/js/env-config.js which is gitignored.
 * - Local dev: copy env-config.example.js → env-config.js and fill in values.
 * - Vercel: set SUPABASE_URL and SUPABASE_ANON_KEY as env vars; the build
 *   script (scripts/generate-frontend-env.js) creates env-config.js automatically.
 *
 * env-config.js must be loaded BEFORE this script in the HTML (see index.html).
 */

let _supabaseClient = null;

function getSupabaseClient() {
    if (_supabaseClient) return _supabaseClient;

    // ENV_CONFIG is defined in env-config.js
    if (typeof ENV_CONFIG === 'undefined' || !ENV_CONFIG.SUPABASE_URL || !ENV_CONFIG.SUPABASE_ANON_KEY) {
        console.warn('Supabase frontend config not set — direct DB reads disabled.');
        return null;
    }

    if (typeof supabase === 'undefined') {
        console.warn('Supabase CDN not loaded — direct DB reads disabled.');
        return null;
    }

    _supabaseClient = supabase.createClient(ENV_CONFIG.SUPABASE_URL, ENV_CONFIG.SUPABASE_ANON_KEY);
    return _supabaseClient;
}

/** Read user_stats for a given user_id directly from Supabase (anon key + RLS). */
async function fetchUserStatsFromDB(userId) {
    const client = getSupabaseClient();
    if (!client) return null;

    const { data, error } = await client
        .from('user_stats')
        .select('total_points, current_streak, longest_streak, badges_earned')
        .eq('user_id', userId)
        .maybeSingle();

    if (error) { console.error('Supabase read error:', error.message); return null; }
    return data;
}

/** Read top-10 leaderboard entries directly from Supabase. */
async function fetchLeaderboardFromDB(limit = 10) {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client
        .from('user_stats')
        .select('user_id, total_points, current_streak, badges_earned')
        .order('total_points', { ascending: false })
        .limit(limit);

    if (error) { console.error('Supabase leaderboard error:', error.message); return []; }
    return data || [];
}
