
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameOver = false;
let yarnAmount = 100;
let stage = 0;
let stitches = [];
let complimentGiven = false;
let stitchColor = "hotpink";
let scrollX = 0;
let scraps = [];

const player = {
  x: 100,
  y: canvas.height / 2,
  radius: 20,
  dx: 0,
  dy: 0,
  speed: 6,
  color: "hotpink"
};

const compliments = [
  "That raglan is everything!",
  "Flawless colorwork!",
  "A true handmade masterpiece.",
  "Is that top-down? Gorgeous.",
  "People will be asking where you bought it."
];

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

function drawNeedles() {
  const time = stitches.length * 200;
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

function drawSweater() {
  const cx = canvas.width / 2;
  const y0 = 180;
  const size = 6;
  let sectionRows = [6, 10, 12, 4, 10, 4, 10, 4]; // collar, yoke, body, rib, sleeve, rib, sleeve, rib
  let current = 0;
  let colorIndex = 0;

  for (let s = 0; s < sectionRows.length; s++) {
    for (let row = 0; row < sectionRows[s]; row++) {
      for (let col = 0; col < 30; col++) {
        if (current >= stitches.length) return;
        let x = cx - 90 + col * size;
        let y = y0 + (row + sectionRows.slice(0, s).reduce((a, b) => a + b, 0)) * size;
        ctx.fillStyle = stitches[current];
        ctx.fillRect(x, y, size, size);
        current++;
      }
    }
  }
  if (stitches.length >= sectionRows.reduce((a, b) => a + b, 0) * 30) {
    ctx.fillStyle = "#444";
    ctx.fillRect(cx - 90, y0 + 46 * size, 180, 6); // bottom ribbing
    ctx.beginPath();
    ctx.arc(cx, y0 - 6, 10, 0, Math.PI * 2);
    ctx.fill(); // collar ribbing
  }
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

  player.x += player.dx;
  player.y += player.dy;
  player.x = Math.max(30, Math.min(canvas.width - 30, player.x));
  player.y = Math.max(30, Math.min(canvas.height - 30, player.y));

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

  if (stitches.length >= 240 * 1 && !complimentGiven) {
    complimentGiven = true;
    endGame(compliments[Math.floor(Math.random() * compliments.length)]);
  }

  yarnAmount -= 0.07;
}

function stitch() {
  if (yarnAmount > 0) {
    stitches.push(stitchColor);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    stitch();
  }
  if (e.code === "ArrowLeft") player.dx = -player.speed;
  if (e.code === "ArrowRight") player.dx = player.speed;
  if (e.code === "ArrowUp") player.dy = -player.speed;
  if (e.code === "ArrowDown") player.dy = player.speed;
});

document.addEventListener("keyup", (e) => {
  if (["ArrowLeft", "ArrowRight"].includes(e.code)) player.dx = 0;
  if (["ArrowUp", "ArrowDown"].includes(e.code)) player.dy = 0;
});

document.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  const targetX = touch.clientX;
  const targetY = touch.clientY;
  player.dx = targetX > player.x ? player.speed : -player.speed;
  player.dy = targetY > player.y ? player.speed : -player.speed;
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
  yarnAmount = 100;
  stitchColor = "hotpink";
  complimentGiven = false;
  player.x = 100;
  player.y = canvas.height / 2;
  scraps = [];
  scrollX = 0;
  document.getElementById("gameOver").style.display = "none";
  loop();
}

loop();
