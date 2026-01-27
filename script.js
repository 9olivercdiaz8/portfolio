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

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);

    btn.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

// ========== PI STATS (Real API) ==========
async function updatePiStats() {
    try {
        const response = await fetch('https://api.olivercdiaz.com/api/stats');
        const data = await response.json();

        document.getElementById('pi-status').textContent = 'ONLINE';
        document.getElementById('pi-status').classList.add('online');
        document.getElementById('pi-uptime').textContent = data.uptime;
        document.getElementById('pi-temp').textContent = `${data.temp}°C`;
        document.getElementById('pi-memory').textContent = `${data.memory}%`;
        document.getElementById('wg-peers').textContent = data.peers || 0;

        // Guardar último estado conocido
        localStorage.setItem('piStats', JSON.stringify({
            uptime: data.uptime,
            temp: data.temp,
            memory: data.memory,
            peers: data.peers || 0,
            timestamp: Date.now()
        }));
    } catch (error) {
        document.getElementById('pi-status').textContent = 'OFFLINE';
        document.getElementById('pi-status').classList.remove('online');

        // Mostrar último estado conocido
        const lastStats = localStorage.getItem('piStats');
        if (lastStats) {
            const data = JSON.parse(lastStats);
            document.getElementById('pi-uptime').textContent = `${data.uptime}*`;
            document.getElementById('pi-temp').textContent = `${data.temp}°C*`;
            document.getElementById('pi-memory').textContent = `${data.memory}%*`;
            document.getElementById('wg-peers').textContent = `${data.peers}*`;
        }
    }
}

// Update stats every 30 seconds
setInterval(updatePiStats, 30000);

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
    updatePiStats();
    typeWriter();
});

window.addEventListener('resize', resize);
