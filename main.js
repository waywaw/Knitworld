
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameOver = false;
let yarnAmount = 100;
let stitches = [];
let rowColors = [];
const stitchSize = 6;
const stitchesPerRow = 40;
const maxRows = 40;

const colors = ["hotpink", "lightblue", "gold", "limegreen", "orange", "violet", "tomato"];

let player = {
    x: 120,
    y: canvas.height / 2,
    dy: 0,
    gravity: 1.2,
    jumpPower: -16,
    radius: 20,
    unravel: 100,
    color: "hotpink"
};

let yarnBalls = [];

function spawnYarn() {
    const y = Math.random() * (canvas.height - 60) + 30;
    const color = colors[Math.floor(Math.random() * colors.length)];
    yarnBalls.push({ x: canvas.width + 60, y, radius: 10, color });
}

function addStitch(color) {
    if (rowColors.length >= maxRows) return;
    let currentRow = stitches.length % stitchesPerRow;
    stitches.push({ x: currentRow, y: Math.floor(stitches.length / stitchesPerRow), color });
    if (currentRow === stitchesPerRow - 1) {
        rowColors.push(color);
    }
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") player.dy = player.jumpPower;
    if (e.code === "ArrowLeft") player.x -= 10;
    if (e.code === "ArrowRight") player.x += 10;
});

document.addEventListener("touchstart", (e) => {
    const touchX = e.touches[0].clientX;
    if (touchX < canvas.width / 2) player.x -= 10;
    else player.x += 10;
    player.dy = player.jumpPower;
});

function update() {
    if (player.unravel <= 0) {
        endGame("You ran out of yarn!");
        return;
    }
    if (rowColors.length >= maxRows) {
        endGame("Sweater complete! Beautiful work.");
        return;
    }

    player.dy += player.gravity;
    player.y += player.dy;
    if (player.y + player.radius > canvas.height) {
        player.y = canvas.height - player.radius;
        player.dy = 0;
    }

    if (player.x > canvas.width * 0.75) player.x = canvas.width * 0.75;
    if (player.x < 50) player.x = 50;

    player.unravel -= 0.02;

    yarnBalls.forEach(ball => ball.x -= 2);
    yarnBalls = yarnBalls.filter(ball => ball.x > -20);

    for (let i = yarnBalls.length - 1; i >= 0; i--) {
        const ball = yarnBalls[i];
        const dx = player.x - ball.x;
        const dy = player.y - ball.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < player.radius + ball.radius) {
            player.unravel = Math.min(100, player.unravel + 10);
            player.color = ball.color;
            addStitch(ball.color);
            yarnBalls.splice(i, 1);
        }
    }

    if (Math.random() < 0.02) spawnYarn();
}

function drawSweater() {
    const offsetX = 200;
    const offsetY = 160;
    stitches.forEach(stitch => {
        ctx.fillStyle = stitch.color;
        ctx.fillRect(offsetX + stitch.x * stitchSize, offsetY + stitch.y * stitchSize, stitchSize, stitchSize);
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Yarn meter
    ctx.strokeStyle = "#aaa";
    ctx.strokeRect(20, 20, 120, 10);
    ctx.fillStyle = "#fff";
    ctx.fillRect(20, 20, (player.unravel / 100) * 120, 10);

    // Knitting needles
    ctx.fillStyle = "silver";
    ctx.fillRect(180, 100 + Math.sin(Date.now() / 200) * 3, 10, 60);
    ctx.fillRect(220, 100 - Math.sin(Date.now() / 200) * 3, 10, 60);

    // Sweater
    drawSweater();

    // Yarn balls
    yarnBalls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
    });

    // Yarn ball character
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
}

function loop() {
    if (!gameOver) {
        update();
        draw();
        requestAnimationFrame(loop);
    }
}

function endGame(message) {
    gameOver = true;
    const overlay = document.getElementById("gameOver");
    document.getElementById("gameMessage").textContent = message;
    overlay.style.display = "flex";
}

function restartGame() {
    gameOver = false;
    stitches = [];
    rowColors = [];
    player.unravel = 100;
    player.color = "hotpink";
    player.x = 120;
    yarnBalls = [];
    document.getElementById("gameOver").style.display = "none";
    loop();
}

loop();
