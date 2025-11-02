import { useState } from "react";
import type { Level } from "../types";
import levelsData from "../data/levels.json";

export const useLevelManager = () => {
  const [levels] = useState<Level[]>(levelsData as Level[]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  const currentLevel = levels[currentLevelIndex];

  const nextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    }
  };

  const previousLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(currentLevelIndex - 1);
    }
  };

  const selectLevel = (index: number) => {
    if (index >= 0 && index < levels.length) {
      setCurrentLevelIndex(index);
    }
  };

  const completeCurrentLevel = () => {
    if (!completedLevels.includes(currentLevel.id)) {
      setCompletedLevels([...completedLevels, currentLevel.id]);
    }
  };

  const hasNextLevel = currentLevelIndex < levels.length - 1;
  const hasPreviousLevel = currentLevelIndex > 0;
  const isLastLevel = currentLevelIndex === levels.length - 1;
  const isLevelCompleted = completedLevels.includes(currentLevel.id);

  return {
    currentLevel,
    currentLevelIndex,
    levels,
    completedLevels,
    nextLevel,
    previousLevel,
    selectLevel,
    completeCurrentLevel,
    hasNextLevel,
    hasPreviousLevel,
    isLastLevel,
    isLevelCompleted,
  };
};
