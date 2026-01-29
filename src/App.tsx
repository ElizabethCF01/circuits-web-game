import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreatePlayerPage from "./pages/CreatePlayerPage";
import LevelsPage from "./pages/LevelsPage";
import PlayPage from "./pages/PlayPage";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/create-player"
        element={
          <ProtectedRoute>
            <CreatePlayerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute requirePlayer>
            <LevelsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/play/:id"
        element={
          <ProtectedRoute requirePlayer>
            <PlayPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
