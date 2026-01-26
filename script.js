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
        size: Math.floor(Math.random() * 3 + 2) * 2, // Pixel sizes: 4, 6, 8
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
    // Draw pixel-perfect square
    ctx.fillRect(
        Math.floor(x / size) * size,
        Math.floor(y / size) * size,
        size,
        size
    );
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
        // Update position
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulse += 0.02;

        // Pulsing opacity
        const pulseOpacity = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);

        // Draw particle
        drawPixel(p.x, p.y, p.size, p.color, pulseOpacity);

        // Reset if off screen
        if (p.y < -p.size) {
            particles[i] = createParticle();
            particles[i].y = canvas.height + particles[i].size;
        }
        if (p.x < -p.size || p.x > canvas.width + p.size) {
            particles[i].x = Math.random() * canvas.width;
        }
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
}

// ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card, .contact-link').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// ========== CURSOR GLOW EFFECT ==========
function setupCursorGlow() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// ========== TYPING EFFECT FOR TAGLINE ==========
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
            // Blink cursor then remove
            setTimeout(() => {
                tagline.style.borderRight = 'none';
            }, 2000);
        }
    }

    setTimeout(type, 500);
}

// ========== INIT ==========
window.addEventListener('load', () => {
    resize();
    initParticles();
    animate();
    setupScrollAnimations();
    setupCursorGlow();
    typeWriter();
});

window.addEventListener('resize', () => {
    resize();
});

// ========== KONAMI CODE EASTER EGG ==========
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
