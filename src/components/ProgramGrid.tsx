import { useState, useEffect } from "react";
import type { Command } from "../types";
import CommandPanel from "./CommandPanel";
import "./ProgramGrid.css";

interface ProgramGridProps {
  maxCommands: number;
  onCommandsChange: (commands: Command[]) => void;
}

export default function ProgramGrid({
  maxCommands,
  onCommandsChange,
}: ProgramGridProps) {
  const [gridCommands, setGridCommands] = useState<(Command | null)[]>(
    Array(maxCommands).fill(null)
  );

  useEffect(() => {
    setGridCommands(Array(maxCommands).fill(null));
    onCommandsChange([]);
  }, [maxCommands, onCommandsChange]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const command = e.dataTransfer.getData("command") as Command;

    if (command) {
      const newCommands = [...gridCommands];

      // Find the first empty slot from the beginning
      const firstEmptyIndex = newCommands.findIndex((cmd) => cmd === null);

      const targetIndex =
        firstEmptyIndex !== -1 && firstEmptyIndex < index
          ? firstEmptyIndex
          : index;

      newCommands[targetIndex] = command;
      setGridCommands(newCommands);

      const validCommands = newCommands.filter(
        (cmd): cmd is Command => cmd !== null
      );
      onCommandsChange(validCommands);
    }
  };

  const handleRemoveCommand = (index: number) => {
    const newCommands = [...gridCommands];
    newCommands[index] = null;
    setGridCommands(newCommands);

    const validCommands = newCommands.filter(
      (cmd): cmd is Command => cmd !== null
    );
    onCommandsChange(validCommands);
  };

  const getCommandIcon = (command: Command): string => {
    const iconMap: Record<Command, string> = {
      UP: "/src/assets/controls/up.svg",
      DOWN: "/src/assets/controls/down.svg",
      LEFT: "/src/assets/controls/left.svg",
      RIGHT: "/src/assets/controls/right.svg",
      ACTIVATE_CIRCUIT: "/src/assets/controls/active-circuit.svg",
    };
    return iconMap[command];
  };

  return (
    <div className="program-grid-container">
      <div className="program-grid">
        {gridCommands.map((command, index) => (
          <div
            key={index}
            className={`grid-slot ${command ? "filled" : "empty"}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            {command ? (
              <div className="command-in-grid">
                <img src={getCommandIcon(command)} alt={command} />
                <button
                  className="remove-button"
                  onClick={() => handleRemoveCommand(index)}
                  title="Remove command"
                >
                  ×
                </button>
              </div>
            ) : (
              <span className="slot-number">{index + 1}</span>
            )}
          </div>
        ))}
      </div>
      <CommandPanel />
    </div>
  );
}
