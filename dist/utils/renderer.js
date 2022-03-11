import { isRectangular } from './grid.js';
export class Renderer {
    constructor(canvas, maze, style) {
        this.canvas = canvas;
        this.maze = maze;
        this.style = style;
        this.ctx = canvas.getContext('2d');
    }
    draw() {
        if (isRectangular(this.maze.settings)) {
            this.drawRectangularMaze();
            return;
        }
        throw new Error('unknown grid type');
    }
    drawRectangularMaze() {
        this.ctx.fillStyle = this.style.wallColor;
        this.ctx.fillRect(0, 0, this.style.wallSize + (this.style.cellSize + this.style.wallSize) * this.maze.settings.width, this.style.wallSize + (this.style.cellSize + this.style.wallSize) * this.maze.settings.height);
        for (let index = 0; index < this.maze.cells.length; index++) {
            const cell = this.maze.cells[index];
            for (const connection of cell.connections) {
                this.ctx.fillStyle = this.style.cellColor;
                if (connection < index)
                    continue;
                this.drawConnection(cell.position, this.maze.cells[connection].position);
            }
        }
        this.drawDoor(this.maze.cells[this.maze.start].position, this.style.startColor);
        this.drawDoor(this.maze.cells[this.maze.end].position, this.style.endColor);
    }
    drawCell(position) {
        this.ctx.fillStyle = this.style.cellColor;
        this.ctx.fillRect(this.style.wallSize + (this.style.wallSize + this.style.cellSize) * position.x, this.style.wallSize + (this.style.wallSize + this.style.cellSize) * position.y, this.style.cellSize, this.style.cellSize);
    }
    drawConnection(p1, p2) {
        this.ctx.fillStyle = this.style.cellColor;
        const width = 1 + p2.x - p1.x;
        const height = 1 + p2.y - p1.y;
        this.ctx.fillRect(this.style.wallSize + (this.style.wallSize + this.style.cellSize) * p1.x, this.style.wallSize + (this.style.wallSize + this.style.cellSize) * p1.y, this.style.cellSize * width + this.style.wallSize * (width - 1), this.style.cellSize * height + this.style.wallSize * (height - 1));
    }
    drawDoor(position, color) {
        this.ctx.fillStyle = color;
        if (position.x === 0) {
            this.ctx.fillRect(0, this.style.wallSize + (this.style.wallSize + this.style.cellSize) * position.y, this.style.wallSize, this.style.cellSize);
        }
        else if (position.y === 0) {
            this.ctx.fillRect(this.style.wallSize + (this.style.wallSize + this.style.cellSize) * position.x, 0, this.style.cellSize, this.style.wallSize);
        }
        else if (position.x === this.maze.settings.width - 1) {
            this.ctx.fillRect((this.style.wallSize + this.style.cellSize) * this.maze.settings.width, this.style.wallSize + (this.style.wallSize + this.style.cellSize) * position.y, this.style.wallSize, this.style.cellSize);
        }
        else if (position.y === this.maze.settings.height - 1) {
            this.ctx.fillRect(this.style.wallSize + (this.style.wallSize + this.style.cellSize) * position.x, (this.style.wallSize + this.style.cellSize) * this.maze.settings.height, this.style.cellSize, this.style.wallSize);
        }
        else {
            throw new Error('Door is not in a valid position');
        }
    }
}
