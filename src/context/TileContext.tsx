import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { Tile } from "../types/tile";
import type { ApiLevelTile } from "../types/level";
import { getTiles } from "../services/tile";
import { tileMap as localTileMap } from "../game/tileMap";

interface TileContextType {
  tiles: Tile[];
  tileMap: Record<string, string>;
  isLoading: boolean;
  resolveGrid: (flatTiles: ApiLevelTile[], gridWidth: number) => string[][];
}

const TileContext = createContext<TileContextType | null>(null);

export function TileProvider({ children }: { children: ReactNode }) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [tileMap, setTileMap] = useState<Record<string, string>>(localTileMap);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTiles()
      .then((data) => {
        setTiles(data);

        const apiMap: Record<string, string> = {};
        for (const tile of data) {
          apiMap[tile.type] = tile.image_url;
        }

        setTileMap({ ...localTileMap, ...apiMap });
      })
      .catch(() => {
        // Keep using local tile map on failure
      })
      .finally(() => setIsLoading(false));
  }, []);

  const resolveGrid = useCallback(
    (flatTiles: ApiLevelTile[], gridWidth: number): string[][] => {
      const grid: string[][] = [];
      for (let i = 0; i < flatTiles.length; i += gridWidth) {
        const row = flatTiles.slice(i, i + gridWidth).map((t) => t.type);
        grid.push(row);
      }
      return grid;
    },
    []
  );

  return (
    <TileContext.Provider value={{ tiles, tileMap, isLoading, resolveGrid }}>
      {children}
    </TileContext.Provider>
  );
}

export function useTiles(): TileContextType {
  const context = useContext(TileContext);
  if (!context) {
    throw new Error("useTiles must be used within a TileProvider");
  }
  return context;
}
