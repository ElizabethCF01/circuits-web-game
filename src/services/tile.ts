import api from "./api";
import type { Tile } from "../types/tile";

export async function getTiles(): Promise<Tile[]> {
  const response = await api.get<{ tiles: Tile[] }>("/tiles");
  return response.data.tiles;
}
