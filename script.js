
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let stitches = 0;

canvas.addEventListener("click", () => {
    stitches++;
    document.getElementById("knitCount").innerText = "Stitches: " + stitches;
    drawWorld();
});

function drawWorld() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Base land
    ctx.fillStyle = "#fcd5ce";
    ctx.fillRect(100, 500 - stitches, 600, 100 + stitches);

    // Character (yarn creature)
    ctx.fillStyle = "#ff7f50";
    ctx.beginPath();
    ctx.arc(400, 450 - stitches / 2, 30, 0, Math.PI * 2);
    ctx.fill();

    // Little bit of growth visuals
    for (let i = 0; i < stitches; i++) {
        ctx.fillStyle = `rgba(255, 192, 203, ${1 - i * 0.02})`;
        ctx.fillRect(120 + i * 5 % 560, 480 - i, 5, 5);
    }
}

drawWorld();
