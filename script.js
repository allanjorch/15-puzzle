const board = document.getElementById('board');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const newGameBtn = document.getElementById('newGame');

const GAP = 8;
const TILE_SIZE = 72;
const PADDING = 15;

let tiles = [];
let emptyIndex = 15;
let moves = 0;
let seconds = 0;
let timerInterval = null;
let gameStarted = false;
let gameActive = false;
let tileElements = [];
let confettiAnimation = null;
let gameWon = false;

const CONFETTI_COLORS = ['#4ecca3', '#e74c3c', '#f1c40f', '#3498db', '#9b59b6', '#1abc9c', '#e67e22'];

function init() {
    tiles = Array.from({ length: 16 }, (_, i) => (i === 15 ? 0 : i + 1));
    emptyIndex = 15;
    gameActive = false;
    gameWon = false;
    moves = 0;
    seconds = 0;
    gameStarted = false;
    clearInterval(timerInterval);
    timerInterval = null;
    movesDisplay.textContent = '0';
    timerDisplay.textContent = '0:00';
    removeWinMessage();
    createTiles();
}

function newGame() {
    removeWinMessage();
    gameWon = false;
    gameActive = true;
    
    do {
        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }
        emptyIndex = tiles.indexOf(0);
    } while (!isSolvable() || isSolved());
    
    moves = 0;
    seconds = 0;
    gameStarted = false;
    clearInterval(timerInterval);
    timerInterval = null;
    movesDisplay.textContent = '0';
    timerDisplay.textContent = '0:00';
    createTiles();
}

function isSolvable() {
    let inversions = 0;
    const flatTiles = tiles.filter(t => t !== 0);
    for (let i = 0; i < flatTiles.length; i++) {
        for (let j = i + 1; j < flatTiles.length; j++) {
            if (flatTiles[i] > flatTiles[j]) inversions++;
        }
    }
    const emptyRow = Math.floor(tiles.indexOf(0) / 4);
    if (emptyRow % 2 === 0) {
        return inversions % 2 === 1;
    } else {
        return inversions % 2 === 0;
    }
}

function isSolved() {
    for (let i = 0; i < 15; i++) {
        if (tiles[i] !== i + 1) return false;
    }
    return tiles[15] === 0;
}

function getPosition(index) {
    const row = Math.floor(index / 4);
    const col = index % 4;
    return {
        left: PADDING + col * (TILE_SIZE + GAP),
        top: PADDING + row * (TILE_SIZE + GAP)
    };
}

function createTiles() {
    board.innerHTML = '';
    tileElements = [];
    
    tiles.forEach((value, index) => {
        const tile = document.createElement('div');
        tile.className = 'tile' + (value === 0 ? ' empty' : '');
        tile.textContent = value === 0 ? '' : value;
        
        const pos = getPosition(index);
        tile.style.left = pos.left + 'px';
        tile.style.top = pos.top + 'px';
        
        tile.addEventListener('click', () => moveTileByValue(value));
        board.appendChild(tile);
        tileElements.push({ element: tile, value: value });
    });
}

function updateTilePositions() {
    tileElements.forEach(({ element, value }) => {
        const index = tiles.indexOf(value);
        const pos = getPosition(index);
        element.style.left = pos.left + 'px';
        element.style.top = pos.top + 'px';
    });
}

function moveTileByValue(value) {
    const index = tiles.indexOf(value);
    moveTile(index);
}

function moveTile(index) {
    if (!gameActive) return;
    if (!canMove(index)) return;
    
    if (!gameStarted) {
        gameStarted = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
    
    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
    emptyIndex = index;
    moves++;
    movesDisplay.textContent = moves;
    
    updateTilePositions();
    
    if (checkWin()) {
        clearInterval(timerInterval);
        showWinCelebration();
    }
}

function canMove(index) {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;
    
    const rowDiff = Math.abs(row - emptyRow);
    const colDiff = Math.abs(col - emptyCol);
    
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

function updateTimer() {
    seconds++;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
}

function checkWin() {
    for (let i = 0; i < 15; i++) {
        if (tiles[i] !== i + 1) return false;
    }
    return tiles[15] === 0;
}

function createConfettiCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    document.body.appendChild(canvas);
    return canvas;
}

function showWinCelebration() {
    gameWon = true;
    const existingBanner = document.getElementById('winBanner');
    if (existingBanner) existingBanner.remove();
    
    const banner = document.createElement('div');
    banner.className = 'win-banner';
    banner.id = 'winBanner';
    banner.innerHTML = `
        <h2>Congratulations!</h2>
        <p>Moves: ${moves} | Time: ${timerDisplay.textContent}</p>
        <p style="color: #666; font-size: 0.85rem; margin-top: 0.5rem;">Press Enter or Escape to dismiss</p>
    `;
    board.appendChild(banner);
    
    const canvas = createConfettiCanvas();
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 4,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            speedY: Math.random() * 3 + 2,
            speedX: (Math.random() - 0.5) * 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let activeParticles = 0;
        particles.forEach(p => {
            if (p.y < canvas.height + 50) {
                activeParticles++;
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotationSpeed;
                
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
        });
        
        if (activeParticles > 0) {
            confettiAnimation = requestAnimationFrame(animate);
        }
    }
    
    animate();
    
    setTimeout(() => {
        if (confettiAnimation) {
            cancelAnimationFrame(confettiAnimation);
        }
        canvas.remove();
    }, 5000);
}

function removeWinMessage() {
    const banner = document.getElementById('winBanner');
    const canvas = document.getElementById('confetti-canvas');
    if (banner) banner.remove();
    if (canvas) canvas.remove();
    if (confettiAnimation) {
        cancelAnimationFrame(confettiAnimation);
        confettiAnimation = null;
    }
}

newGameBtn.addEventListener('click', newGame);

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        newGame();
        return;
    }
    
    if (gameWon && (e.key === 'Enter' || e.key === 'Escape')) {
        e.preventDefault();
        const banner = document.getElementById('winBanner');
        if (banner) banner.remove();
        return;
    }
    
    if (!gameActive) return;
    
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;
    let targetIndex = -1;
    
    switch (e.key) {
        case 'ArrowLeft':
            if (emptyCol !== 3) targetIndex = emptyIndex + 1;
            break;
        case 'ArrowRight':
            if (emptyCol !== 0) targetIndex = emptyIndex - 1;
            break;
        case 'ArrowUp':
            if (emptyIndex < 12) targetIndex = emptyIndex + 4;
            break;
        case 'ArrowDown':
            if (emptyIndex >= 4) targetIndex = emptyIndex - 4;
            break;
    }
    
    if (targetIndex >= 0 && targetIndex < 16) {
        e.preventDefault();
        moveTile(targetIndex);
    }
});

init();
