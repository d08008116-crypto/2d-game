// ===== CANVAS =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== INPUT =====
const keys = { left: false, right: false, jump: false };

left.ontouchstart = () => keys.left = true;
left.ontouchend = () => keys.left = false;

right.ontouchstart = () => keys.right = true;
right.ontouchend = () => keys.right = false;

jump.ontouchstart = () => keys.jump = true;
jump.ontouchend = () => keys.jump = false;

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

// ===== LEVEL =====
const groundY = canvas.height - 100;

const platforms = [
  { x: 300, y: groundY - 150, w: 140, h: 20 },
  { x: 600, y: groundY - 250, w: 140, h: 20 }
];

// ===== UPDATE =====
function update() {
  // движение
  if (keys.left) player.x -= speed;
  if (keys.right) player.x += speed;

  // прыжок
  if (keys.jump && player.onGround) {
    player.vy = jumpPower;
    player.onGround = false;
  }

  // гравитация
  player.vy += gravity;
  player.y += player.vy;

  // считаем, что в воздухе
  player.onGround = false;

  // земля
  if (player.y + player.h >= groundY) {
    player.y = groundY - player.h;
    player.vy = 0;
    player.onGround = true;
  }

  // платформы
  for (let p of platforms) {
    if (
      player.x < p.x + p.w &&
      player.x + player.w > p.x &&
      player.y + player.h <= p.y + 10 &&
      player.y + player.h + player.vy >= p.y
    ) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.onGround = true;
    }
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
  ctx.fillRect(0, groundY, canvas.width, 100);

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