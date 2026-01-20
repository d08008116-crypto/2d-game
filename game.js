const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let keys = { left: false, right: false, jump: false };

document.getElementById("left").ontouchstart = () => keys.left = true;
document.getElementById("left").ontouchend = () => keys.left = false;

document.getElementById("right").ontouchstart = () => keys.right = true;
document.getElementById("right").ontouchend = () => keys.right = false;

document.getElementById("jump").ontouchstart = () => keys.jump = true;
document.getElementById("jump").ontouchend = () => keys.jump = false;

const player = {
  x: 100,
  y: 100,
  w: 40,
  h: 40,
  vy: 0,
  onGround: false
};

const gravity = 0.8;

const platforms = [
  { x: 0, y: canvas.height - 80, w: 3000, h: 80 },
  { x: 300, y: canvas.height - 200, w: 150, h: 20 },
  { x: 600, y: canvas.height - 300, w: 150, h: 20 },
  { x: 900, y: canvas.height - 250, w: 150, h: 20 },
  { x: 1200, y: canvas.height - 350, w: 150, h: 20 },
  { x: 1500, y: canvas.height - 220, w: 150, h: 20 }
];

function update() {
  if (keys.left) player.x -= 5;
  if (keys.right) player.x += 5;

  if (keys.jump && player.onGround) {
    player.vy = -15;
    player.onGround = false;
  }

  player.vy += gravity;
  player.y += player.vy;

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
    }
  }

  if (player.y > canvas.height + 500) {
    player.x = 100;
    player.y = 100;
    player.vy = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const camX = player.x - canvas.width / 2 + player.w / 2;
  ctx.save();
  ctx.translate(-camX, 0);

  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = "gray";
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

  ctx.restore();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
// КЛАВИАТУРА (ПК)
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