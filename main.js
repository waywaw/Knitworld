
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameOver = false;
let stitches = 0;
let maxStitches = 800;
let yarnAmount = 100;
let complimentGiven = false;
let scrollX = 0;
let playerColor = "hotpink";

const compliments = [
    "That sweater is stunning!",
    "Did you knit that yourself? Incredible.",
    "Where’d you get that sweater? It’s amazing.",
    "I need one just like that!",
    "That colorwork is gorgeous."
];

const player = {
    x: 120,
    y: canvas.height / 2,
    radius: 20,
    dy: 0,
    gravity: 1.2,
    jumpPower: -14,
    color: "hotpink"
};

let yarnBalls = [];

function spawnYarn() {
    const y = Math.random() * (canvas.height - 60) + 30;
    const colors = ["lightblue", "gold", "limegreen", "orange", "violet", "tomato", "aqua"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    yarnBalls.push({ x: scrollX + canvas.width + 100, y, radius: 10, color });
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
    const width = 120;
    const height = 160;
    const progress = Math.min(1, stitches / maxStitches);

    ctx.fillStyle = playerColor;
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
    drawBackground();

    scrollX += 1;

    ctx.strokeStyle = "#888";
    ctx.strokeRect(20, 20, 120, 10);
    ctx.fillStyle = "#fff";
    ctx.fillRect(20, 20, (yarnAmount / 100) * 120, 10);

    // Animated knitting needles
    const time = Date.now() / 300;
    ctx.save();
    ctx.translate(180, 120);
    ctx.rotate(-0.3 + Math.sin(time) * 0.05);
    ctx.fillStyle = "silver";
    ctx.fillRect(-5, 0, 10, 60);
    ctx.restore();

    ctx.save();
    ctx.translate(240, 120);
    ctx.rotate(0.3 - Math.sin(time) * 0.05);
    ctx.fillStyle = "silver";
    ctx.fillRect(-5, 0, 10, 60);
    ctx.restore();

    // Yarn animation
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(canvas.width / 2, 180);
    ctx.strokeStyle = player.color;
    ctx.lineWidth = 4;
    ctx.stroke();

    drawSweater();

    yarnBalls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x - scrollX, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
    });

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

    if (Math.random() < 0.02) spawnYarn();

    yarnBalls = yarnBalls.filter(ball => {
        const dx = player.x - (ball.x - scrollX);
        const dy = player.y - ball.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < player.radius + ball.radius) {
            yarnAmount = Math.min(100, yarnAmount + 10);
            player.color = ball.color;
            return false;
        }
        return true;
    });

    if (yarnAmount <= 0) {
        endGame("You ran out of yarn!");
    }

    if (stitches >= maxStitches && !complimentGiven) {
        complimentGiven = true;
        endGame(compliments[Math.floor(Math.random() * compliments.length)]);
    }

    yarnAmount -= 0.005;
}

function endGame(message) {
    gameOver = true;
    document.getElementById("gameMessage").textContent = message;
    document.getElementById("gameOver").style.display = "flex";
}

function restartGame() {
    stitches = 0;
    yarnAmount = 100;
    complimentGiven = false;
    scrollX = 0;
    gameOver = false;
    player.color = "hotpink";
    player.y = canvas.height / 2;
    yarnBalls = [];
    document.getElementById("gameOver").style.display = "none";
    loop();
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

loop();
