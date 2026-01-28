import api from "./api";
import type { Player, PlayerProgress } from "../types/player";

export async function getPlayer(): Promise<Player> {
  const response = await api.get<{ player: Player }>("/player");
  return response.data.player;
}

export async function createPlayer(nickname: string): Promise<Player> {
  const response = await api.post<{ message: string; player: Player }>(
    "/player",
    { nickname }
  );
  return response.data.player;
}

export async function deletePlayer(): Promise<void> {
  await api.delete("/player");
}

export async function getPlayerProgress(): Promise<PlayerProgress> {
  const response = await api.get<PlayerProgress>("/player/progress");
  return response.data;
}
