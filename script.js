const board = document.getElementById('board');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const newGameBtn = document.getElementById('newGame');
const container = document.getElementById('container');
const focusHint = document.getElementById('focusHint');

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
let focusMode = false;

const CONFETTI_COLORS = ['#4ecca3', '#e74c3c', '#f1c40f', '#3498db', '#9b59b6', '#1abc9c', '#e67e22'];

const themes = {
    teal: {
        name: 'Teal',
        colors: {
            'bg-gradient-start': '#1a1a2e',
            'bg-gradient-end': '#16213e',
            'board-bg': '#0f0f23',
            'tile-bg-1': '#4ecca3',
            'tile-bg-2': '#3db892',
            'tile-text': '#1a1a2e',
            'accent': '#4ecca3',
            'tile-hover-shadow': 'rgba(78, 204, 163, 0.4)',
            'button-shadow': 'rgba(78, 204, 163, 0.4)'
        }
    },
    neon: {
        name: 'Neon',
        colors: {
            'bg-gradient-start': '#0a0a0a',
            'bg-gradient-end': '#1a0a2e',
            'board-bg': '#0f0f0f',
            'tile-bg-1': '#ff00ff',
            'tile-bg-2': '#00ffff',
            'tile-text': '#000000',
            'accent': '#ff00ff',
            'tile-hover-shadow': 'rgba(255, 0, 255, 0.5)',
            'button-shadow': 'rgba(0, 255, 255, 0.5)'
        }
    },
    pastel: {
        name: 'Pastel',
        colors: {
            'bg-gradient-start': '#fdf6f0',
            'bg-gradient-end': '#f0e6e0',
            'board-bg': '#ffffff',
            'tile-bg-1': '#ffb3ba',
            'tile-bg-2': '#bae1ff',
            'tile-text': '#555555',
            'accent': '#ffb3ba',
            'tile-hover-shadow': 'rgba(255, 179, 186, 0.5)',
            'button-shadow': 'rgba(186, 225, 255, 0.5)'
        }
    },
    retro: {
        name: 'Retro',
        colors: {
            'bg-gradient-start': '#d4a574',
            'bg-gradient-end': '#8b6914',
            'board-bg': '#3d2914',
            'tile-bg-1': '#e76f51',
            'tile-bg-2': '#f4a261',
            'tile-text': '#ffffff',
            'accent': '#e76f51',
            'tile-hover-shadow': 'rgba(231, 111, 81, 0.5)',
            'button-shadow': 'rgba(244, 162, 97, 0.5)'
        }
    },
    ocean: {
        name: 'Ocean',
        colors: {
            'bg-gradient-start': '#023e8a',
            'bg-gradient-end': '#0077b6',
            'board-bg': '#03045e',
            'tile-bg-1': '#00b4d8',
            'tile-bg-2': '#90e0ef',
            'tile-text': '#ffffff',
            'accent': '#90e0ef',
            'tile-hover-shadow': 'rgba(144, 224, 239, 0.5)',
            'button-shadow': 'rgba(0, 180, 216, 0.5)'
        }
    }
};

let currentTheme = 'teal';
let randomPalette = null;

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function generateRandomPalette() {
    const baseHue = Math.floor(Math.random() * 360);
    const harmony = Math.floor(Math.random() * 4);
    
    let hue1, hue2;
    switch (harmony) {
        case 0:
            hue1 = baseHue;
            hue2 = (baseHue + 30) % 360;
            break;
        case 1:
            hue1 = baseHue;
            hue2 = (baseHue + 180) % 360;
            break;
        case 2:
            hue1 = baseHue;
            hue2 = (baseHue + 120) % 360;
            break;
        default:
            hue1 = baseHue;
            hue2 = (baseHue + 60) % 360;
    }
    
    const saturation = 50 + Math.floor(Math.random() * 40);
    const lightness = 45 + Math.floor(Math.random() * 20);
    
    const tileBg1 = hslToHex(hue1, saturation, lightness);
    const tileBg2 = hslToHex(hue2, saturation, lightness);
    const accent = hslToHex(hue1, saturation + 10, lightness + 15);
    
    const darken = (hex, amount) => {
        const num = parseInt(hex.slice(1), 16);
        const r = Math.max(0, (num >> 16) - amount);
        const g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
        const b = Math.max(0, (num & 0x0000FF) - amount);
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    };
    
    const bgHue = (baseHue + 180) % 360;
    const bgSat = Math.min(100, saturation - 20);
    const bgLight = 8 + Math.floor(Math.random() * 10);
    const bgLight2 = bgLight + 15 + Math.floor(Math.random() * 10);
    
    const tileTextLightness = lightness > 50 ? 10 : 90;
    const tileText = hslToHex(baseHue, 20, tileTextLightness);
    
    const hoverLight = Math.floor(lightness / 2);
    const tileHoverShadow = `${tileBg1}${Math.round(hoverLight * 2.55).toString(16).padStart(2, '0')}`;
    
    return {
        name: 'Random',
        colors: {
            'bg-gradient-start': hslToHex(bgHue, bgSat, bgLight),
            'bg-gradient-end': hslToHex(bgHue, bgSat, bgLight2),
            'board-bg': darken(hslToHex(bgHue, bgSat, bgLight), 5),
            'tile-bg-1': tileBg1,
            'tile-bg-2': tileBg2,
            'tile-text': tileText,
            'accent': accent,
            'tile-hover-shadow': `${tileBg1}80`,
            'button-shadow': `${tileBg2}80`
        }
    };
}

function applyTheme(themeName) {
    let theme;
    if (themeName === 'random') {
        randomPalette = generateRandomPalette();
        theme = randomPalette;
    } else {
        theme = themes[themeName];
        randomPalette = null;
    }
    
    if (!theme) return;
    
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
    });
    
    currentTheme = themeName;
    saveTheme(themeName);
    
    document.querySelectorAll('.theme-swatch').forEach(swatch => {
        swatch.classList.toggle('active', swatch.dataset.theme === themeName);
    });
}

function createThemeSwatches() {
    const selector = document.getElementById('themeSelector');
    selector.innerHTML = '';
    
    Object.entries(themes).forEach(([key, theme]) => {
        const swatch = document.createElement('div');
        swatch.className = 'theme-swatch';
        swatch.dataset.theme = key;
        swatch.dataset.name = theme.name;
        swatch.style.background = `linear-gradient(145deg, ${theme.colors['tile-bg-1']}, ${theme.colors['tile-bg-2']})`;
        swatch.addEventListener('click', () => applyTheme(key));
        selector.appendChild(swatch);
    });
    
    const randomSwatch = document.createElement('div');
    randomSwatch.className = 'theme-swatch random-swatch';
    randomSwatch.dataset.theme = 'random';
    randomSwatch.dataset.name = 'Random';
    randomSwatch.addEventListener('click', () => applyTheme('random'));
    selector.appendChild(randomSwatch);
}

function saveTheme(themeName) {
    localStorage.setItem('puzzleTheme', themeName);
    if (themeName === 'random') {
        localStorage.setItem('puzzleRandomPalette', JSON.stringify(randomPalette));
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('puzzleTheme') || 'teal';
    const savedRandom = localStorage.getItem('puzzleRandomPalette');
    
    if (savedTheme === 'random' && savedRandom) {
        try {
            randomPalette = JSON.parse(savedRandom);
        } catch {
            randomPalette = null;
        }
    }
    
    return savedTheme;
}

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
    createThemeSwatches();
    applyTheme(loadTheme());
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
        } else {
            canvas.remove();
            confettiAnimation = null;
        }
    }
    
    animate();
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

focusHint.addEventListener('click', () => {
    toggleFocusMode();
});

function toggleFocusMode() {
    focusMode = !focusMode;
    container.classList.toggle('focus-mode', focusMode);
}

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        newGame();
        return;
    }
    
    if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFocusMode();
        return;
    }
    
    if (focusMode && (e.key === 'Enter' || e.key === 'Escape')) {
        e.preventDefault();
        toggleFocusMode();
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
