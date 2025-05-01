const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

const box = 20; // Size of each grid box
const borderThickness = 4; // Thickness of the red border
let snake = [{ x: 9 * box, y: 10 * box }]; // Initial snake position
let direction = null; // Snake's direction
let food = generateFood(); // Generate initial food position
let score = 0;
let game; // Game interval variable

// Generate food position within the playable area
function generateFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
  };
}

function draw() {
  // Draw the background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the red border
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, canvas.width, borderThickness); // Top border
  ctx.fillRect(0, canvas.height - borderThickness, canvas.width, borderThickness); // Bottom border
  ctx.fillRect(0, 0, borderThickness, canvas.height); // Left border
  ctx.fillRect(canvas.width - borderThickness, 0, borderThickness, canvas.height); // Right border

  // Draw the snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "white"; // Head is green, body is white
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "black";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);

    // Add eyes and pupils to the snake's head
    if (i === 0) {
      ctx.fillStyle = "white";
      let leftEyeX, leftEyeY, rightEyeX, rightEyeY, pupilOffsetX, pupilOffsetY;

      // Adjust eye and pupil positions based on direction
      if (direction === "LEFT") {
        leftEyeX = snake[i].x + box / 4;
        leftEyeY = snake[i].y + box / 4;
        rightEyeX = snake[i].x + box / 4;
        rightEyeY = snake[i].y + (3 * box) / 4;
        pupilOffsetX = -box / 16;
        pupilOffsetY = 0;
      } else if (direction === "UP") {
        leftEyeX = snake[i].x + box / 4;
        leftEyeY = snake[i].y + box / 4;
        rightEyeX = snake[i].x + (3 * box) / 4;
        rightEyeY = snake[i].y + box / 4;
        pupilOffsetX = 0;
        pupilOffsetY = -box / 16;
      } else if (direction === "RIGHT") {
        leftEyeX = snake[i].x + (3 * box) / 4;
        leftEyeY = snake[i].y + box / 4;
        rightEyeX = snake[i].x + (3 * box) / 4;
        rightEyeY = snake[i].y + (3 * box) / 4;
        pupilOffsetX = box / 16;
        pupilOffsetY = 0;
      } else if (direction === "DOWN") {
        leftEyeX = snake[i].x + box / 4;
        leftEyeY = snake[i].y + (3 * box) / 4;
        rightEyeX = snake[i].x + (3 * box) / 4;
        rightEyeY = snake[i].y + (3 * box) / 4;
        pupilOffsetX = 0;
        pupilOffsetY = box / 16;
      } else {
        // Default eye position (when no direction is set)
        leftEyeX = snake[i].x + box / 4;
        leftEyeY = snake[i].y + box / 4;
        rightEyeX = snake[i].x + (3 * box) / 4;
        rightEyeY = snake[i].y + box / 4;
        pupilOffsetX = 0;
        pupilOffsetY = 0;
      }

      // Draw left eye
      ctx.beginPath();
      ctx.arc(leftEyeX, leftEyeY, box / 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw right eye
      ctx.beginPath();
      ctx.arc(rightEyeX, rightEyeY, box / 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw pupils
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(leftEyeX + pupilOffsetX, leftEyeY + pupilOffsetY, box / 16, 0, Math.PI * 2); // Left pupil
      ctx.fill();
      ctx.beginPath();
      ctx.arc(rightEyeX + pupilOffsetX, rightEyeY + pupilOffsetY, box / 16, 0, Math.PI * 2); // Right pupil
      ctx.fill();
    }
  }

  // Draw the food
ctx.fillStyle = "red";
ctx.fillRect(food.x, food.y, box, box);

// Draw the grid
ctx.strokeStyle = "#333"; // Grid line color
for (let x = 0; x < canvas.width; x += box) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, canvas.height);
  ctx.stroke();
}
for (let y = 0; y < canvas.height; y += box) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(canvas.width, y);
  ctx.stroke();
}

// Add a stem to the food
ctx.strokeStyle = "brown";
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(food.x + box / 2, food.y); // Start at the top center of the food
ctx.lineTo(food.x + box / 2, food.y - box / 4); // Draw the stem upward
ctx.stroke();

  // Move the snake
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // Check if the snake eats the food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = generateFood(); // Generate new food position
  } else {
    snake.pop(); // Remove the tail
  }

  // Add new head
  const newHead = { x: snakeX, y: snakeY };

  // Game over conditions: Check if the snake touches the red border
  if (
    snakeX < 0 || // Left border
    snakeY < 0 || // Top border
    snakeX >= canvas.width || // Right border
    snakeY >= canvas.height // Bottom border
  ) {
    clearInterval(game);
    setTimeout(() => {
      alert("Game Over! Your score: " + score);
      location.reload();
    }, 500); // Delay of 0.5 seconds
  }

  // Check if the snake collides with itself
  if (collision(newHead, snake)) {
    clearInterval(game);
    setTimeout(() => {
      alert("Game Over! Your score: " + score);
      location.reload();
    }, 500); // Delay of 0.5 seconds
  }

  snake.unshift(newHead);

  // Display the score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

// Check for collision
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

// Control the snake using buttons
upButton.addEventListener("click", () => {
  if (direction !== "DOWN") direction = "UP";
});
downButton.addEventListener("click", () => {
  if (direction !== "UP") direction = "DOWN";
});
leftButton.addEventListener("click", () => {
  if (direction !== "RIGHT") direction = "LEFT";
});
rightButton.addEventListener("click", () => {
  if (direction !== "LEFT") direction = "RIGHT";
});

// Control the snake using keyboard
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Start the game when the button is clicked
startButton.addEventListener("click", () => {
  if (game) clearInterval(game); // Prevent multiple intervals
  startButton.style.display = "none"; // Hide the start button
  canvas.style.display = "block"; // Show the canvas
  document.querySelectorAll(".controls").forEach((control) => {
    control.style.display = "flex"; // Show the control buttons
  });
  game = setInterval(draw, 200); // Start the game loop
});