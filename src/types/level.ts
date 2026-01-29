// --- Level browsing & playing ---

export interface ApiLevelSummary {
  id: number;
  name: string;
  description: string;
  difficulty: string;
  required_circuits: number;
  max_commands: number;
  grid_width: number;
  grid_height: number;
}

export interface ApiLevelTile {
  type: string;
  tile_id: number;
}

export interface ApiLevelDetail {
  id: number;
  name: string;
  description: string | null;
  difficulty: string;
  start_x: number;
  start_y: number;
  required_circuits: number;
  max_commands: number;
  grid_width: number;
  grid_height: number;
  tiles: ApiLevelTile[];
}

export interface LevelListResponse {
  levels: ApiLevelSummary[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface LevelListParams {
  search?: string;
  difficulty?: string;
  per_page?: number;
  page?: number;
}

export interface LevelCompleteRequest {
  commands: string[];
}

export interface LevelCompleteResponse {
  message: string;
  improved?: boolean;
  first_completion?: boolean;
  commands_used: number;
  xp_earned?: number;
  base_xp?: number;
  efficiency_bonus?: number;
  xp_bonus?: number;
  best_commands?: number;
  player_total_xp?: number;
}

// --- Level validation (editor) ---

export interface LevelTile {
  type: string;
}

export interface ValidateLevelRequest {
  tiles: LevelTile[];
  grid_width: number;
  grid_height: number;
  start_x: number;
  start_y: number;
  required_circuits: number;
}

export interface ValidateLevelResponse {
  valid: boolean;
  errors: string[];
  warnings: string[];
  metadata: {
    total_tiles: number;
    circuit_count: number;
    reachable_circuits: number;
    unreachable_circuits: number[];
  };
}

export interface ReachabilityRequest {
  tiles: LevelTile[];
  grid_width: number;
  grid_height: number;
  start_x: number;
  start_y: number;
}

export interface ReachabilityResponse {
  reachable_count: number;
  reachable_indices: number[];
  unreachable_circuits: number[];
}
