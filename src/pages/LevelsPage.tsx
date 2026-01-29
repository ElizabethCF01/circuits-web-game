import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
import { getLevels } from "../services/level";
import type { ApiLevelSummary } from "../types/level";
import { icons } from "../assets/images";
import "./LevelsPage.css";

export default function LevelsPage() {
  const { logout } = useAuth();
  const { player } = usePlayer();
  const navigate = useNavigate();

  const [levels, setLevels] = useState<ApiLevelSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [difficulty, setDifficulty] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError("");

    const params: Record<string, string | number> = { page };
    if (difficulty) params.difficulty = difficulty;

    getLevels(params)
      .then((data) => {
        setLevels(data.levels);
        setLastPage(data.pagination.last_page);
      })
      .catch(() => {
        setError("Failed to load levels.");
      })
      .finally(() => setIsLoading(false));
  }, [page, difficulty]);

  const handleLogout = async () => {
    await logout();
  };

  const difficultyColor = (d: string) => {
    if (d === "easy") return "#4caf50";
    if (d === "medium") return "#ff9800";
    return "#f44336";
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <span className="user-greeting">
          Hi, {player?.nickname} | XP: {player?.xp ?? 0}
        </span>
        <div className="top-bar-actions">
          <button
            className="info-button"
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            title="How to Play"
          >
            <img src={icons.info} alt="Info" width={32} height={32} />
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="levels-header">
        <h2>Select a Level</h2>
        <div className="levels-filters">
          <button
            className={`filter-btn ${difficulty === "" ? "active" : ""}`}
            onClick={() => { setDifficulty(""); setPage(1); }}
          >
            All
          </button>
          <button
            className={`filter-btn ${difficulty === "easy" ? "active" : ""}`}
            onClick={() => { setDifficulty("easy"); setPage(1); }}
          >
            Easy
          </button>
          <button
            className={`filter-btn ${difficulty === "medium" ? "active" : ""}`}
            onClick={() => { setDifficulty("medium"); setPage(1); }}
          >
            Medium
          </button>
          <button
            className={`filter-btn ${difficulty === "hard" ? "active" : ""}`}
            onClick={() => { setDifficulty("hard"); setPage(1); }}
          >
            Hard
          </button>
        </div>
      </div>

      {isLoading && <p className="levels-status">Loading levels...</p>}
      {error && <p className="levels-status levels-error">{error}</p>}

      {!isLoading && !error && levels.length === 0 && (
        <p className="levels-status">No levels found.</p>
      )}

      {!isLoading && levels.length > 0 && (
        <>
          <div className="levels-grid">
            {levels.map((level) => (
              <button
                key={level.id}
                className="level-card"
                onClick={() => navigate(`/play/${level.id}`)}
              >
                <h3 className="level-card-name">{level.name}</h3>
                <p className="level-card-desc">{level.description}</p>
                <div className="level-card-meta">
                  <span
                    className="level-card-difficulty"
                    style={{ color: difficultyColor(level.difficulty) }}
                  >
                    {level.difficulty}
                  </span>
                  <span>
                    {level.grid_width}x{level.grid_height}
                  </span>
                  <span>{level.required_circuits} circuits</span>
                </div>
              </button>
            ))}
          </div>

          {lastPage > 1 && (
            <div className="levels-pagination">
              <button
                className="page-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>
              <span className="page-info">
                {page} / {lastPage}
              </span>
              <button
                className="page-btn"
                disabled={page >= lastPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {isInfoOpen && (
        <div className="info-overlay" onClick={() => setIsInfoOpen(false)}>
          <div className="info-panel" onClick={(e) => e.stopPropagation()}>
            <div className="info-header">
              <h3>How to Play</h3>
              <button className="info-close" onClick={() => setIsInfoOpen(false)}>
                x
              </button>
            </div>
            <div className="info-content">
              <p>Select a level to start playing. Use commands to guide the robot and activate all circuits!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
