import type { Command } from "../types";
import { controls } from "../assets/images";
import "./CommandPanel.css";

interface CommandItem {
  command: Command;
  icon: string;
}

export default function CommandPanel() {
  const commands: CommandItem[] = [
    { command: "UP", icon: controls.up },
    { command: "LEFT", icon: controls.left },
    { command: "DOWN", icon: controls.down },
    { command: "RIGHT", icon: controls.right },
    { command: "ACTIVATE_CIRCUIT", icon: controls.activeCircuit },
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
