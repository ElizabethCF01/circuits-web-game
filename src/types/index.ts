export type Command = "UP" | "DOWN" | "LEFT" | "RIGHT" | "ACTIVATE_CIRCUIT";

export type TileType =
  | "circuit-01"
  | "circuit-02"
  | "block-01"
  | "block-02"
  | "obstacle-01";

export interface Position {
  x: number;
  y: number;
}

export type BoardGrid = TileType[][];

export interface Level {
  id: number;
  name: string;
  description: string;
  grid: BoardGrid;
  startPosition: Position;
  requiredCircuits: number;
  maxCommands: number;
}

export interface CommandPanelProps {
  onAddCommand: (command: Command) => void;
}

// Tile map type
export type TileMap = Record<TileType, string>;
