const board = document.getElementById('board');
const cube = document.getElementById('cube');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const navLeft = document.getElementById('navLeft');
const navRight = document.getElementById('navRight');
const playPauseBtn = document.getElementById('playPauseBtn');

const GAP = 6;
const TILE_SIZE = 76;
const PADDING = 9;

const GAME_STATES = { IDLE: 'idle', PLAYING: 'playing', PAUSED: 'paused', WON: 'won' };
const PAGES = { HELP: 'help', GAME: 'game', THEMES: 'themes' };

let tiles = [];
let emptyIndex = 15;
let moves = 0;
let seconds = 0;
let timerInterval = null;
let tileElements = [];
let confettiAnimation = null;

let gameState = GAME_STATES.IDLE;
let currentPage = PAGES.GAME;

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
            'tile-hover-shadow': 'rgba(78, 204, 163, 0.4)'
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
            'tile-hover-shadow': 'rgba(255, 0, 255, 0.5)'
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
            'tile-hover-shadow': 'rgba(255, 179, 186, 0.5)'
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
            'tile-hover-shadow': 'rgba(231, 111, 81, 0.5)'
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
            'tile-hover-shadow': 'rgba(144, 224, 239, 0.5)'
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
            'tile-hover-shadow': `${tileBg1}80`
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
    document.querySelectorAll('.theme-swatch-large').forEach(swatch => {
        swatch.classList.toggle('active', swatch.dataset.theme === themeName);
    });
}

function createLargeThemeSwatches() {
    const grid = document.getElementById('themesFace');
    let existingGrid = grid.querySelector('.theme-swatches-grid');
    if (existingGrid) existingGrid.remove();
    
    const swatchGrid = document.createElement('div');
    swatchGrid.className = 'theme-swatches-grid';
    
    Object.entries(themes).forEach(([key, theme]) => {
        const swatch = document.createElement('div');
        swatch.className = 'theme-swatch-large';
        swatch.dataset.theme = key;
        swatch.dataset.name = theme.name;
        swatch.style.background = `linear-gradient(145deg, ${theme.colors['tile-bg-1']}, ${theme.colors['tile-bg-2']})`;
        if (currentTheme === key) swatch.classList.add('active');
        swatch.addEventListener('click', () => applyTheme(key));
        swatchGrid.appendChild(swatch);
    });
    
    const randomSwatch = document.createElement('div');
    randomSwatch.className = 'theme-swatch-large random-swatch';
    randomSwatch.dataset.theme = 'random';
    randomSwatch.dataset.name = 'Random';
    if (currentTheme === 'random') randomSwatch.classList.add('active');
    randomSwatch.addEventListener('click', () => applyTheme('random'));
    swatchGrid.appendChild(randomSwatch);
    
    grid.appendChild(swatchGrid);
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

function updateCubeRotation() {
    switch (currentPage) {
        case PAGES.HELP:
            cube.style.transform = 'rotateY(-90deg)';
            break;
        case PAGES.GAME:
            cube.style.transform = 'rotateY(0deg)';
            break;
        case PAGES.THEMES:
            cube.style.transform = 'rotateY(90deg)';
            break;
    }
}

function updateNavArrows() {
    navRight.classList.toggle('disabled', currentPage === PAGES.HELP);
    navLeft.classList.toggle('disabled', currentPage === PAGES.THEMES);
}

function updatePlayPauseBtn() {
    playPauseBtn.classList.toggle('paused', gameState === GAME_STATES.PLAYING);
}

function updateRecordingIndicator() {
    const isRecording = timerInterval !== null;
    playPauseBtn.classList.toggle('playing', isRecording);
}

function goToPage(page) {
    currentPage = page;
    updateCubeRotation();
    updateNavArrows();
}

function goLeft() {
    if (currentPage === PAGES.GAME) {
        goToPage(PAGES.THEMES);
    } else if (currentPage === PAGES.HELP) {
        goToPage(PAGES.GAME);
    }
}

function goRight() {
    if (currentPage === PAGES.GAME) {
        goToPage(PAGES.HELP);
    } else if (currentPage === PAGES.THEMES) {
        goToPage(PAGES.GAME);
    }
}

function isOnGamePage() {
    return currentPage === PAGES.GAME;
}

function isGameActive() {
    return gameState === GAME_STATES.PLAYING;
}

function isGamePaused() {
    return gameState === GAME_STATES.PAUSED;
}

function isGameIdle() {
    return gameState === GAME_STATES.IDLE;
}

function isGameWon() {
    return gameState === GAME_STATES.WON;
}

function resetToIdle() {
    tiles = Array.from({ length: 16 }, (_, i) => (i === 15 ? 0 : i + 1));
    emptyIndex = 15;
    gameState = GAME_STATES.IDLE;
    moves = 0;
    seconds = 0;
    stopTimer();
    movesDisplay.textContent = '0';
    timerDisplay.textContent = '0:00';
    unblurTiles();
    board.classList.remove('playing');
    createTiles();
    playPauseBtn.classList.remove('playing');
    updatePlayPauseBtn();
}

function blurTiles() {
    tileElements.forEach(({ element }) => {
        if (!element.classList.contains('empty')) {
            element.classList.add('blurred');
        }
    });
}

function unblurTiles() {
    tileElements.forEach(({ element }) => {
        element.classList.remove('blurred');
    });
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    updateRecordingIndicator();
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    updateRecordingIndicator();
}

function updateTimer() {
    seconds++;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
}

function init() {
    tiles = Array.from({ length: 16 }, (_, i) => (i === 15 ? 0 : i + 1));
    emptyIndex = 15;
    gameState = GAME_STATES.IDLE;
    moves = 0;
    seconds = 0;
    stopTimer();
    movesDisplay.textContent = '0';
    timerDisplay.textContent = '0:00';
    removeWinMessage();
    unblurTiles();
    board.classList.remove('playing');
    createTiles();
    createLargeThemeSwatches();
    applyTheme(loadTheme());
    goToPage(PAGES.GAME);
    updatePlayPauseBtn();
}

function newGame() {
    if (!isOnGamePage()) return;
    
    removeWinMessage();
    gameState = GAME_STATES.PLAYING;
    
    do {
        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }
        emptyIndex = tiles.indexOf(0);
    } while (!isSolvable() || isSolved());
    
    moves = 0;
    seconds = 0;
    stopTimer();
    startTimer();
    movesDisplay.textContent = '0';
    timerDisplay.textContent = '0:00';
    unblurTiles();
    board.classList.remove('playing');
    createTiles();
    updatePlayPauseBtn();
    board.classList.add('playing');
}

function pauseGame() {
    if (!isOnGamePage()) return;
    if (gameState !== GAME_STATES.PLAYING) return;
    
    stopTimer();
    gameState = GAME_STATES.PAUSED;
    blurTiles();
    updatePlayPauseBtn();
    board.classList.remove('playing');
}

function resumeGame() {
    if (!isOnGamePage()) return;
    if (gameState !== GAME_STATES.PAUSED) return;
    
    startTimer();
    gameState = GAME_STATES.PLAYING;
    unblurTiles();
    board.classList.add('playing');
    updatePlayPauseBtn();
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
    if (!isOnGamePage()) return;
    if (!isGameActive()) return;
    if (!canMove(index)) return;
    
    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
    emptyIndex = index;
    moves++;
    movesDisplay.textContent = moves;
    
    updateTilePositions();
    
    if (checkWin()) {
        stopTimer();
        gameState = GAME_STATES.WON;
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
    const existingBanner = document.getElementById('winBanner');
    if (existingBanner) existingBanner.remove();
    
    const banner = document.createElement('div');
    banner.className = 'win-banner';
    banner.id = 'winBanner';
    banner.innerHTML = `
        <h2>Congratulations!</h2>
        <p>Moves: ${moves} | Time: ${timerDisplay.textContent}</p>
        <p class="win-hint">Press Enter or Escape</p>
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

navLeft.addEventListener('click', goLeft);
navRight.addEventListener('click', goRight);
playPauseBtn.addEventListener('click', () => {
    if (isGameActive()) {
        pauseGame();
    } else if (isGamePaused()) {
        resumeGame();
    } else if (isGameIdle()) {
        newGame();
    }
});

document.addEventListener('keydown', (e) => {
    
    if (e.key === 'Escape') {
        e.preventDefault();
        
        if (isGameWon()) {
            removeWinMessage();
            resetToIdle();
            return;
        }
        
        if (currentPage === PAGES.HELP || currentPage === PAGES.THEMES) {
            goToPage(PAGES.GAME);
            return;
        }
        
        resetToIdle();
        return;
    }
    
    if (e.key === 'Enter') {
        e.preventDefault();
        
        if (isGameWon()) {
            removeWinMessage();
            resetToIdle();
            return;
        }
        
        if (currentPage === PAGES.HELP || currentPage === PAGES.THEMES) {
            goToPage(PAGES.GAME);
            return;
        }
        
        if (isOnGamePage()) {
            if (isGameActive()) {
                pauseGame();
            } else if (isGamePaused()) {
                resumeGame();
            } else if (isGameIdle()) {
                newGame();
            }
        }
        return;
    }
     
    if (!isOnGamePage()) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goLeft();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            goRight();
        }
        return;
    }
    
    if (!isGameActive()) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goLeft();
            return;
        }
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            goRight();
            return;
        }
        return;
    }
    
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
