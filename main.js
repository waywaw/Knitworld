
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
    x: 50,
    y: 300,
    width: 40,
    height: 40,
    color: "purple",
    dy: 0,
    gravity: 1.5,
    jumpPower: -20,
    grounded: false
};

const keys = {
    space: false
};

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") keys.space = true;
});

document.addEventListener("keyup", (e) => {
    if (e.code === "Space") keys.space = false;
});

const ground = {
    x: 0,
    y: 360,
    width: canvas.width,
    height: 40,
    color: "green"
};

function update() {
    if (keys.space && player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }

    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height >= ground.y) {
        player.y = ground.y - player.height;
        player.dy = 0;
        player.grounded = true;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = ground.color;
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
