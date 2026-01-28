import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { Player } from "../types/player";
import * as playerService from "../services/player";
import { useAuth } from "./AuthContext";

interface PlayerContextType {
  player: Player | null;
  isLoading: boolean;
  hasPlayer: boolean;
  createPlayer: (nickname: string) => Promise<void>;
  refreshPlayer: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlayer = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await playerService.getPlayer();
      setPlayer(data);
    } catch {
      setPlayer(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlayer();
    } else {
      setPlayer(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchPlayer]);

  const createPlayer = useCallback(async (nickname: string) => {
    const data = await playerService.createPlayer(nickname);
    setPlayer(data);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        player,
        isLoading,
        hasPlayer: !!player,
        createPlayer,
        refreshPlayer: fetchPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextType {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
