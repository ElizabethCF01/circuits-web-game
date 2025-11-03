import { useState, useCallback, useRef } from "react";
import Board from "./components/board/Board";
import ProgramGrid from "./components/ProgramGrid";
import InfoPanel from "./components/InfoPanel";
import { useGameLogic } from "./game/useGameLogic";
import { useLevelManager } from "./game/useLevelManager";
import type { Command } from "./types";
import "./App.css";

export default function App() {
  const {
    currentLevel,
    currentLevelIndex,
    nextLevel,
    hasNextLevel,
    completeCurrentLevel,
    isLevelCompleted,
  } = useLevelManager();

  const gridSize = {
    width: currentLevel.grid[0]?.length || 0,
    height: currentLevel.grid.length,
  };

  const { robotPos, activatedCircuits, setCommands, execute, reset } =
    useGameLogic({
      startPosition: currentLevel.startPosition,
      gridSize,
    });

  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  // Find all circuit tiles on the board
  const getAllCircuitPositions = (): Set<string> => {
    const circuits = new Set<string>();
    currentLevel.grid.forEach((row, rIndex) => {
      row.forEach((cell, cIndex) => {
        if (cell === "circuit-01" || cell === "circuit-02") {
          circuits.add(`${rIndex}-${cIndex}`);
        }
      });
    });
    return circuits;
  };

  const handleExecute = async () => {
    if (playButtonRef.current) {
      playButtonRef.current.classList.add("pressed");
      setTimeout(() => {
        playButtonRef.current?.classList.remove("pressed");
      }, 300);
    }

    setGameStatus("playing");
    const activatedSet = await execute(currentLevel.grid);

    if (activatedSet === null) {
      return;
    }

    // Check if all circuits are activated
    const allCircuits = getAllCircuitPositions();
    const allActivated = Array.from(allCircuits).every((pos) =>
      activatedSet.has(pos)
    );

    if (allActivated) {
      setGameStatus("won");
      completeCurrentLevel();
    } else {
      setGameStatus("lost");
    }
  };

  const handleReset = () => {
    if (resetButtonRef.current) {
      resetButtonRef.current.classList.add("pressed");
      setTimeout(() => {
        resetButtonRef.current?.classList.remove("pressed");
      }, 300);
    }

    reset();
    setGameStatus("playing");
  };

  const handleNextLevel = () => {
    nextLevel();
    reset();
    setGameStatus("playing");
  };

  const handleCommandsChange = useCallback(
    (commands: Command[]) => {
      setCommands(commands);
    },
    [setCommands]
  );

  return (
    <div className="app-container">
      <button
        className="info-button"
        onClick={() => setIsInfoOpen(true)}
        title="How to Play"
      >
        <img
          src="/src/assets/icons/info.svg"
          alt="Info"
          width={32}
          height={32}
        />
      </button>

      <InfoPanel isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />

      <div className="level-header">
        <h2>
          Level {currentLevelIndex + 1}: {currentLevel.name}
        </h2>
        <p className="level-description">{currentLevel.description}</p>
        <div className="level-stats">
          <span>Max Commands: {currentLevel.maxCommands}</span>
          <span>Required Circuits: {currentLevel.requiredCircuits}</span>
          {isLevelCompleted && (
            <span className="completed-badge">✓ Completed</span>
          )}
        </div>
      </div>

      <div className="game-layout">
        <div className="board-container">
          <Board
            board={currentLevel.grid}
            robotPosition={robotPos}
            activatedCircuits={activatedCircuits}
          />
        </div>

        <div className="controls-container">
          <ProgramGrid
            maxCommands={currentLevel.maxCommands}
            onCommandsChange={handleCommandsChange}
          />
        </div>
      </div>

      <div className="button-container">
        <button
          ref={playButtonRef}
          onClick={handleExecute}
          className="execute-button"
        >
          Play <img src="/src/assets/icons/play.svg" width={24} />
        </button>
        <button
          ref={resetButtonRef}
          onClick={handleReset}
          className="execute-button"
        >
          Reset <img src="/src/assets/icons/reset.svg" width={24} />
        </button>
        {gameStatus === "won" && hasNextLevel && (
          <button
            onClick={handleNextLevel}
            className="execute-button next-level-button"
          >
            Next Level <img src="/src/assets/icons/next.svg" width={24} />
          </button>
        )}
      </div>

      {gameStatus === "won" && (
        <div className="victory-message">
          Victory! All circuits activated!
          {!hasNextLevel && " You've completed all levels!"}
        </div>
      )}

      {gameStatus === "lost" && (
        <div className="defeat-message">
          Game Over! Some circuits remain inactive.
        </div>
      )}
    </div>
  );
}
