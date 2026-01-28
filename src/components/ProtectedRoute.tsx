import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
import type { ReactNode } from "react";

export default function ProtectedRoute({
  children,
  requirePlayer = false,
}: {
  children: ReactNode;
  requirePlayer?: boolean;
}) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasPlayer, isLoading: playerLoading } = usePlayer();

  if (authLoading || playerLoading) {
    return <div className="auth-loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requirePlayer && !hasPlayer) {
    return <Navigate to="/create-player" replace />;
  }

  return <>{children}</>;
}
