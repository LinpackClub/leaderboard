-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- 1. Create teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_name TEXT UNIQUE NOT NULL,
    members TEXT DEFAULT '',
    games_playing INT DEFAULT 4 CHECK (games_playing IN (3, 4)),
    ice_cream INT DEFAULT 0 CHECK (ice_cream >= 0),
    dart INT DEFAULT 0 CHECK (dart >= 0),
    balloon INT DEFAULT 0 CHECK (balloon >= 0),
    face_painting INT DEFAULT 0 CHECK (face_painting >= 0),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    last_updated_by TEXT
);
-- Migration: Ensure new columns exist for existing tables
DO $$ BEGIN -- Add games_playing if missing
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'teams'
        AND column_name = 'games_playing'
) THEN
ALTER TABLE teams
ADD COLUMN games_playing INT DEFAULT 4 CHECK (games_playing IN (3, 4));
END IF;
-- Add members if missing
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'teams'
        AND column_name = 'members'
) THEN
ALTER TABLE teams
ADD COLUMN members TEXT DEFAULT '';
END IF;
-- Handle renaming cup_stack to face_painting
IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'teams'
        AND column_name = 'cup_stack'
)
AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'teams'
        AND column_name = 'face_painting'
) THEN
ALTER TABLE teams
    RENAME COLUMN cup_stack TO face_painting;
ELSIF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'teams'
        AND column_name = 'face_painting'
) THEN
ALTER TABLE teams
ADD COLUMN face_painting INT DEFAULT 0 CHECK (face_painting >= 0);
END IF;
-- Add created_at if missing
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'teams'
        AND column_name = 'created_at'
) THEN
ALTER TABLE teams
ADD COLUMN created_at TIMESTAMPTZ DEFAULT now();
END IF;
-- Add last_updated_by if missing
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'teams'
        AND column_name = 'last_updated_by'
) THEN
ALTER TABLE teams
ADD COLUMN last_updated_by TEXT;
END IF;
END $$;
-- 2. Create settings table
CREATE TABLE IF NOT EXISTS leaderboard_settings (
    id INT PRIMARY KEY DEFAULT 1,
    show_ice_cream BOOLEAN DEFAULT TRUE,
    show_dart BOOLEAN DEFAULT TRUE,
    show_balloon BOOLEAN DEFAULT TRUE,
    show_face_painting BOOLEAN DEFAULT TRUE,
    show_members BOOLEAN DEFAULT TRUE,
    show_total BOOLEAN DEFAULT TRUE,
    leaderboard_visible BOOLEAN DEFAULT FALSE,
    CONSTRAINT single_row CHECK (id = 1)
);
-- Migration: Ensure columns exist in settings
DO $$ BEGIN IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'leaderboard_settings'
        AND column_name = 'show_cup_stack'
)
AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'leaderboard_settings'
        AND column_name = 'show_face_painting'
) THEN
ALTER TABLE leaderboard_settings
    RENAME COLUMN show_cup_stack TO show_face_painting;
ELSIF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'leaderboard_settings'
        AND column_name = 'show_face_painting'
) THEN
ALTER TABLE leaderboard_settings
ADD COLUMN show_face_painting BOOLEAN DEFAULT TRUE;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'leaderboard_settings'
        AND column_name = 'show_members'
) THEN
ALTER TABLE leaderboard_settings
ADD COLUMN show_members BOOLEAN DEFAULT TRUE;
END IF;
END $$;
-- Insert default settings if not exists
INSERT INTO leaderboard_settings (id)
VALUES (1) ON CONFLICT DO NOTHING;
-- 3. Create Ranking View
DROP VIEW IF EXISTS leaderboard_view CASCADE;
CREATE OR REPLACE VIEW leaderboard_view AS WITH max_scores AS (
        SELECT NULLIF(
                MAX(ice_cream) FILTER (
                    WHERE games_playing = 4
                ),
                0
            ) as max_ice,
            NULLIF(MAX(dart), 0) as max_dart,
            NULLIF(MAX(balloon), 0) as max_balloon,
            NULLIF(MAX(face_painting), 0) as max_face
        FROM teams
    ),
    normalized_scores AS (
        SELECT t.*,
            ROUND(
                COALESCE((t.ice_cream::float / m.max_ice) * 100, 0)::numeric,
                2
            ) as ice_percent,
            ROUND(
                COALESCE((t.dart::float / m.max_dart) * 100, 0)::numeric,
                2
            ) as dart_percent,
            ROUND(
                COALESCE((t.balloon::float / m.max_balloon) * 100, 0)::numeric,
                2
            ) as balloon_percent,
            ROUND(
                COALESCE((t.face_painting::float / m.max_face) * 100, 0)::numeric,
                2
            ) as face_percent
        FROM teams t,
            max_scores m
    ),
    final_calculation AS (
        SELECT *,
            CASE
                WHEN games_playing = 4 THEN ROUND(
                    (
                        (
                            ice_percent + dart_percent + balloon_percent + face_percent
                        ) / 4
                    )::numeric,
                    2
                )
                ELSE ROUND(
                    (
                        (dart_percent + balloon_percent + face_percent) / 3
                    )::numeric,
                    2
                )
            END as final_percentage
        FROM normalized_scores
    )
SELECT *,
    final_percentage as total,
    -- maintain compatibility
    -- Overall rank
    RANK() OVER (
        ORDER BY final_percentage DESC,
            dart DESC,
            face_painting DESC,
            ice_cream DESC,
            balloon DESC,
            created_at ASC
    ) AS rank,
    -- Individual Game Ranks
    RANK() OVER (
        ORDER BY ice_cream DESC,
            final_percentage DESC,
            dart DESC,
            face_painting DESC,
            ice_cream DESC,
            -- redundant but follows sequence
            balloon DESC,
            created_at ASC
    ) AS ice_rank,
    RANK() OVER (
        ORDER BY dart DESC,
            final_percentage DESC,
            dart DESC,
            face_painting DESC,
            ice_cream DESC,
            balloon DESC,
            created_at ASC
    ) AS dart_rank,
    RANK() OVER (
        ORDER BY balloon DESC,
            final_percentage DESC,
            dart DESC,
            face_painting DESC,
            ice_cream DESC,
            balloon DESC,
            created_at ASC
    ) AS balloon_rank,
    RANK() OVER (
        ORDER BY face_painting DESC,
            final_percentage DESC,
            dart DESC,
            face_painting DESC,
            ice_cream DESC,
            balloon DESC,
            created_at ASC
    ) AS face_rank
FROM final_calculation;
-- 4. Create RPC function for atomic updates
CREATE OR REPLACE FUNCTION update_score(team_id UUID, column_name TEXT, delta INT) RETURNS VOID AS $$ BEGIN -- Validate column name to prevent SQL injection
    IF column_name NOT IN ('ice_cream', 'dart', 'balloon', 'face_painting') THEN RAISE EXCEPTION 'Invalid column name';
END IF;
-- Update and ensure non-negative
EXECUTE format(
    'UPDATE teams SET %I = GREATEST(%I + $1, 0), updated_at = now() WHERE id = $2',
    column_name,
    column_name
) USING delta,
team_id;
END;
$$ LANGUAGE plpgsql;
-- 5. Enable Realtime
-- Use DO block to handle cases where publication might not exist or table already added
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_publication
    WHERE pubname = 'supabase_realtime'
) THEN CREATE PUBLICATION supabase_realtime;
END IF;
-- Add tables safely
BEGIN ALTER PUBLICATION supabase_realtime
ADD TABLE teams;
EXCEPTION
WHEN others THEN NULL;
END;
BEGIN ALTER PUBLICATION supabase_realtime
ADD TABLE leaderboard_settings;
EXCEPTION
WHEN others THEN NULL;
END;
END $$;
-- Batch Update RPC
CREATE OR REPLACE FUNCTION update_score_batch(updates JSONB, client_id TEXT) RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE item JSONB;
BEGIN FOR item IN
SELECT *
FROM jsonb_array_elements(updates) LOOP
UPDATE teams
SET ice_cream = GREATEST(
        ice_cream + COALESCE((item->>'ice_cream')::int, 0),
        0
    ),
    dart = GREATEST(dart + COALESCE((item->>'dart')::int, 0), 0),
    balloon = GREATEST(
        balloon + COALESCE((item->>'balloon')::int, 0),
        0
    ),
    face_painting = GREATEST(
        face_painting + COALESCE((item->>'face_painting')::int, 0),
        0
    ),
    members = COALESCE(item->>'members', members),
    last_updated_by = client_id,
    updated_at = now()
WHERE id = (item->>'id')::uuid;
END LOOP;
END;
$$;