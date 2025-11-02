interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoPanel({ isOpen, onClose }: InfoPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="info-overlay" onClick={onClose}>
      <div className="info-panel" onClick={(e) => e.stopPropagation()}>
        <div className="info-header">
          <h3>How to Play</h3>
          <button className="info-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="info-content">
          <section>
            <h4>Objective</h4>
            <p>
              Guide the robot to activate all circuit tiles on the board by
              programming its movements.
            </p>
          </section>

          <section>
            <h4>Commands</h4>
            <ul>
              <li>
                <strong>UP/DOWN/LEFT/RIGHT:</strong> Move the robot in the
                specified direction
              </li>
              <li>
                <strong>ACTIVATE CIRCUIT:</strong> Activate the circuit at the
                robot's current position
              </li>
            </ul>
          </section>

          <section>
            <h4>How to Program</h4>
            <ol>
              <li>Drag command icons from the palette to the program grid</li>
              <li>Arrange commands in the order you want them to execute</li>
              <li>Click "Play" to run your program</li>
              <li>The robot will execute each command in sequence</li>
            </ol>
          </section>

          <section>
            <h4>Winning</h4>
            <p>
              You win when all circuit tiles are activated. Each level has a
              maximum number of commands you can use, so plan efficiently!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
