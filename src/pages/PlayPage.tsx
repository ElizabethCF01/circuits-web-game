import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Board from "../components/board/Board";
import ProgramGrid from "../components/ProgramGrid";
import { useGameLogic } from "../game/useGameLogic";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
import { useTiles } from "../context/TileContext";
import { getLevel, completeLevel } from "../services/level";
import type { ApiLevelDetail, LevelCompleteResponse } from "../types/level";
import type { Command } from "../types";
import { icons } from "../assets/images";
import "../App.css";

export default function PlayPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { player, refreshPlayer } = usePlayer();
  const { resolveGrid, isLoading: tilesLoading } = useTiles();

  const [level, setLevel] = useState<ApiLevelDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [completionResult, setCompletionResult] =
    useState<LevelCompleteResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const playButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError("");
    getLevel(Number(id))
      .then(setLevel)
      .catch(() => setError("Failed to load level."))
      .finally(() => setIsLoading(false));
  }, [id]);

  const grid = useMemo(() => {
    if (!level) return [];
    return resolveGrid(level.tiles, level.grid_width);
  }, [level, resolveGrid]);

  const startPosition = useMemo(
    () => (level ? { x: level.start_y, y: level.start_x } : { x: 0, y: 0 }),
    [level]
  );

  const gridSize = useMemo(
    () => ({
      width: level?.grid_width ?? 0,
      height: level?.grid_height ?? 0,
    }),
    [level]
  );

  const { robotPos, activatedCircuits, commands, setCommands, execute, reset } =
    useGameLogic({ startPosition, gridSize });

  const getAllCircuitPositions = (): Set<string> => {
    const circuits = new Set<string>();
    grid.forEach((row, rIndex) => {
      row.forEach((cell, cIndex) => {
        if (cell.startsWith("circuit")) {
          circuits.add(`${rIndex}-${cIndex}`);
        }
      });
    });
    return circuits;
  };

  const handleExecute = async () => {
    if (playButtonRef.current) {
      playButtonRef.current.classList.add("pressed");
      setTimeout(() => playButtonRef.current?.classList.remove("pressed"), 300);
    }

    setGameStatus("playing");
    setCompletionResult(null);
    const activatedSet = await execute(grid);

    if (activatedSet === null) return;

    const allCircuits = getAllCircuitPositions();
    const allActivated = Array.from(allCircuits).every((pos) =>
      activatedSet.has(pos)
    );

    if (allActivated) {
      setGameStatus("won");
      submitCompletion();
    } else {
      setGameStatus("lost");
    }
  };

  const submitCompletion = async () => {
    if (!level) return;
    setIsSubmitting(true);
    try {
      const apiCommands = commands.map((c) => c.toLowerCase());
      const result = await completeLevel(level.id, apiCommands);
      setCompletionResult(result);
      refreshPlayer();
    } catch {
      // Completion submission failed, but the level was still won locally
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (resetButtonRef.current) {
      resetButtonRef.current.classList.add("pressed");
      setTimeout(() => resetButtonRef.current?.classList.remove("pressed"), 300);
    }
    reset();
    setGameStatus("playing");
    setCompletionResult(null);
  };

  const handleCommandsChange = useCallback(
    (cmds: Command[]) => setCommands(cmds),
    [setCommands]
  );

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading || tilesLoading) {
    return <div className="auth-loading">Loading level...</div>;
  }

  if (error || !level) {
    return (
      <div className="auth-loading">
        <div>
          <p>{error || "Level not found."}</p>
          <button
            className="execute-button"
            style={{ marginTop: 16 }}
            onClick={() => navigate("/")}
          >
            Back to Levels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="top-bar">
        <span className="user-greeting">
          Hi, {player?.nickname} | XP: {player?.xp ?? 0}
        </span>
        <div className="top-bar-actions">
          <button
            className="execute-button"
            onClick={() => navigate("/")}
            style={{ fontSize: 11, padding: "6px 12px" }}
          >
            Levels
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="level-header">
        <h2>{level.name}</h2>
        <p className="level-description">{level.description}</p>
        <div className="level-stats">
          <span
            style={{
              color:
                level.difficulty === "easy"
                  ? "#4caf50"
                  : level.difficulty === "medium"
                    ? "#ff9800"
                    : "#f44336",
            }}
          >
            {level.difficulty}
          </span>
          <span>Max Commands: {level.max_commands}</span>
          <span>Circuits: {level.required_circuits}</span>
        </div>
      </div>

      <div className="game-layout">
        <div className="board-container">
          <Board
            board={grid}
            robotPosition={robotPos}
            activatedCircuits={activatedCircuits}
          />
        </div>

        <div className="controls-container">
          <ProgramGrid
            maxCommands={level.max_commands}
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
          Run <img src={icons.play} width={24} />
        </button>
        <button
          ref={resetButtonRef}
          onClick={handleReset}
          className="execute-button"
        >
          Reset <img src={icons.reset} width={24} />
        </button>
      </div>

      {gameStatus === "won" && (
        <div className="completion-overlay">
          <div className="completion-panel">
            <div className="completion-header">
              <h3>Level Complete!</h3>
              {completionResult && (
                <p className="completion-subtitle">
                  {completionResult.message}
                </p>
              )}
            </div>
            <div className="completion-body">
              {isSubmitting && (
                <div className="completion-submitting">
                  Submitting score...
                </div>
              )}
              {completionResult && (
                <>
                  <div className="completion-stats">
                    <div className="completion-stat-row">
                      <span className="stat-label">Commands used</span>
                      <span className="stat-value">
                        {completionResult.commands_used}
                        {level?.max_commands != null &&
                          ` / ${level.max_commands}`}
                      </span>
                    </div>
                    {completionResult.base_xp != null && (
                      <div className="completion-stat-row">
                        <span className="stat-label">Base XP</span>
                        <span className="stat-value">
                          +{completionResult.base_xp}
                        </span>
                      </div>
                    )}
                    {completionResult.efficiency_bonus != null &&
                      completionResult.efficiency_bonus > 0 && (
                        <div className="completion-stat-row">
                          <span className="stat-label">Efficiency bonus</span>
                          <span className="stat-value">
                            +{completionResult.efficiency_bonus}
                          </span>
                        </div>
                      )}
                    {completionResult.xp_earned != null && (
                      <>
                        <hr className="completion-divider" />
                        <div className="completion-stat-row">
                          <span className="stat-label">Total XP earned</span>
                          <span className="stat-value xp-highlight">
                            +{completionResult.xp_earned}
                          </span>
                        </div>
                      </>
                    )}
                    {completionResult.best_commands != null && (
                      <div className="completion-stat-row">
                        <span className="stat-label">Best score</span>
                        <span className="stat-value">
                          {completionResult.best_commands} commands
                        </span>
                      </div>
                    )}
                    {completionResult.player_total_xp != null && (
                      <div className="completion-stat-row">
                        <span className="stat-label">Your total XP</span>
                        <span className="stat-value">
                          {completionResult.player_total_xp}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="completion-badges">
                    {completionResult.first_completion && (
                      <span className="completion-badge first-clear">
                        First Clear!
                      </span>
                    )}
                    {completionResult.improved && (
                      <span className="completion-badge improved">
                        New Record!
                      </span>
                    )}
                  </div>
                </>
              )}
              <div className="completion-actions">
                <button className="execute-button" onClick={handleReset}>
                  Play Again
                </button>
                <button
                  className="execute-button"
                  onClick={() => navigate("/")}
                >
                  Back to Levels
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {gameStatus === "lost" && (
        <div className="defeat-message">
          Some circuits remain inactive. Try again!
        </div>
      )}
    </div>
  );
}
