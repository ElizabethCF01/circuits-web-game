# LightBot - Database Schema Diagrams (Simplified)

## Entity Relationship Diagram (ERD) - SIMPLIFIED

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SIMPLIFIED DATABASE SCHEMA                            │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│       USERS          │  (Cuenta de autenticación)
├──────────────────────┤
│ PK id (UUID)         │
│    username          │
│    email             │
│    password_hash     │
│    created_at        │
└──────────┬───────────┘
           │
           │ 1:1
           │
┌──────────▼───────────┐                    ┌─────────────────────┐
│      PLAYERS         │  (Perfil jugador)  │       GRIDS         │
├──────────────────────┤                    ├─────────────────────┤
│ PK id (UUID)         │                    │ PK id (INT)         │
│ FK user_id (UNIQUE)  │                    │    width            │
│    display_name      │                    │    height           │
│    avatar_url        │                    │    tiles (JSONB)    │
│    current_level_id  │                    │    created_at       │
│    total_stars       │                    └──────────┬──────────┘
│    last_played_at    │                               │
└──────────┬───────────┘                               │ 1
           │                                           │
           │                                           │ referenced by
           │                                           │
           │                                           │ N
           │                          ┌────────────────▼──────────────┐
           │                          │          LEVELS               │
           │                          ├───────────────────────────────┤
           │                          │ PK id (INT)                   │
           │                          │ FK grid_id                    │
           │                          │    name                       │
           │                          │    description                │
           │                          │    start_x                    │
           │                          │    start_y                    │
           │                          │    required_circuits          │
           │                          │    max_commands               │
           │                          │    difficulty                 │
           │                          │    order_index                │
           │                          └────────────┬──────────────────┘
           │                                       │
           │                                       │ N
           │                                       │
           │                                       │
           │ 1                                     │ 1
           │                                       │
           │ has                                   │ for
           │                                       │
           │ N                                     │ N
           │                          ┌────────────▼──────────────────┐
           └─────────────────────────►│    PLAYER_LEVEL_STATS         │
                                      ├───────────────────────────────┤
                                      │ PK (player_id, level_id)      │
                                      │ FK player_id                  │
                                      │ FK level_id                   │
                                      │    best_commands_used         │
                                      │    best_time_seconds          │
                                      │    stars_earned               │
                                      │    total_attempts             │
                                      │    completed                  │
                                      │    first_completed_at         │
                                      │    last_played_at             │
                                      └───────────────────────────────┘
```

## Core Entities (4 Main Tables)

```
╔═══════════╗         ╔══════════╗
║   USERS   ║  1:1    ║ PLAYERS  ║
║ (Account) ║────────►║ (Profile)║
╚═══════════╝         ╚════╦═════╝
                           ║
                           ║ M:N
                           ║
╔═══════════╗         ╔════╩═════╗         ╔══════════╗
║   GRIDS   ║  1:N    ║  LEVELS  ║   1:N   ║  STATS   ║
║(Reusable) ║────────►║(Game Map)║◄────────║(Progress)║
╚═══════════╝         ╚══════════╝         ╚══════════╝
```

## SQL Schema Definition

```sql
-- ============================================
-- TABLE: users (Authentication)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- ============================================
-- TABLE: players (Game Profile)
-- ============================================
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  current_level_id INTEGER,
  total_stars INTEGER DEFAULT 0,
  last_played_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_players_user ON players(user_id);

-- ============================================
-- TABLE: grids (Reusable Grid Layouts)
-- ============================================
CREATE TABLE grids (
  id SERIAL PRIMARY KEY,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  tiles JSONB NOT NULL, -- 2D array: [["block-01", "circuit-01"], ...]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_dimensions CHECK (width > 0 AND height > 0)
);

-- ============================================
-- TABLE: levels (Game Levels)
-- ============================================
CREATE TABLE levels (
  id SERIAL PRIMARY KEY,
  grid_id INTEGER NOT NULL REFERENCES grids(id) ON DELETE RESTRICT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  start_x INTEGER NOT NULL,
  start_y INTEGER NOT NULL,
  required_circuits INTEGER NOT NULL,
  max_commands INTEGER NOT NULL,
  difficulty VARCHAR(20) DEFAULT 'easy', -- 'easy', 'medium', 'hard'
  order_index INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_levels_grid ON levels(grid_id);
CREATE INDEX idx_levels_order ON levels(order_index);
CREATE INDEX idx_levels_difficulty ON levels(difficulty);

-- ============================================
-- TABLE: player_level_stats (Progress & Stats)
-- ============================================
CREATE TABLE player_level_stats (
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  level_id INTEGER NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  best_commands_used INTEGER,
  best_time_seconds INTEGER,
  stars_earned INTEGER DEFAULT 0 CHECK (stars_earned BETWEEN 0 AND 3),
  total_attempts INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  first_completed_at TIMESTAMP,
  last_played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (player_id, level_id)
);

CREATE INDEX idx_stats_player ON player_level_stats(player_id);
CREATE INDEX idx_stats_level ON player_level_stats(level_id);
CREATE INDEX idx_stats_completed ON player_level_stats(completed, stars_earned);
```

## Data Flow Diagram (Simplified)

```
┌──────────────────────────────────────────────────────────────┐
│                    PLAYER GAME FLOW                           │
└──────────────────────────────────────────────────────────────┘

    [User Login]
         │
         ▼
    ┌─────────┐ 1:1  ┌─────────┐
    │  USERS  │─────►│ PLAYERS │
    └─────────┘      └────┬────┘
                          │
                          │ Load current_level_id
                          ▼
                     ┌─────────┐
                     │ LEVELS  │
                     └────┬────┘
                          │
                          │ Get grid_id
                          ▼
                     ┌─────────┐
                     │  GRIDS  │ (tiles data)
                     └─────────┘
                          │
                          │ Player completes level
                          ▼
                ┌──────────────────────┐
                │ PLAYER_LEVEL_STATS   │
                │ - Update best score  │
                │ - Increment attempts │
                │ - Calculate stars    │
                └──────────┬───────────┘
                           │
                           │ Update total_stars
                           ▼
                     ┌─────────┐
                     │ PLAYERS │
                     └─────────┘
```

## Relationships Summary

```
USERS (1) ──────< has >────── (1) PLAYERS

GRIDS (1) ──────< used in >──── (N) LEVELS

PLAYERS (1) ────< plays >────── (N) PLAYER_LEVEL_STATS

LEVELS (1) ─────< tracked in >─ (N) PLAYER_LEVEL_STATS
```

## Example Data

```sql
-- Example: Insert a reusable grid
INSERT INTO grids (width, height, tiles) VALUES (
  6, 6,
  '[
    ["block-01", "block-01", "block-01", "block-01", "block-01", "block-01"],
    ["block-01", "obstacle-01", "block-01", "circuit-01", "block-01", "block-01"],
    ["block-01", "block-01", "block-01", "obstacle-01", "block-01", "circuit-02"],
    ["block-01", "obstacle-01", "block-01", "block-01", "block-01", "block-01"],
    ["block-01", "block-01", "block-02", "block-02", "obstacle-01", "block-01"],
    ["block-01", "block-01", "block-01", "block-01", "block-01", "block-01"]
  ]'::jsonb
);

-- Example: Create a level using that grid
INSERT INTO levels (grid_id, name, description, start_x, start_y, required_circuits, max_commands, difficulty, order_index)
VALUES (
  1,
  'First Steps',
  'Learn the basics of movement and circuit activation',
  0, 0, 2, 15, 'easy', 1
);

-- Example: Record player progress
INSERT INTO player_level_stats (player_id, level_id, best_commands_used, best_time_seconds, stars_earned, total_attempts, completed, first_completed_at)
VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  1,
  12, 45, 3, 5, true,
  CURRENT_TIMESTAMP
)
ON CONFLICT (player_id, level_id) DO UPDATE SET
  best_commands_used = LEAST(player_level_stats.best_commands_used, EXCLUDED.best_commands_used),
  best_time_seconds = LEAST(player_level_stats.best_time_seconds, EXCLUDED.best_time_seconds),
  stars_earned = GREATEST(player_level_stats.stars_earned, EXCLUDED.stars_earned),
  total_attempts = player_level_stats.total_attempts + 1,
  completed = true,
  last_played_at = CURRENT_TIMESTAMP;
```

## Common Queries

```sql
-- Get player's progress overview
SELECT
  p.display_name,
  p.total_stars,
  COUNT(CASE WHEN pls.completed THEN 1 END) as levels_completed,
  COUNT(pls.level_id) as levels_attempted,
  l.name as current_level_name
FROM players p
LEFT JOIN player_level_stats pls ON p.id = pls.player_id
LEFT JOIN levels l ON p.current_level_id = l.id
WHERE p.id = '123e4567-e89b-12d3-a456-426614174000'
GROUP BY p.id, p.display_name, p.total_stars, l.name;

-- Get level details with grid
SELECT
  l.id,
  l.name,
  l.description,
  l.start_x,
  l.start_y,
  l.required_circuits,
  l.max_commands,
  l.difficulty,
  g.width,
  g.height,
  g.tiles
FROM levels l
INNER JOIN grids g ON l.grid_id = g.id
WHERE l.order_index = 1;

-- Get player's stats for a specific level
SELECT
  pls.*,
  l.name as level_name,
  l.max_commands
FROM player_level_stats pls
INNER JOIN levels l ON pls.level_id = l.id
WHERE pls.player_id = '123e4567-e89b-12d3-a456-426614174000'
  AND pls.level_id = 1;

-- Get leaderboard for a level (top 10 by fewest commands)
SELECT
  p.display_name,
  pls.best_commands_used,
  pls.best_time_seconds,
  pls.stars_earned,
  ROW_NUMBER() OVER (ORDER BY pls.best_commands_used ASC, pls.best_time_seconds ASC) as rank
FROM player_level_stats pls
INNER JOIN players p ON pls.player_id = p.id
WHERE pls.level_id = 1
  AND pls.completed = true
ORDER BY pls.best_commands_used ASC, pls.best_time_seconds ASC
LIMIT 10;
```

## Database Size Estimations

```
┌─────────────────────┬──────────────┬────────────────────────┐
│      TABLE          │  GROWTH RATE │    SIZE (10K players)  │
├─────────────────────┼──────────────┼────────────────────────┤
│ users               │ Linear       │ ~10,000 rows           │
│ players             │ Linear       │ ~10,000 rows           │
│ grids               │ Very Slow    │ ~50-100 rows           │
│ levels              │ Very Slow    │ ~100-200 rows          │
│ player_level_stats  │ Moderate     │ ~500,000 rows          │
│                     │              │ (50 levels avg/player) │
└─────────────────────┴──────────────┴────────────────────────┘

Storage per player (approximate):
- User account: ~500 bytes
- Player profile: ~300 bytes
- Stats (50 levels): ~50 KB
Total: ~51 KB per player
```

## Key Benefits of This Schema

1. **Grid Reusability**: Multiple levels can share the same grid layout
2. **Single Stats Table**: One row per player-level combination (no duplicate data)
3. **Efficient Queries**: Composite primary key (player_id, level_id) makes lookups fast
4. **Simple Updates**: UPSERT pattern keeps best scores automatically
5. **Clean Separation**: Authentication (users) separated from game data (players)

## Migration Path from Current Code

```typescript
// Current TypeScript Level structure
interface Level {
  id: number;
  name: string;
  description: string;
  grid: BoardGrid;  // ← This becomes a separate GRID entity
  startPosition: Position;
  requiredCircuits: number;
  maxCommands: number;
}

// Maps to:
// 1. INSERT grid.tiles → grids table
// 2. INSERT level data → levels table (with grid_id reference)
// 3. Store startPosition as start_x, start_y columns
```

