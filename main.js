
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameOver = false;
let stitches = [];
let maxStitches = 800;
let yarnAmount = 100;
let complimentGiven = false;
let scrollX = 0;
let stitchColor = "hotpink";
let stitchCounter = 0;

const player = {
  x: 120,
  y: canvas.height / 2,
  dy: 0,
  gravity: 1.2,
  jumpPower: -14,
  radius: 20,
  color: "hotpink"
};

const compliments = [
  "Where’d you get that sweater? Gorgeous!",
  "That knit is runway-ready.",
  "Obsessed with those colors.",
  "That’s pure yarn magic.",
  "Incredible stitch work!"
];

let scraps = [];

function spawnScrap() {
  const y = Math.random() * (canvas.height - 100) + 50;
  const colors = ["lightblue", "gold", "limegreen", "orange", "violet", "tomato", "aqua"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  scraps.push({ x: scrollX + canvas.width + 100, y, color, size: Math.random() * 12 + 6 });
}

function drawBackground() {
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#2e2e4d";
  for (let i = 0; i < canvas.width; i += 100) {
    ctx.beginPath();
    ctx.arc(i + (scrollX * 0.2 % 100), 100, 60, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSweater() {
  const centerX = canvas.width / 2;
  const topY = 180;
  const rowLength = 40;
  const stitchSize = 6;

  for (let i = 0; i < stitches.length; i++) {
    const row = Math.floor(i / rowLength);
    const col = i % rowLength;
    const x = centerX - rowLength * stitchSize / 2 + col * stitchSize;
    const y = topY + row * stitchSize;
    ctx.fillStyle = stitches[i];
    ctx.fillRect(x, y, stitchSize, stitchSize);
  }

  if (stitches.length >= maxStitches) {
    // Ribbing
    ctx.fillStyle = "#444";
    ctx.fillRect(centerX - 120, topY + rowLength * stitchSize, 240, 6);
    ctx.fillRect(centerX - 150, topY + 50, 10, 6);
    ctx.fillRect(centerX + 140, topY + 50, 10, 6);
    ctx.beginPath();
    ctx.arc(centerX, topY - 6, 10, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawNeedles() {
  const time = stitchCounter * 200;
  ctx.save();
  ctx.translate(180, 120);
  ctx.rotate(-0.3 + Math.sin(time / 150) * 0.1);
  ctx.fillStyle = "silver";
  ctx.fillRect(-5, 0, 10, 60);
  ctx.restore();

  ctx.save();
  ctx.translate(240, 120);
  ctx.rotate(0.3 - Math.sin(time / 150) * 0.1);
  ctx.fillStyle = "silver";
  ctx.fillRect(-5, 0, 10, 60);
  ctx.restore();
}

function draw() {
  drawBackground();
  scrollX += 1;

  ctx.strokeStyle = "#888";
  ctx.strokeRect(20, 20, 120, 10);
  ctx.fillStyle = "#fff";
  ctx.fillRect(20, 20, (yarnAmount / 100) * 120, 10);

  drawNeedles();

  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(canvas.width / 2, 180);
  ctx.strokeStyle = stitchColor;
  ctx.lineWidth = 4;
  ctx.stroke();

  drawSweater();

  scraps.forEach(scrap => {
    ctx.fillStyle = scrap.color;
    ctx.beginPath();
    ctx.arc(scrap.x - scrollX, scrap.y, scrap.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = stitchColor;
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

  if (Math.random() < 0.04) spawnScrap();

  scraps = scraps.filter(scrap => {
    const dx = player.x - (scrap.x - scrollX);
    const dy = player.y - scrap.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < player.radius + scrap.size) {
      yarnAmount = Math.min(100, yarnAmount + scrap.size * 0.4);
      stitchColor = scrap.color;
      return false;
    }
    return true;
  });

  if (yarnAmount <= 0) {
    endGame("You ran out of yarn!");
  }

  if (stitches.length >= maxStitches && !complimentGiven) {
    complimentGiven = true;
    endGame(compliments[Math.floor(Math.random() * compliments.length)]);
  }

  yarnAmount -= 0.1;
}

function stitch() {
  if (yarnAmount > 0 && stitches.length < maxStitches) {
    stitches.push(stitchColor);
    stitchCounter++;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    player.dy = player.jumpPower;
    stitch();
  }
  if (e.code === "ArrowLeft") player.x -= 10;
  if (e.code === "ArrowRight") player.x += 10;
});

document.addEventListener("touchstart", () => {
  player.dy = player.jumpPower;
  stitch();
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
  stitches = [];
  stitchCounter = 0;
  yarnAmount = 100;
  complimentGiven = false;
  stitchColor = "hotpink";
  player.y = canvas.height / 2;
  scrollX = 0;
  scraps = [];
  document.getElementById("gameOver").style.display = "none";
  loop();
}

loop();
