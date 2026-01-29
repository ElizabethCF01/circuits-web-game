import { useTiles } from "../../context/TileContext";
import type { BoardGrid, Position } from "../../types";
import { robot } from "../../assets/images";
import "./Board.css";

interface BoardProps {
  board: BoardGrid;
  robotPosition: Position;
  activatedCircuits: Set<string>;
  isWalking: boolean;
}

export default function Board({
  board,
  robotPosition,
  activatedCircuits,
  isWalking,
}: BoardProps) {
  const { tileMap } = useTiles();

  const columns = board[0]?.length || 0;

  return (
    <div
      className="board"
      style={{ gridTemplateColumns: `repeat(${columns}, 64px)` }}
    >
      {board.map((row, rIndex) =>
        row.map((cell, cIndex) => {
          const tileSrc = tileMap[cell];
          const isCircuitTile = cell.startsWith("circuit");
          const isActivated = activatedCircuits.has(`${rIndex}-${cIndex}`);

          return (
            <div
              key={`${rIndex}-${cIndex}`}
              className={`tile ${
                isCircuitTile && isActivated ? "activated-circuit" : ""
              }`}
              style={{ backgroundImage: `url(${tileSrc})` }}
            >
              {robotPosition.x === rIndex && robotPosition.y === cIndex && (
                <div className="robot">
                  <img
                    src={isWalking ? robot.walk : robot.idle}
                    alt="robot"
                    draggable="false"
                  />
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
