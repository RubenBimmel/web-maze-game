import { generateMaze } from './utils/generator.js';
import { generateGrid, GridTypes } from './utils/grid.js';
import { Renderer } from './utils/renderer.js';
import { initialize } from './game/game-manager.js';
const width = 10;
const height = 10;
const style = {
    wallColor: '#000000',
    cellColor: '#FFFFFF',
    startColor: '#FF0000',
    endColor: '#00FF00',
    cellSize: 100,
    wallSize: 15,
};
const canvas = document.createElement('canvas');
canvas.width = style.wallSize + width * (style.cellSize + style.wallSize);
canvas.height = style.wallSize + height * (style.cellSize + style.wallSize);
const maze = generateMaze(generateGrid({ type: GridTypes.Rectangle, width, height }));
const renderer = new Renderer(canvas, maze, style);
renderer.draw();
initialize(canvas, maze);
