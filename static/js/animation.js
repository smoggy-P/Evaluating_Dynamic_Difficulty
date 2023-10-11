const canvas = document.getElementById("mapCanvas");
canvas.height = canvas.width;
const ctx = canvas.getContext("2d");
const circles = [];

function generateAnimation(difficulty) {
    const results = solveILP(difficulty);

    // Clear existing circles
    circles.length = 0;

    // Create new circles based on the ILP results
    for (let i = 0; i < results.number; i++) {
        const circle = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: results.size * canvas.width * 10 / 500,
            velocityX: results.velocity / 500 * canvas.width * (Math.random() > 0.5 ? 1 : -1),
            velocityY: results.velocity / 500 * canvas.width * (Math.random() > 0.5 ? 1 : -1),
        };
        circles.push(circle);
    }

    // Display the results
    document.getElementById("resultsDisplay").innerHTML = `
        <p>Obstacle Number: ${results.number}</p>
        <p>Obstacle Size: ${results.size} m</p> 
        <p>Obstacle Velocity: ${results.velocity} m/s</p>
    `;
}

function solveILP(difficulty) {
    const model = {
        "optimize": "z",
        "opType": "min",
        "constraints": {
            "ieq_num": { "min": 10, "max": 30 },
            "ieq_size": { "min": 0.5, "max": 1.5 },
            "ieq_vel": { "min": 2, "max": 6 },
            "ieq_z": { "min": 0 },
            "ieq1": { "min": -6.014 - difficulty },
            "ieq2": { "min": 6.014 + difficulty }
        },
        "variables": {
            "number": {
                "ieq_num": 1,
                "ieq1": -0.226,
                "ieq2": 0.226,
            },
            "size": {
                "ieq_size": 1,
                "ieq1": -2.646,
                "ieq2": 2.646,
            },
            "velocity": {
                "ieq_vel": 1,
                "ieq1": -1.104,
                "ieq2": 1.104
            },
            "z": { "ieq1": 1, "ieq2": 1, "ieq_z": 1 }
        },
        "ints": { "number": 1 }
    };
    if (document.getElementById("agentNumInput").value) {
        model.constraints.ieq_num.min = parseInt(document.getElementById("agentNumInput").value);
        model.constraints.ieq_num.max = parseInt(document.getElementById("agentNumInput").value);
    }
    if (document.getElementById("agentSizeInput").value) {
        model.constraints.ieq_size.min = parseInt(document.getElementById("agentSizeInput").value);
        model.constraints.ieq_size.max = parseInt(document.getElementById("agentSizeInput").value);
    }
    if (document.getElementById("agentVelInput").value) {
        model.constraints.ieq_vel.min = parseInt(document.getElementById("agentVelInput").value);
        model.constraints.ieq_vel.max = parseInt(document.getElementById("agentVelInput").value);
    }
    return solver.Solve(model);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach(circle => {
        circle.x += circle.velocityX;
        circle.y += circle.velocityY;

        if (circle.x - circle.radius < 0 || circle.x + circle.radius > canvas.width) {
            circle.velocityX *= -1;
        }
        if (circle.y - circle.radius < 0 || circle.y + circle.radius > canvas.height) {
            circle.velocityY *= -1;
        }

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.closePath();
    });

    requestAnimationFrame(draw);
}

document.getElementById("generateButton").addEventListener("click", () => {
    const difficulty = parseFloat(document.getElementById("difficultyInput").value);
    generateAnimation(difficulty);
});

// Initial animation generation
generateAnimation(1);
draw();