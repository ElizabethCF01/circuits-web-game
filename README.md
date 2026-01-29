# Circuits Programming Game

This is a puzzle game where you program a robot to activate circuits on a grid. It's kind of like those logic games where you have to figure out the right sequence of moves.

## About

The game has a robot that moves around a grid board with different tiles. Your goal is to program the robot's movements so it activates all the circuit tiles on each level. You drag and drop commands (up, down, left, right) into a program grid and then execute them to see if your solution works.

### Game Elements

**The Robot:**

![Robot](src/assets/robot/robot-idle.gif)

The robot starts at a specific position and follows your programmed commands.

**Tiles:**

| Circuit Tile                                | Block Tile                              | Obstacle Tile                                 |
| ------------------------------------------- | --------------------------------------- | --------------------------------------------- |
| ![Circuit](src/assets/tiles/circuit-01.png) | ![Block](src/assets/tiles/block-01.png) | ![Obstacle](src/assets/tiles/obstacle-01.png) |

- **Circuit tiles** need to be activated (walk over them)
- **Block tiles** are normal walkable spaces
- **Obstacle tiles** can't be walked through

## How to Run

First install dependencies:

```bash
npm install
```

Then start the dev server:

```bash
npm run dev
```

The game should open in your browser at `http://localhost:5173`

## How to Play

1. Look at the level and figure out which circuits need to be activated
2. Drag movement commands from the command panel into the program grid
3. Click "Play" to execute your program
4. If all circuits get activated, you win and can move to the next level
5. Use "Reset" if you need to start over

## Tech Stack

Built with React, TypeScript and Vite. Pretty straightforward setup, nothing too fancy.
