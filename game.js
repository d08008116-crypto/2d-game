const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ---------- CANVAS RESIZE (важно для телефона) ----------
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ---------- INPUT ----------
let keys = { left: false, right: false, jump: false };

// тач (телефон)
document.getElementById("left").ontouchstart = () => keys.left = true;
document.getElementById("left").ontouchend = () => keys.left = false;

document.getElementById("right").ontouchstart = () => keys.right = true;
document.getElementById("right").ontouchend = () => keys.right = false;

document.getElementById("jump").ontouchstart = () => keys.jump = true;
document.getElementById("jump").ontouchend = () => keys.jump = false;

// клавиатура (ПК)
window.addEventListener("keydown", e => {
  if (e.key === "a" || e.key === "ArrowLeft") keys.left = true;
  if (e.key === "d" || e.key === "ArrowRight") keys.right = true;
  if (e.key === "w" || e.key === " " || e.key === "ArrowUp") keys.jump = true;
});

window.addEventListener("keyup", e => {
  if (e.key === "a" || e.key === "ArrowLeft") keys.left = false;
  if (e.key === "d" || e.key === "ArrowRight") keys.right = false;
  if (e.key === "w" || e.key === " " || e.key === "ArrowUp") keys.jump = false;
});

// ---------- PLAYER ----------
const player = {
  x: 100,
  y: 100,
  w: 40,
  h: 40,
  vy: 0,
  onGround: false
};

// ---------- PHYSICS ----------
const gravity = 0.8;

// затяжной прыжок
const JUMP_FORCE = -15;
const EXTRA_JUMP_FORCE = -0.6;
const MAX_JUMP_TIME = 15;

let isJumping = false;
let jumpTime = 0;

// ---------- LEVEL ----------
const platforms = [
  { x: 0, y: 0, w: 3000, h: 40 },                 // потолок
  { x: 0, y: 0, w: 40, h: 2000 },                 // левая стена
  { x: 0, y: 0, w: 3000, h: 40 },                 // защита сверху

  { x: 0, y: 600, w: 3000, h: 80 },               // земля
  { x: 300, y: 500, w: 150, h: 20 },
  { x: 600, y: 420, w: 150, h: 20 },
  { x: 900, y: 350, w: 150, h: 20 },
  { x: 1200, y: 450, w: 150, h: 20 },
  { x: 1500, y: 380, w: 150, h: 20 }
];

// ---------- UPDATE ----------
function update() {
  // движение
  if (keys.left) player.x -= 5;
  if (keys.right) player.x += 5;

  // начало прыжка
  if (keys.jump && player.onGround) {
    player.vy = JUMP_FORCE;
    player.onGround = false;
    isJumping = true;
    jumpTime = 0;
  }

  // затяжной прыжок
  if (keys.jump && isJumping && jumpTime < MAX_JUMP_TIME) {
    player.vy += EXTRA_JUMP_FORCE;
    jumpTime++;
  }

  // обрыв прыжка
  if (!keys.jump) {
    isJumping = false;
  }

  // гравитация
  player.vy += gravity;
  player.y += player.vy;

  // столкновения
  player.onGround = false;
  for (let p of platforms) {
    if (
      player.x < p.x + p.w &&
      player.x + player.w > p.x &&
      player.y + player.h < p.y + p.h &&
      player.y + player.h + player.vy >= p.y
    ) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.onGround = true;
      isJumping = false;
    }
  }

  // рестарт при падении
  if (player.y > canvas.height + 500) {
    player.x = 100;
    player.y = 100;
    player.vy = 0;
    isJumping = false;
  }
}

// ---------- DRAW ----------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // камера (не уходит в минус)
  const camX = Math.max(
    0,
    player.x - canvas.width / 2 + player.w / 2
  );

  ctx.save();
  ctx.translate(-camX, 0);

  // игрок
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // платформы
  ctx.fillStyle = "gray";
  platforms.forEach(p =>
    ctx.fillRect(p.x, p.y, p.w, p.h)
  );

  ctx.restore();
}

// ---------- LOOP ----------
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();