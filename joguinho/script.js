// script.js
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const appleImg = new Image();
appleImg.src = 'img/maca.png';
const gramaImg = new Image();
gramaImg.src = 'img/grama.jpg';


// grade: 20 células (400px / 20 = 20px por célula)
const tileCount = 20;
const tileSize = canvas.width / tileCount;

let cobrinha = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];

let dir = { x: 1, y: 0 };       // direção atual
let nextDir = { x: 1, y: 0 };   // direção que o jogador quer (lock para evitar reversão)
let food = { x: 0, y: 0 };      // posição da comida
let score = 0;
let speed = 120;                // ms entre frames (ajustável via select)
let gameInterval = null;
let running = false;

// --- util: gera posição aleatória que não esteja sobre a cobra
function placeFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);

  for (let s of cobrinha) {
    if (s.x === food.x && s.y === food.y) {
      // se bateu na cobra, tenta de novo
      placeFood();
      return;
    }
  }
}

// --- desenha tudo
function draw() {
  // fundo
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // comida
  
  if (appleImg.complete) {
  ctx.drawImage(appleImg, food.x * tileSize, food.y * tileSize, tileSize, tileSize);
} else {
  // fallback: quadrado vermelho enquanto imagem carrega
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize - 1, tileSize - 1);
}

  // cobra
  ctx.fillStyle = '#27ae60';
  for (let i = 0; i < cobrinha.length; i++) {
    const s = cobrinha[i];
    ctx.fillRect(s.x * tileSize, s.y * tileSize, tileSize - 1, tileSize - 1);
  }
}

// --- atualiza estado do jogo (movimentação, colisões, comer)
function update() {
  // aplica próxima direção se não for reverso
  if (!(nextDir.x === -dir.x && nextDir.y === -dir.y)) {
    dir = nextDir;
  }

  const head = { x: cobrinha[0].x + dir.x, y: cobrinha[0].y + dir.y };

  // colisão com paredes -> fim de jogo
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver();
    return;
  }

  // colisão com o próprio corpo -> fim de jogo
  for (let segment of cobrinha) {
    if (segment.x === head.x && segment.y === head.y) {
      gameOver();
      return;
    }
  }

  // move snake (adiciona a cabeça)
  cobrinha.unshift(head);

  // comeu?
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').innerText = score;
    // opcional: aumentar velocidade conforme pontuação (exemplo)
    // speed = Math.max(40, speed - 1);
    placeFood();
  } else {
    // remove a cauda (mantém mesmo tamanho)
    cobrinha.pop();
  }
}

// --- fim de jogo
function gameOver() {
  running = false;
  clearInterval(gameInterval);
  alert('Game Over! Pontuação: ' + score);
}

// --- controles do jogo
function start() {
  if (running) return;
  running = true;
  if (cobrinha.length === 0) resetState();
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
  // estado inicial
  cobrinha = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score = 0;
  document.getElementById('score').innerText = score;
  placeFood();
  draw();
}

// --- helper caso necessário
function resetState() {
  cobrinha = [
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

// --- eventos teclado (setas + WASD)
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      nextDir = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      nextDir = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      nextDir = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      nextDir = { x: 1, y: 0 };
      break;
  }
});

// --- botões UI
document.getElementById('start').addEventListener('click', start);
document.getElementById('pause').addEventListener('click', pause);
document.getElementById('restart').addEventListener('click', restart);
document.getElementById('speed').addEventListener('change', (e) => {
  speed = parseInt(e.target.value, 10);
  if (running) {
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      update();
      draw();
    }, speed);
  }
});

// inicializa
window.addEventListener('load', () => {
  placeFood();
  draw();
});