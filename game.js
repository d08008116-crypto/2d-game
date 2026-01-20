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
const speed = 6;

// затяжной прыжок
const JUMP_POWER = -18;
const EXTRA_JUMP_FORCE = -0.8;
const MAX_JUMP_FRAMES = 12;

let isJumping = false;
let jumpFrames = 0;

// ===== LEVEL =====
const groundHeight = 100;

const platforms = [
  { x: 200, y: 0, w: 120, h: 20 },
  { x: 450, y: 0, w: 120, h: 20 },
  { x: 700, y: 0, w: 120, h: 20 },
  { x: 950, y: 0, w: 120, h: 20 }
];

// ===== UPDATE =====
function update() {
  // движение
  if (keys.left)  player.x -= speed;
  if (keys.right) player.x += speed;

  // старт прыжка
  if (keys.jump && player.onGround) {
    player.vy = JUMP_POWER;
    player.onGround = false;
    isJumping = true;
    jumpFrames = 0;
  }

  // удержание прыжка
  if (keys.jump && isJumping && jumpFrames < MAX_JUMP_FRAMES) {
    player.vy += EXTRA_JUMP_FORCE;
    jumpFrames++;
  }

  // если кнопку отпустил — перестаём тянуть
  if (!keys.jump) {
    isJumping = false;
  }

  // гравитация
  player.vy += gravity;
  player.y += player.vy;

  // земля
  const groundY = canvas.height - groundHeight;
  if (player.y + player.h >= groundY) {
    player.y = groundY - player.h;
    player.vy = 0;
    player.onGround = true;
    isJumping = false;
  }

  // платформы (позиции обновляются относительно экрана)
  player.onGround = false;
  platforms.forEach(p => {
    p.y = groundY - 120 - (platforms.indexOf(p) % 2) * 80;

    if (
      player.x < p.x + p.w &&
      player.x + player.w > p.x &&
      player.y + player.h <= p.y + 10 &&
      player.y + player.h + player.vy >= p.y
    ) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.onGround = true;
      isJumping = false;
    }
  });
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

  // платформы
  ctx.fillStyle = "#777";
  platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.w, p.h);
  });

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