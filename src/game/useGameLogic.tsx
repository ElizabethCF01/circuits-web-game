import { useState, useEffect, useRef } from "react";
import type { Command, Position, BoardGrid } from "../types";

interface UseGameLogicReturn {
  robotPos: Position;
  commands: Command[];
  activatedCircuits: Set<string>;
  setCommands: (cmds: Command[]) => void;
  execute: (board: BoardGrid) => Promise<Set<string> | null>;
  reset: () => void;
}

interface UseGameLogicProps {
  startPosition: Position;
  gridSize: { width: number; height: number };
}

export function useGameLogic({
  startPosition,
  gridSize,
}: UseGameLogicProps): UseGameLogicReturn {
  const [robotPos, setRobotPos] = useState<Position>(startPosition);
  const [commands, setCommands] = useState<Command[]>([]);
  const [activatedCircuits, setActivatedCircuits] = useState<Set<string>>(
    new Set()
  );
  const abortExecutionRef = useRef(false);

  useEffect(() => {
    setRobotPos(startPosition);
  }, [startPosition]);

  const execute = async (board: BoardGrid): Promise<Set<string> | null> => {
    abortExecutionRef.current = false;

    setRobotPos(startPosition);
    setActivatedCircuits(new Set());

    let currentPos = { ...startPosition };
    const newActivatedCircuits = new Set<string>();

    for (const cmd of commands) {
      await new Promise((res) => setTimeout(res, 400));

      // Check if execution was cancelled
      if (abortExecutionRef.current) {
        return null;
      }

      if (cmd === "ACTIVATE_CIRCUIT") {
        // Check if robot is on a circuit tile
        const currentTile = board[currentPos.x][currentPos.y];
        if (currentTile.startsWith("circuit")) {
          const key = `${currentPos.x}-${currentPos.y}`;
          newActivatedCircuits.add(key);
          setActivatedCircuits((prev) => {
            const newSet = new Set(prev);
            newSet.add(key);
            return newSet;
          });
        }
      } else {
        let { x, y } = currentPos;
        if (cmd === "UP") x = Math.max(0, x - 1);
        if (cmd === "DOWN") x = Math.min(gridSize.height - 1, x + 1);
        if (cmd === "LEFT") y = Math.max(0, y - 1);
        if (cmd === "RIGHT") y = Math.min(gridSize.width - 1, y + 1);

        // Check if the new position is valid
        const newTile = board[x][y];
        const isObstacle =
          newTile.startsWith("obstacle") || newTile === "wall";
        if (!isObstacle) {
          currentPos = { x, y };

          // Update position
          setRobotPos({ ...currentPos });
        }
      }
    }

    return newActivatedCircuits;
  };

  const reset = (): void => {
    abortExecutionRef.current = true;
    setRobotPos(startPosition);
    setActivatedCircuits(new Set());
  };

  return {
    robotPos,
    commands,
    activatedCircuits,
    setCommands,
    execute,
    reset,
  };
}
