import { GridCell, Grid, GridSettings, isRectangular } from './grid.js';

export interface Maze {
  settings: GridSettings;
  cells: MazeCell[];
  start: number;
  end: number;
}

interface MazeCell extends GridCell {
  connections: number[];
  distance: number;
}

export function generateMaze(grid: Grid): Maze {
  const start = getRandomStartPosition(grid.settings);
  const cells = generateMazeCells(grid, start);
  const end = getEndCell(cells, grid.settings);

  return {
    settings: grid.settings,
    cells,
    start,
    end,
  }
}

function generateMazeCells(grid: Grid, start: number) {
  const visitedCells = [start];
  const cells: MazeCell[] = grid.cells.map((cell) => ({ ...cell, connections: [], distance: 0 }));
  let currentIndex = start;

  while (visitedCells.length < cells.length) {
    const availableNeighbours = cells[currentIndex].neighbours.filter((n) => visitedCells.indexOf(n) === -1);

    if (availableNeighbours.length === 0) {
      currentIndex = visitedCells[visitedCells.indexOf(currentIndex) - 1];
      continue;
    }

    const nextIndex = availableNeighbours[Math.floor(Math.random() * availableNeighbours.length)];

    cells[currentIndex].connections.push(nextIndex);
    cells[nextIndex].connections.push(currentIndex);
    cells[nextIndex].distance = cells[currentIndex].distance + 1;

    visitedCells.push(nextIndex);
    currentIndex = nextIndex;
  }
  
  return cells;
}

function getEndCell(cells: MazeCell[], settings: GridSettings) {
  let furthestCell = 0;

  for(let i = 0; i < cells.length; i++) {
    if (isValidEndCell(cells[i], settings) && cells[i].distance > cells[furthestCell].distance) {
      furthestCell = i;
    }
  }
  
  return furthestCell;
}

function isValidEndCell(cell: MazeCell, settings: GridSettings) {
  if (isRectangular(settings)) {
    return cell.neighbours.length < 4 && cell.connections.length === 1;
  }

  throw new Error('unknown grid type');
}

function getRandomStartPosition(settings: GridSettings): number {
  if (isRectangular(settings)) {
    const sides = ['top', 'right', 'bottom', 'left'];
    const side = sides[Math.floor(Math.random() * 4)];

    if (side === 'top' || side === 'bottom') {
      const x = Math.floor(Math.random() * settings.width);
      const y = side === 'top' ? 0 : settings.height - 1;
      
      return x + y * settings.width;
    } else {
      const x = side === 'left' ? 0 : settings.width - 1;
      const y = Math.floor(Math.random() * settings.height);

      return x + y * settings.width;
    }
  }

  throw new Error('unknown grid type');
}