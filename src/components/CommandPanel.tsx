import type { Command } from "../types";
import "./CommandPanel.css";

interface CommandItem {
  command: Command;
  icon: string;
}

export default function CommandPanel() {
  const commands: CommandItem[] = [
    { command: "UP", icon: "/src/assets/controls/up.svg" },
    { command: "LEFT", icon: "/src/assets/controls/left.svg" },
    { command: "DOWN", icon: "/src/assets/controls/down.svg" },
    { command: "RIGHT", icon: "/src/assets/controls/right.svg" },
    { command: "ACTIVATE_CIRCUIT", icon: "/src/assets/controls/active-circuit.svg" },
  ];

  const handleDragStart = (e: React.DragEvent, command: Command) => {
    e.dataTransfer.setData("command", command);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="command-panel">
      <div className="command-list">
        {commands.map(({ command, icon }) => (
          <div
            key={command}
            className="command-item"
            draggable
            onDragStart={(e) => handleDragStart(e, command)}
          >
            <img src={icon} alt={command} />
          </div>
        ))}
      </div>
    </div>
  );
}
