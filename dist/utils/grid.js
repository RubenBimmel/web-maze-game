export var GridTypes;
(function (GridTypes) {
    GridTypes[GridTypes["Rectangle"] = 0] = "Rectangle";
})(GridTypes || (GridTypes = {}));
export function generateGrid(settings) {
    if (isRectangular(settings)) {
        const vertices = [];
        for (let y = 0; y < settings.height; y++) {
            for (let x = 0; x < settings.width; x++) {
                vertices.push({ x, y });
            }
        }
        const cells = vertices.map((position, index) => {
            const neighbours = [];
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
        });
        return { settings, cells };
    }
    throw new Error('Invalid settings');
}
export function isRectangular(settings) {
    return settings.type === GridTypes.Rectangle;
}
