import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import type { AxiosError } from "axios";
import "./AuthPages.css";

interface ValidationErrors {
  [key: string]: string[];
}

export default function CreatePlayerPage() {
  const { createPlayer } = usePlayer();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await createPlayer(nickname);
      navigate("/");
    } catch (err) {
      const axiosError = err as AxiosError<{
        message: string;
        errors?: ValidationErrors;
      }>;
      const data = axiosError.response?.data;
      if (data?.errors) {
        setFieldErrors(data.errors);
      }
      setError(
        data?.message || "Failed to create player. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Player</h2>
        <p className="auth-subtitle">Choose a nickname to start playing</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="nickname">Nickname</label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              minLength={3}
              maxLength={20}
              placeholder="3-20 characters"
              autoComplete="off"
            />
            {fieldErrors.nickname && (
              <span className="field-error">{fieldErrors.nickname[0]}</span>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Start Playing"}
          </button>
        </form>

        <p className="auth-link">
          <button className="link-button" onClick={handleLogout}>
            Logout
          </button>
        </p>
      </div>
    </div>
  );
}
