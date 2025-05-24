
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const MAX_YARN = 100;
let projectProgress = 0;

const yarnBall = {
    x: 100,
    y: canvas.height / 2,
    radius: 30,
    dy: 0,
    gravity: 1.2,
    jumpPower: -18,
    unravel: MAX_YARN
};

const yarns = [];
let scrollSpeed = 3;

function spawnYarn() {
    const y = Math.random() * (canvas.height - 60) + 30;
    yarns.push({ x: canvas.width + 60, y, radius: 15 });
}

document.addEventListener("touchstart", () => {
    if (yarnBall.unravel > 0) {
        yarnBall.dy = yarnBall.jumpPower;
    }
});

function update() {
    yarnBall.dy += yarnBall.gravity;
    yarnBall.y += yarnBall.dy;

    if (yarnBall.y + yarnBall.radius > canvas.height) {
        yarnBall.y = canvas.height - yarnBall.radius;
        yarnBall.dy = 0;
    }

    if (yarnBall.x > canvas.width * 0.75) {
        yarnBall.x = canvas.width * 0.75;
    } else {
        yarnBall.x += scrollSpeed * 0.1;
    }

    yarnBall.unravel -= 0.03;
    yarnBall.radius = Math.max(10, (yarnBall.unravel / MAX_YARN) * 30);
    projectProgress += 0.05;

    for (let i = yarns.length - 1; i >= 0; i--) {
        yarns[i].x -= scrollSpeed;
        const dx = yarnBall.x - yarns[i].x;
        const dy = yarnBall.y - yarns[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < yarnBall.radius + yarns[i].radius) {
            yarnBall.unravel = Math.min(MAX_YARN, yarnBall.unravel + 20);
            yarns.splice(i, 1);
        }
    }

    if (Math.random() < 0.01) spawnYarn();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#2e1a15";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(yarnBall.x, yarnBall.y);
    ctx.bezierCurveTo(yarnBall.x - 50, yarnBall.y - 20, 80, 100, 60, 140);
    ctx.strokeStyle = "hotpink";
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = "silver";
    ctx.fillRect(40, 100 + Math.sin(Date.now() / 300) * 5, 8, 60);
    ctx.fillRect(60, 100 - Math.sin(Date.now() / 300) * 5, 8, 60);

    ctx.fillStyle = "#d19f82";
    ctx.fillRect(20, 160, 60, projectProgress);

    ctx.fillStyle = "white";
    yarns.forEach(yarn => {
        ctx.beginPath();
        ctx.arc(yarn.x, yarn.y, yarn.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = "hotpink";
    ctx.beginPath();
    ctx.arc(yarnBall.x, yarnBall.y, yarnBall.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#888";
    ctx.strokeRect(20, 20, 120, 10);
    ctx.fillRect(20, 20, (yarnBall.unravel / MAX_YARN) * 120, 10);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
