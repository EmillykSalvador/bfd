const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const paoImg = new Image();
paoImg.src = 'img/pao.jpg';
const gramaImg = new Image();
gramaImg.src = 'img/grama.jpg'; 
const paImg = new Image();
paImg.src = 'img/pato.png';


const tileCount = 15;
let tileSize = canvas.width / tileCount;

let patinho = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];

let dir = { x: 1, y: 0 };
let nextDir = { x: 1, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let speed = 120;
let gameInterval = null;
let running = false;

function placeFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);

  for (let s of patinho) {
    if (s.x === food.x && s.y === food.y) {
      placeFood();
      return;
    }
  }
}

function draw() {
  if (gramaImg.complete) {
    ctx.drawImage(gramaImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (paoImg.complete) {
    ctx.drawImage(paoImg, food.x * tileSize, food.y * tileSize, tileSize, tileSize);
  } else {
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize - 1, tileSize - 1);
  }

  for (let s of patinho) {
  if (paImg.complete) {
    ctx.drawImage(paImg, s.x * tileSize, s.y * tileSize, tileSize, tileSize);
  } else {
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(s.x * tileSize, s.y * tileSize, tileSize - 1, tileSize - 1);
  }
}}

function update() {
  if (!(nextDir.x === -dir.x && nextDir.y === -dir.y)) {
    dir = nextDir;
  }

  const head = { x: patinho[0].x + dir.x, y: patinho[0].y + dir.y };

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver();
    return;
  }

  for (let segment of patinho) {
    if (segment.x === head.x && segment.y === head.y) {
      gameOver();
      return;
    }
  }

  patinho.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').innerText = score;
    placeFood();
  } else {
    patinho.pop();
  }
}

function gameOver() {
  running = false;
  clearInterval(gameInterval);
  alert('Game Over! Pontuação: ' + score);
}

function start() {
  if (running) return;
  running = true;
  if (patinho.length === 0) resetState();
  if (!food.x && !food.y) placeFood();
  gameInterval = setInterval(() => {
    update();
    draw();
  }, speed);
}

function pause() {
  if (!running) return;
  running = false;
  clearInterval(gameInterval);
}

function restart() {
  running = false;
  clearInterval(gameInterval);
  resetState();
  draw();
}

function resetState() {
  patinho = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score = 0;
  document.getElementById('score').innerText = score;
  placeFood();
}

// Teclado
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp': case 'w': case 'W': nextDir = { x: 0, y: -1 }; break;
    case 'ArrowDown': case 's': case 'S': nextDir = { x: 0, y: 1 }; break;
    case 'ArrowLeft': case 'a': case 'A': nextDir = { x: -1, y: 0 }; break;
    case 'ArrowRight': case 'd': case 'D': nextDir = { x: 1, y: 0 }; break;
  }
});

// Botões
document.getElementById('start').addEventListener('click', start);
document.getElementById('pause').addEventListener('click', pause);
document.getElementById('restart').addEventListener('click', restart);
document.getElementById('speed').addEventListener('change', (e) => {
  speed = parseInt(e.target.value, 10);
  if (running) {
    clearInterval(gameInterval);
    gameInterval = setInterval(() => { update(); draw(); }, speed);
  }
});

// Inicializa
window.addEventListener('load', () => {
  placeFood();
  draw();
});
