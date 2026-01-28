export interface Player {
  id: number;
  nickname: string;
  xp: number;
  created_at: string;
  updated_at: string;
}

export interface PlayerProgress {
  player: {
    nickname: string;
    total_xp: number;
    levels_completed: number;
  };
  scores: PlayerScore[];
}

export interface PlayerScore {
  level_id: number;
  level_name: string;
  difficulty: string;
  xp_earned: number;
  commands_used: number;
  completed_at: string;
}
