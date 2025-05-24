
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const yarnBall = {
    x: 100,
    y: canvas.height / 2,
    radius: 30,
    color: "hotpink",
    dy: 0,
    gravity: 1.2,
    jumpPower: -18,
    unravel: 100
};

let yarns = [];
let scrollSpeed = 3;

document.addEventListener("touchstart", () => {
    if (yarnBall.unravel > 0) {
        yarnBall.dy = yarnBall.jumpPower;
    }
});

function spawnYarn() {
    const y = Math.random() * (canvas.height - 60) + 30;
    yarns.push({ x: canvas.width + 60, y, radius: 15 });
}

function update() {
    yarnBall.dy += yarnBall.gravity;
    yarnBall.y += yarnBall.dy;
    yarnBall.x += scrollSpeed * 0.1;
    yarnBall.unravel -= 0.05;

    if (yarnBall.y + yarnBall.radius > canvas.height) {
        yarnBall.y = canvas.height - yarnBall.radius;
        yarnBall.dy = 0;
    }

    for (let i = yarns.length - 1; i >= 0; i--) {
        yarns[i].x -= scrollSpeed;
        const dx = yarnBall.x - yarns[i].x;
        const dy = yarnBall.y - yarns[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < yarnBall.radius + yarns[i].radius) {
            yarnBall.unravel += 10;
            yarns.splice(i, 1);
        }
    }

    if (Math.random() < 0.01) spawnYarn();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2e1a15";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = yarnBall.color;
    ctx.beginPath();
    ctx.arc(yarnBall.x, yarnBall.y, yarnBall.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "white";
    yarns.forEach(yarn => {
        ctx.beginPath();
        ctx.arc(yarn.x, yarn.y, yarn.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = "white";
    ctx.font = "24px sans-serif";
    ctx.fillText("Yarn left: " + Math.floor(yarnBall.unravel), 10, 30);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
