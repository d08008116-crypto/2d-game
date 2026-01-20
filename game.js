const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// фон
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// большой квадрат по центру
ctx.fillStyle = "red";
ctx.fillRect(
  canvas.width / 2 - 100,
  canvas.height / 2 - 100,
  200,
  200
);

// текст (важно!)
ctx.fillStyle = "white";
ctx.font = "30px Arial";
ctx.fillText("JS WORKS", 50, 50);