const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameOver = false;
let yarnAmount = 100;
let stitches = 0;
let maxStitches = 1000;
let complimentGiven = false;
const compliments = [
  "That sweater is stunning!",
  "Did you knit that yourself? Incredible.",
  "I love your sweater — it looks handmade.",
  "You have great taste in yarn.",
  "That colorwork is beautiful!"
];

let player = {
  x: 120,
  y: canvas.height / 2,
  dy: 0,
  gravity: 1.2,
  jumpPower: -16,
  radius: 20,
  color: "hotpink"
};

function drawSweater() {
  const centerX = canvas.width / 2;
  const topY = 180;
  const width = 120;
  const height = 160;
  const progress = Math.min(1, stitches / maxStitches);

  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.moveTo(centerX - 30, topY);
  ctx.lineTo(centerX + 30, topY);
  ctx.lineTo(centerX + 60, topY + height * progress);
  ctx.lineTo(centerX - 60, topY + height * progress);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(centerX - 30, topY);
  ctx.lineTo(centerX - 80, topY + height * 0.5 * progress);
  ctx.lineTo(centerX - 70, topY + height * 0.5 * progress);
  ctx.lineTo(centerX - 30, topY + 20);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(centerX + 30, topY);
  ctx.lineTo(centerX + 80, topY + height * 0.5 * progress);
  ctx.lineTo(centerX + 70, topY + height * 0.5 * progress);
  ctx.lineTo(centerX + 30, topY + 20);
  ctx.closePath();
  ctx.fill();

  if (progress === 1) {
    ctx.fillStyle = "#444";
    ctx.fillRect(centerX - 60, topY + height, 120, 6);
    ctx.fillRect(centerX - 80, topY + height * 0.5, 10, 6);
    ctx.fillRect(centerX + 70, topY + height * 0.5, 10, 6);
    ctx.beginPath();
    ctx.arc(centerX, topY, 10, 0, Math.PI * 2);
    ctx.fill();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#aaa";
  ctx.strokeRect(20, 20, 120, 10);
  ctx.fillStyle = "#fff";
  ctx.fillRect(20, 20, (yarnAmount / 100) * 120, 10);

  ctx.save();
  ctx.translate(180, 120);
  ctx.rotate(-0.3);
  ctx.fillStyle = "silver";
  ctx.fillRect(-5, 0, 10, 60);
  ctx.restore();

  ctx.save();
  ctx.translate(240, 120);
  ctx.rotate(0.3);
  ctx.fillStyle = "silver";
  ctx.fillRect(-5, 0, 10, 60);
  ctx.restore();

  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(canvas.width / 2, 180);
  ctx.strokeStyle = player.color;
  ctx.lineWidth = 4;
  ctx.stroke();

  drawSweater();

  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
}

function update() {
  if (gameOver) return;
  player.dy += player.gravity;
  player.y += player.dy;
  if (player.y + player.radius > canvas.height) {
    player.y = canvas.height - player.radius;
    player.dy = 0;
  }
  if (stitches >= maxStitches && !complimentGiven) {
    complimentGiven = true;
    endGame(compliments[Math.floor(Math.random() * compliments.length)]);
  }
  yarnAmount -= 0.01;
  if (yarnAmount <= 0) endGame("You ran out of yarn!");
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    player.dy = player.jumpPower;
    stitches += 5;
  }
  if (e.code === "ArrowLeft") player.x -= 10;
  if (e.code === "ArrowRight") player.x += 10;
});

document.addEventListener("touchstart", () => {
  player.dy = player.jumpPower;
  stitches += 5;
});

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function endGame(message) {
  gameOver = true;
  document.getElementById("gameMessage").textContent = message;
  document.getElementById("gameOver").style.display = "flex";
}

function restartGame() {
  gameOver = false;
  stitches = 0;
  complimentGiven = false;
  yarnAmount = 100;
  document.getElementById("gameOver").style.display = "none";
  loop();
}

loop();