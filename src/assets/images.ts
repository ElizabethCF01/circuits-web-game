// Icons
import infoIcon from './icons/info.svg';
import playIcon from './icons/play.svg';
import resetIcon from './icons/reset.svg';
import nextIcon from './icons/next.svg';

// Robot
import robotImage from './robot/robot.png';
import robotIdle from './robot/robot-idle.gif';
import robotWalk from './robot/robot-walk.gif';

// Tiles
import block01 from './tiles/block-01.png';
import block02 from './tiles/block-02.png';
import obstacle01 from './tiles/obstacle-01.png';
import circuit01 from './tiles/circuit-01.png';
import circuit02 from './tiles/circuit-02.png';

// Controls
import downControl from './controls/down.svg';
import upControl from './controls/up.svg';
import leftControl from './controls/left.svg';
import rightControl from './controls/right.svg';
import activeCircuitControl from './controls/active-circuit.svg';

export const icons = {
  info: infoIcon,
  play: playIcon,
  reset: resetIcon,
  next: nextIcon,
};

export const robot = {
  image: robotImage,
  idle: robotIdle,
  walk: robotWalk,
};

export const tiles = {
  block01,
  block02,
  obstacle01,
  circuit01,
  circuit02,
};

export const controls = {
  down: downControl,
  up: upControl,
  left: leftControl,
  right: rightControl,
  activeCircuit: activeCircuitControl,
};
