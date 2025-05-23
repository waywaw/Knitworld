
let stitches = 0;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let particles = [];

canvas.addEventListener('click', () => {
    stitches++;
    document.getElementById('stitchCount').innerText = "Stitches: " + stitches;
    spawnParticles(400, 300);
    draw();
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Yarn Creature
    ctx.fillStyle = '#ff7f50';
    ctx.beginPath();
    ctx.arc(400, 300, 30, 0, Math.PI * 2);
    ctx.fill();

    // Floating patches
    for (let i = 0; i < stitches; i++) {
        ctx.fillStyle = `rgba(255, 182, 193, ${1 - i * 0.02})`;
        ctx.fillRect(100 + i * 10 % 600, 550 - i, 8, 8);
    }

    // Animate particles
    particles.forEach((p, index) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        p.y -= 1;
        p.radius -= 0.1;
        if (p.radius <= 0) particles.splice(index, 1);
    });
}

function spawnParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: x + Math.random() * 40 - 20,
            y: y + Math.random() * 40 - 20,
            radius: Math.random() * 5 + 2,
            color: "rgba(255,192,203,0.8)"
        });
    }
}

function enterCrochetMode() {
    alert("Crochet Mode: Cast a stitch-spell to bridge the gap!");
}

setInterval(draw, 30);
