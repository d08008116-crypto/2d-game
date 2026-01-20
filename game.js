alert("GAME JS LOADED");
ctx.fillStyle = "red";
ctx.fillRect(...)
// ===== CANVAS =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ===== INPUT =====
const keys = { left: false, right: false, jump: false };

// кнопки (телефон)
left.ontouchstart = () => keys.left = true;
left.ontouchend   = () => keys.left = false;

right.ontouchstart = () => keys.right = true;
right.ontouchend   = () => keys.right = false;

jump.ontouchstart = () => keys.jump = true;
jump.ontouchend   = () => keys.jump = false;

// клавиатура (ПК)
window.addEventListener("keydown", e => {
  if (e.key === "a" || e.key === "ArrowLeft") keys.left = true;
  if (e.key === "d" || e.key === "ArrowRight") keys.right = true;
  if (e.key === " " || e.key === "ArrowUp") keys.jump = true;
});

window.addEventListener("keyup", e => {
  if (e.key === "a" || e.key === "ArrowLeft") keys.left = false;
  if (e.key === "d" || e.key === "ArrowRight") keys.right = false;
  if (e.key === " " || e.key === "ArrowUp") keys.jump = false;
});

// ===== PLAYER =====
const player = {
  x: 100,
  y: 100,
  w: 40,
  h: 40,
  vy: 0,
  onGround: false
};

// ===== PHYSICS =====
const gravity = 1;
const jumpPower = -18;
const speed = 6;
const groundHeight = 100;

// затяжной прыжок
const EXTRA_JUMP_FORCE = -0.8; // сила удержания
const MAX_JUMP_FRAMES = 12;    // сколько кадров можно тянуть прыжок

let jumpFrames = 0;
let isJumping = false;

// ===== UPDATE =====
function update() {
  if (keys.left)  player.x -= speed;
  if (keys.right) player.x += speed;

  // старт прыжка
if (keys.jump && player.onGround) {
  player.vy = jumpPower;
  player.onGround = false;
  isJumping = true;
  jumpFrames = 0;
}

// удержание прыжка
if (keys.jump && isJumping && jumpFrames < MAX_JUMP_FRAMES) {
  player.vy += EXTRA_JUMP_FORCE;
  jumpFrames++;
}

// если отпустил кнопку — прекращаем тянуть вверх
if (!keys.jump) {
  isJumping = false;
}

  const groundY = canvas.height - groundHeight;
  if (player.y + player.h >= groundY) {
    player.y = groundY - player.h;
    player.vy = 0;
    player.onGround = true;
    isJumping = false;
  }
}

// ===== DRAW =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // фон
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // земля
  ctx.fillStyle = "#555";
  ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

  // игрок
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

// ===== LOOP =====
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();