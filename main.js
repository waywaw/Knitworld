
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameOver = false;
let yarnAmount = 100;
let sweaterProgress = 0;
let color = "hotpink";
const sweaterMax = 300;

function drawSweater() {
    const x = canvas.width / 2 - 60;
    const y = 180;
    const bodyHeight = Math.min(sweaterProgress, 180);
    const sleeveLength = Math.min(sweaterProgress * 0.6, 100);

    // Body
    ctx.fillStyle = color;
    ctx.fillRect(x + 20, y, 80, bodyHeight);

    // Sleeves
    ctx.beginPath();
    ctx.moveTo(x + 20, y);
    ctx.lineTo(x - 30, y + sleeveLength);
    ctx.lineTo(x - 10, y + sleeveLength);
    ctx.lineTo(x + 20, y + 20);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 100, y);
    ctx.lineTo(x + 150, y + sleeveLength);
    ctx.lineTo(x + 130, y + sleeveLength);
    ctx.lineTo(x + 100, y + 20);
    ctx.closePath();
    ctx.fill();
}

function drawNeedles() {
    ctx.fillStyle = "silver";
    ctx.save();
    ctx.translate(100, 100);
    ctx.rotate(Math.sin(Date.now() / 300) * 0.1);
    ctx.fillRect(-5, 0, 10, 60);
    ctx.restore();

    ctx.save();
    ctx.translate(130, 100);
    ctx.rotate(-Math.sin(Date.now() / 300) * 0.1);
    ctx.fillRect(-5, 0, 10, 60);
    ctx.restore();
}

function update() {
    if (yarnAmount <= 0) {
        endGame("You ran out of yarn!");
        return;
    }

    sweaterProgress += 1.2;
    yarnAmount -= 0.6;

    if (sweaterProgress >= sweaterMax) {
        endGame("You finished the sweater! Beautiful work.");
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Yarn meter
    ctx.strokeStyle = "#888";
    ctx.strokeRect(20, 20, 120, 10);
    ctx.fillStyle = "#fff";
    ctx.fillRect(20, 20, (yarnAmount / 100) * 120, 10);

    // Yarn strand
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 180);
    ctx.bezierCurveTo(250, 140, 150, 200, 110, 100);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.stroke();

    drawNeedles();
    drawSweater();
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
    yarnAmount = 100;
    sweaterProgress = 0;
    document.getElementById("gameOver").style.display = "none";
    loop();
}

loop();
