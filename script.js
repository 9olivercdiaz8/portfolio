// ========== PIXEL BACKGROUND ==========
const canvas = document.getElementById('pixels');
const ctx = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 50;
const COLORS = ['#22d3ee', '#a855f7', '#34d399', '#f59e0b'];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticle() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.floor(Math.random() * 3 + 2) * 2,
        speedY: Math.random() * 0.3 + 0.1,
        speedX: (Math.random() - 0.5) * 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2
    };
}

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
    }
}

function drawPixel(x, y, size, color, opacity) {
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.fillRect(
        Math.floor(x / size) * size,
        Math.floor(y / size) * size,
        size,
        size
    );
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulse += 0.02;

        const pulseOpacity = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);
        drawPixel(p.x, p.y, p.size, p.color, pulseOpacity);

        if (p.y < -p.size) {
            particles[i] = createParticle();
            particles[i].y = canvas.height + particles[i].size;
        }
        if (p.x < -p.size || p.x > canvas.width + p.size) {
            particles[i].x = Math.random() * canvas.width;
        }
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(animateParticles);
}

// ========== CLOCK ==========
function updateClock() {
    const clock = document.getElementById('clock');
    if (!clock) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    clock.textContent = `${hours}:${minutes}:${seconds}`;
}

// ========== THEME TOGGLE ==========
function setupThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);

    btn.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

// ========== 8-BIT MUSIC ==========
let audioContext = null;
let musicPlaying = false;
let musicInterval = null;

const melody = [
    { freq: 523, dur: 200 }, { freq: 587, dur: 200 }, { freq: 659, dur: 200 },
    { freq: 698, dur: 200 }, { freq: 784, dur: 400 }, { freq: 659, dur: 200 },
    { freq: 784, dur: 600 }, { freq: 0, dur: 200 },
    { freq: 659, dur: 200 }, { freq: 587, dur: 200 }, { freq: 523, dur: 200 },
    { freq: 587, dur: 200 }, { freq: 659, dur: 400 }, { freq: 523, dur: 200 },
    { freq: 659, dur: 600 }, { freq: 0, dur: 400 }
];

function playNote(freq, duration) {
    if (!audioContext || freq === 0) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'square';
    oscillator.frequency.value = freq;

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration / 1000);
}

function startMusic() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    let noteIndex = 0;
    function playNextNote() {
        if (!musicPlaying) return;

        const note = melody[noteIndex];
        playNote(note.freq, note.dur);

        noteIndex = (noteIndex + 1) % melody.length;
        musicInterval = setTimeout(playNextNote, note.dur);
    }

    playNextNote();
}

function stopMusic() {
    clearTimeout(musicInterval);
}

function setupMusicToggle() {
    const btn = document.getElementById('music-toggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
        musicPlaying = !musicPlaying;
        document.body.classList.toggle('music-playing', musicPlaying);

        if (musicPlaying) {
            startMusic();
        } else {
            stopMusic();
        }
    });
}

// ========== SKILLS ANIMATION ==========
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.getAttribute('data-level');
                entry.target.style.width = level + '%';
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// ========== PI STATS (Simulated) ==========
function updatePiStats() {
    // Simulated stats - in real implementation, fetch from API
    const uptimeDays = Math.floor(Math.random() * 30) + 1;
    const uptimeHours = Math.floor(Math.random() * 24);
    const temp = (40 + Math.random() * 15).toFixed(1);
    const memory = Math.floor(30 + Math.random() * 40);

    document.getElementById('pi-uptime').textContent = `${uptimeDays}d ${uptimeHours}h`;
    document.getElementById('pi-temp').textContent = `${temp}°C`;
    document.getElementById('pi-memory').textContent = `${memory}%`;
}

// ========== SNAKE GAME ==========
const snakeCanvas = document.getElementById('snake-game');
const snakeCtx = snakeCanvas.getContext('2d');
const gameOverlay = document.getElementById('game-overlay');
const highScoreEl = document.getElementById('high-score');

const GRID_SIZE = 20;
const CANVAS_SIZE = 300;
snakeCanvas.width = CANVAS_SIZE;
snakeCanvas.height = CANVAS_SIZE;

let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let gameRunning = false;
let score = 0;
let highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
let gameLoop = null;

highScoreEl.textContent = highScore;

function initGame() {
    snake = [
        { x: 6, y: 7 },
        { x: 5, y: 7 },
        { x: 4, y: 7 }
    ];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    spawnFood();
}

function spawnFood() {
    do {
        food = {
            x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
            y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE))
        };
    } while (snake.some(s => s.x === food.x && s.y === food.y));
}

function drawGame() {
    // Clear
    snakeCtx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-secondary');
    snakeCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid
    snakeCtx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--border-color');
    snakeCtx.lineWidth = 0.5;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
        snakeCtx.beginPath();
        snakeCtx.moveTo(i, 0);
        snakeCtx.lineTo(i, CANVAS_SIZE);
        snakeCtx.stroke();
        snakeCtx.beginPath();
        snakeCtx.moveTo(0, i);
        snakeCtx.lineTo(CANVAS_SIZE, i);
        snakeCtx.stroke();
    }

    // Draw food
    snakeCtx.fillStyle = '#f59e0b';
    snakeCtx.fillRect(food.x * GRID_SIZE + 2, food.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4);

    // Draw snake
    snake.forEach((segment, i) => {
        snakeCtx.fillStyle = i === 0 ? '#22d3ee' : '#34d399';
        snakeCtx.fillRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
    });

    // Draw score
    snakeCtx.fillStyle = '#e4e4e7';
    snakeCtx.font = '12px "Press Start 2P"';
    snakeCtx.fillText(`${score}`, 10, 20);
}

function updateGame() {
    direction = nextDirection;

    const head = { ...snake[0] };

    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= CANVAS_SIZE / GRID_SIZE ||
        head.y < 0 || head.y >= CANVAS_SIZE / GRID_SIZE) {
        gameOver();
        return;
    }

    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        score++;
        spawnFood();
        // Play eat sound
        if (audioContext) {
            playNote(880, 50);
        }
    } else {
        snake.pop();
    }

    drawGame();
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreEl.textContent = highScore;
    }

    gameOverlay.classList.remove('hidden');
    gameOverlay.querySelector('p').textContent = `Game Over! Score: ${score}`;

    // Play game over sound
    if (audioContext) {
        playNote(200, 300);
    }
}

function startGame() {
    initGame();
    gameRunning = true;
    gameOverlay.classList.add('hidden');
    gameLoop = setInterval(updateGame, 120);
    drawGame();
}

function setupGameControls() {
    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !gameRunning) {
            startGame();
            return;
        }

        if (!gameRunning) return;

        switch (e.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 's':
            case 'arrowdown':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'a':
            case 'arrowleft':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'd':
            case 'arrowright':
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    });

    // Touch controls
    let touchStartX = 0;
    let touchStartY = 0;

    snakeCanvas.addEventListener('touchstart', (e) => {
        if (!gameRunning) {
            startGame();
            return;
        }
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    snakeCanvas.addEventListener('touchmove', (e) => {
        if (!gameRunning) return;
        e.preventDefault();

        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 30 && direction !== 'left') nextDirection = 'right';
            else if (dx < -30 && direction !== 'right') nextDirection = 'left';
        } else {
            if (dy > 30 && direction !== 'up') nextDirection = 'down';
            else if (dy < -30 && direction !== 'down') nextDirection = 'up';
        }

        touchStartX = touchEndX;
        touchStartY = touchEndY;
    }, { passive: false });

    // Click to start
    gameOverlay.addEventListener('click', () => {
        if (!gameRunning) startGame();
    });
}

// ========== TYPING EFFECT ==========
function typeWriter() {
    const tagline = document.querySelector('.tagline');
    if (!tagline) return;

    const text = tagline.textContent;
    tagline.textContent = '';
    tagline.style.borderRight = '2px solid var(--accent-primary)';

    let i = 0;
    function type() {
        if (i < text.length) {
            tagline.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50);
        } else {
            setTimeout(() => {
                tagline.style.borderRight = 'none';
            }, 2000);
        }
    }

    setTimeout(type, 500);
}

// ========== KONAMI CODE ==========
let konamiCode = [];
const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konami.join(',')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// ========== INIT ==========
window.addEventListener('load', () => {
    resize();
    initParticles();
    animateParticles();

    updateClock();
    setInterval(updateClock, 1000);

    setupThemeToggle();
    setupMusicToggle();
    animateSkills();
    updatePiStats();
    setupGameControls();
    typeWriter();

    // Draw initial game state
    initGame();
    drawGame();
});

window.addEventListener('resize', resize);
