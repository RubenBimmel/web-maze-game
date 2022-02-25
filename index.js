/* elements */
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const sourceImage = document.getElementById('source-image');

/* constants */
const scale = 3;
const canvasSize = 1000;
const movementSpeed = .2;
const wallPushSpeed = .1;
const drag = 5;

/* objects */
const speed = { x: 0, y: 0};
const position = { x: .265, y: .925};
const activeKeys = {};
const input = { left: false, right: false, up: false, down: false };

/* variables */
let timestamp = undefined;
let finished = false;

function initialize() {
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  ctx.drawImage(sourceImage, 0, 0, canvasSize, canvasSize);

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
  updateInput(ev.key, true);
};

document.onkeyup = (ev) => {
  updateInput(ev.key, false);
};

function updateInput(key, value) {
  if (value && !!activeKeys[key] || !value && !activeKeys[key]) return;

  activeKeys[key] = value;

  if (key === 'd' || key === 'ArrowRight') input.right = value;
  if (key === 'a' || key === 'ArrowLeft') input.left = value;
  if (key === 's' || key === 'ArrowDown') input.down = value;
  if (key === 'w' || key === 'ArrowUp') input.up = value;
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
  let horizontal = 0;
  let vertical = 0;

  if (input.right) horizontal++;
  if (input.left) horizontal--;
  if (input.down) vertical++;
  if (input.up) vertical--;

  const axisSpeed = horizontal !== 0 && vertical !== 0 ? .7071 * movementSpeed : movementSpeed;

  if (horizontal !== 0) {
    speed.x = horizontal * axisSpeed * deltaTime / 1000;
  }
  if (vertical !== 0) {
    speed.y = vertical * axisSpeed * deltaTime / 1000;
  }
}

function updateSpeedFromMaze(deltaTime) {
  const checks = getMazeData();

  const wallRight = checks.right[3] !== 0;
  const wallLeft = checks.left[3] !== 0;
  const wallDown = checks.down[3] !== 0;
  const wallUp = checks.up[3] !== 0;

  if (wallRight) input.right = false;
  if (wallLeft) input.left = false;
  if (wallDown) input.down = false;
  if (wallUp) input.up = false;

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
  if (finished) return true;
  const checks = getMazeData();

  for (const key in checks) {
    const data = checks[key];

    // check if color is greenish
    if (data[0] < 50 && data[1] > 200 && data[2] < 50) {
      alert('Hooray!');
      return true;
    }
  }
  
  return false;
}

function getMazeData() {
  const x = Math.floor(position.x * canvasSize);
  const y = Math.floor(position.y * canvasSize);
  const offset = 10;
  
  return {
    right: ctx.getImageData(x + offset, y, 1, 1).data,
    left: ctx.getImageData(x - offset, y, 1, 1).data,
    down: ctx.getImageData(x, y + offset, 1, 1).data,
    up: ctx.getImageData(x, y - offset, 1, 1).data,
  }
}

function clamp(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

window.onload = initialize;