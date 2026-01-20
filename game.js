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

// ===== UPDATE =====
function update() {
  if (keys.left)  player.x -= speed;
  if (keys.right) player.x += speed;

  if (keys.jump && player.onGround) {
    player.vy = jumpPower;
    player.onGround = false;
  }

  player.vy += gravity;
  player.y += player.vy;

  const groundY = canvas.height - groundHeight;
  if (player.y + player.h >= groundY) {
    player.y = groundY - player.h;
    player.vy = 0;
    player.onGround = true;
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