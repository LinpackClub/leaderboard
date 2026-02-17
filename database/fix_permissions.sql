-- Run this script in your Supabase SQL Editor to fix permission issues
-- 1. Grant access to 'teams' table
GRANT ALL ON TABLE teams TO anon,
    authenticated,
    service_role;
-- 2. Grant access to 'leaderboard_settings' table
GRANT ALL ON TABLE leaderboard_settings TO anon,
    authenticated,
    service_role;
-- 3. Grant access to 'leaderboard_view'
GRANT ALL ON TABLE leaderboard_view TO anon,
    authenticated,
    service_role;
-- 4. Grant execute permission on RPC functions
GRANT EXECUTE ON FUNCTION update_score(UUID, TEXT, INT) TO anon,
    authenticated,
    service_role;
GRANT EXECUTE ON FUNCTION update_score_batch(JSONB, TEXT) TO anon,
    authenticated,
    service_role;
-- 5. Reload the schema cache to ensure changes take effect immediately
NOTIFY pgrst,
'reload config';