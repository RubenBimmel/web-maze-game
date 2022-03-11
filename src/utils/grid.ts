export enum GridTypes {
  Rectangle
}

export interface Grid {
  settings: GridSettings;
  cells: GridCell[];
}

export type GridSettings = RectangleGridSettings;

export interface RectangleGridSettings {
  type: GridTypes.Rectangle;
  width: number;
  height: number;
  maxBranchDistance: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface GridCell {
  position: Position;
  neighbours: number[];
}

export function generateGrid(settings: GridSettings): Grid {
  if (isRectangular(settings)) {
    const vertices: Position[] = [];

    for (let y = 0; y < settings.height; y++) {
      for (let x = 0; x < settings.width; x++) {
        vertices.push({ x, y });
      }
    }

    const cells = vertices.map((position, index) => {
      const neighbours: number[] = [];
      
      if (position.x > 0) {
        neighbours.push(index - 1);
      }
      if (position.y > 0) {
        neighbours.push(index - settings.width);
      }
      if (position.x < settings.width - 1) {
        neighbours.push(index + 1);
      }
      if (position.y < settings.height - 1) {
        neighbours.push(index + settings.width);
      }

      return { position, neighbours };
    })

    return { settings, cells };
  }

  throw new Error('Invalid settings');
}

export function isRectangular(settings: GridSettings): settings is RectangleGridSettings {
  return settings.type === GridTypes.Rectangle;
}