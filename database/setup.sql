-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Create teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_name TEXT UNIQUE NOT NULL,
    ice_cream INT DEFAULT 0 CHECK (ice_cream >= 0),
    dart INT DEFAULT 0 CHECK (dart >= 0),
    balloon INT DEFAULT 0 CHECK (balloon >= 0),
    cup_stack INT DEFAULT 0 CHECK (cup_stack >= 0),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create settings table
CREATE TABLE IF NOT EXISTS leaderboard_settings (
    id INT PRIMARY KEY DEFAULT 1,
    show_ice_cream BOOLEAN DEFAULT TRUE,
    show_dart BOOLEAN DEFAULT TRUE,
    show_balloon BOOLEAN DEFAULT TRUE,
    show_cup_stack BOOLEAN DEFAULT TRUE,
    show_total BOOLEAN DEFAULT TRUE,
    leaderboard_visible BOOLEAN DEFAULT FALSE,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default settings if not exists
INSERT INTO leaderboard_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- 3. Create Ranking View
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT
    id,
    team_name,
    ice_cream,
    dart,
    balloon,
    cup_stack,
    (ice_cream + dart + balloon + cup_stack) AS total,
    RANK() OVER (
        ORDER BY
            (ice_cream + dart + balloon + cup_stack) DESC,
            ice_cream DESC,
            dart DESC,
            balloon DESC,
            cup_stack DESC,
            team_name ASC
    ) AS rank,
    updated_at
FROM teams;

-- 4. Create RPC function for atomic updates
CREATE OR REPLACE FUNCTION update_score(team_id UUID, column_name TEXT, delta INT)
RETURNS VOID AS $$
DECLARE
    current_val INT;
    new_val INT;
BEGIN
    -- Validate column name to prevent SQL injection
    IF column_name NOT IN ('ice_cream', 'dart', 'balloon', 'cup_stack') THEN
        RAISE EXCEPTION 'Invalid column name';
    END IF;

    -- Update and ensure non-negative
    EXECUTE format('UPDATE teams SET %I = GREATEST(%I + $1, 0), updated_at = now() WHERE id = $2', column_name, column_name)
    USING delta, team_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE leaderboard_settings;

-- Add column safely
ALTER TABLE teams
ADD COLUMN IF NOT EXISTS last_updated_by TEXT;

-- Batch Update RPC
CREATE OR REPLACE FUNCTION update_score_batch(
    updates JSONB,
    client_id TEXT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    item JSONB;
BEGIN
    FOR item IN SELECT * FROM jsonb_array_elements(updates)
    LOOP
        UPDATE teams
        SET
            ice_cream = GREATEST(ice_cream + COALESCE((item->>'ice_cream')::int, 0), 0),
            dart = GREATEST(dart + COALESCE((item->>'dart')::int, 0), 0),
            balloon = GREATEST(balloon + COALESCE((item->>'balloon')::int, 0), 0),
            cup_stack = GREATEST(cup_stack + COALESCE((item->>'cup_stack')::int, 0), 0),
            last_updated_by = client_id,
            updated_at = now()
        WHERE id = (item->>'id')::uuid;
    END LOOP;
END;
$$;