const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// input
let keys = {
  left: false,
  right: false,
  jump: false
};

// кнопки (телефон)
left.ontouchstart = () => keys.left = true;
left.ontouchend = () => keys.left = false;

right.ontouchstart = () => keys.right = true;
right.ontouchend = () => keys.right = false;

jump.ontouchstart = () => keys.jump = true;
jump.ontouchend = () => keys.jump = false;

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

// player
const player = {
  x: 100,
  y: 100,
  w: 40,
  h: 40,
  vy: 0,
  onGround: false
};

// physics
const gravity = 0.9;
const jumpPower = -18;

// ground
const ground = {
  x: 0,
  y: canvas.height - 80,
  w: canvas.width,
  h: 80
};

function update() {
  // движение
  if (keys.left) player.x -= 5;
  if (keys.right) player.x += 5;

  // прыжок
  if (keys.jump && player.onGround) {
    player.vy = jumpPower;
    player.onGround = false;
  }

  // гравитация
  player.vy += gravity;
  player.y += player.vy;

  // столкновение с землёй
  if (
    player.y + player.h >= ground.y
  ) {
    player.y = ground.y - player.h;
    player.vy = 0;
    player.onGround = true;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // игрок
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // земля
  ctx.fillStyle = "gray";
  ctx.fillRect(ground.x, ground.y, ground.w, ground.h);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();