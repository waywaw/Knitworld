
let stitches = 0;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.addEventListener('click', () => {
    stitches++;
    document.getElementById('stitchCount').innerText = "Stitches: " + stitches;
    draw();
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff7f50';
    ctx.beginPath();
    ctx.arc(400, 300, 30, 0, Math.PI * 2);
    ctx.fill();
}

function enterCrochetMode() {
    alert("Crochet Mode: Coming soon! You’ll build bridges, bubbles, and wearable magic.");
}

draw();
