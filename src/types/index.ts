export type Command = "UP" | "DOWN" | "LEFT" | "RIGHT" | "ACTIVATE_CIRCUIT";

export type TileType = string;

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

export type TileMap = Record<string, string>;
