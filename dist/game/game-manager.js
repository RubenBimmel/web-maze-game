let canvas;
let ctx;
const sourceImage = document.getElementById('source-image');
const scale = 3;
const movementSpeed = .2;
const wallPushSpeed = .1;
const gestureSpeed = .1;
const dragSpeedLimit = 2.5;
const drag = 5;
const speed = { x: 0, y: 0 };
const position = { x: 0, y: 0 };
const activeKeys = {};
const input = { left: false, right: false, up: false, down: false, dragging: false, horizontal: 0, vertical: 0 };
let timestamp = undefined;
let finished = false;
export function initialize(c, maze) {
    canvas = c;
    ctx = canvas.getContext('2d');
    sourceImage.src = canvas.toDataURL();
    const startCell = maze.cells[maze.start];
    position.x = (startCell.position.x + .5) / maze.settings.width;
    position.y = (startCell.position.y + .5) / maze.settings.height;
    window.requestAnimationFrame(update);
}
function update(t) {
    if (checkFinish()) {
        return;
    }
    const deltaTime = timestamp ? t - timestamp : 0;
    timestamp = t;
    updatePosition(deltaTime);
    window.requestAnimationFrame(update);
}
document.onkeydown = (ev) => {
    updateKeyInput(ev.key, true);
};
document.onkeyup = (ev) => {
    updateKeyInput(ev.key, false);
};
document.addEventListener('pointerdown', (event) => toggleDragInput(event, true));
document.addEventListener('pointermove', (event) => updateDragInput(event));
document.addEventListener('pointerup', (event) => toggleDragInput(event, false));
document.addEventListener('pointercancel', (event) => toggleDragInput(event, false));
function updateKeyInput(key, value) {
    if (value && !!activeKeys[key] || !value && !activeKeys[key])
        return;
    activeKeys[key] = value;
    if (key === 'd' || key === 'ArrowRight')
        input.right = value;
    if (key === 'a' || key === 'ArrowLeft')
        input.left = value;
    if (key === 's' || key === 'ArrowDown')
        input.down = value;
    if (key === 'w' || key === 'ArrowUp')
        input.up = value;
}
function toggleDragInput(event, active) {
    if (active && !!input.dragging || !active && !input.dragging) {
        return;
    }
    event.preventDefault();
    input.horizontal = 0;
    input.vertical = 0;
    input.dragging = active;
}
function updateDragInput(event) {
    if (!input.dragging)
        return;
    event.preventDefault();
    input.horizontal = -event.movementX * gestureSpeed;
    input.vertical = -event.movementY * gestureSpeed;
}
function updatePosition(deltaTime) {
    applyDrag(deltaTime);
    updateSpeedFromInput(deltaTime);
    updateSpeedFromMaze(deltaTime);
    position.x = clamp(position.x + speed.x, 0, 1);
    position.y = clamp(position.y + speed.y, 0, 1);
    sourceImage.style.transform = `scale(${scale}) translate(${(.5 - position.x) * 100}%, ${(.5 - position.y) * 100}%)`;
    sourceImage.style.left = `${position.x * 100}%`;
}
function applyDrag(deltaTime) {
    speed.x *= (1 - drag * deltaTime / 1000);
    speed.y *= (1 - drag * deltaTime / 1000);
}
function updateSpeedFromInput(deltaTime) {
    let horizontal = input.dragging ? input.horizontal : 0;
    let vertical = input.dragging ? input.vertical : 0;
    input.horizontal = 0;
    input.vertical = 0;
    if (input.right)
        horizontal += input.down || input.up ? .7071 : 1;
    if (input.left)
        horizontal -= input.down || input.up ? .7071 : 1;
    if (input.down)
        vertical += input.right || input.left ? .7071 : 1;
    if (input.up)
        vertical -= input.right || input.left ? .7071 : 1;
    const totalSpeed = Math.sqrt(Math.pow(horizontal, 2) + Math.pow(vertical, 2));
    if (totalSpeed > dragSpeedLimit) {
        horizontal /= (totalSpeed / dragSpeedLimit);
        vertical /= (totalSpeed / dragSpeedLimit);
    }
    if (horizontal !== 0) {
        speed.x = horizontal * movementSpeed * deltaTime / 1000;
    }
    if (vertical !== 0) {
        speed.y = vertical * movementSpeed * deltaTime / 1000;
    }
}
function updateSpeedFromMaze(deltaTime) {
    const checks = getMazeData();
    const wallRight = checks.right[0] + checks.right[1] + checks.right[2] < 20;
    const wallLeft = checks.left[0] + checks.left[1] + checks.left[2] < 20;
    const wallDown = checks.down[0] + checks.down[1] + checks.down[2] < 20;
    const wallUp = checks.up[0] + checks.up[1] + checks.up[2] < 20;
    console.log({ wallRight, wallLeft, wallUp, wallDown });
    if (wallRight)
        input.right = false;
    if (wallLeft)
        input.left = false;
    if (wallDown)
        input.down = false;
    if (wallUp)
        input.up = false;
    if (wallRight || wallLeft || wallDown || wallUp)
        input.dragging = false;
    let horizontal = wallRight ? -1 : wallLeft ? 1 : 0;
    let vertical = wallDown ? -1 : wallUp ? 1 : 0;
    const axisSpeed = horizontal !== 0 && vertical !== 0 ? .7071 * wallPushSpeed : wallPushSpeed;
    if (horizontal !== 0) {
        speed.x = horizontal * axisSpeed * deltaTime / 1000;
    }
    if (vertical !== 0) {
        speed.y = vertical * axisSpeed * deltaTime / 1000;
    }
}
function checkFinish() {
    if (finished)
        return true;
    const checks = getMazeData();
    for (const key in checks) {
        const data = checks[key];
        if (data[0] < 50 && data[1] > 200 && data[2] < 50) {
            alert('Hooray!');
            return true;
        }
    }
    return false;
}
function getMazeData() {
    const x = Math.floor(position.x * canvas.width);
    const y = Math.floor(position.y * canvas.height);
    const offset = 10;
    return {
        right: ctx.getImageData(x + offset, y, 1, 1).data,
        left: ctx.getImageData(x - offset, y, 1, 1).data,
        down: ctx.getImageData(x, y + offset, 1, 1).data,
        up: ctx.getImageData(x, y - offset, 1, 1).data,
    };
}
function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
}
