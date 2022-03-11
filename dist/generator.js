import { generateMaze } from './utils/generator';
import { generateGrid, GridTypes } from './utils/grid';
import { Renderer } from './utils/renderer';
const width = 10;
const height = 10;
const style = {
    wallColor: '#000000',
    cellColor: '#FFFFFF',
    startColor: '#FF0000',
    endColor: '#00FF00',
    cellSize: 30,
    wallSize: 5,
};
const canvas = document.getElementById('maze-canvas');
canvas.width = style.wallSize + width * (style.cellSize + style.wallSize);
canvas.height = style.wallSize + height * (style.cellSize + style.wallSize);
const maze = generateMaze(generateGrid({ type: GridTypes.Rectangle, width, height }));
const renderer = new Renderer(canvas, maze, style);
renderer.draw();
