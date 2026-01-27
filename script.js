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
    if (document.hidden) {
        requestAnimationFrame(animateParticles);
        return;
    }
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

// i18n
const translations = {
    en: {
        pageTitle: "Oliver C. Díaz | IT & Network Specialist",
        tagline: "IT & Network Specialist",
        location: "Barcelona, Spain",
        status: "Available for opportunities",
        aboutTitle: "// about",
        aboutText: "I fix networks, automate what I can, and build the rest from scratch. From managing hotel infrastructure to running my own homelab with VPNs, bots, and self-hosted services — I like systems that work and stay working.",
        expTitle: "// experience",
        expDate1: "2024 - Present",
        expRole1: "Helpdesk Agent",
        expDesc1: "On-site and remote support for the Department of Education of Catalonia. L1 incident resolution and escalation.",
        expRole2: "IT Technician",
        expDesc2: "Managed networks for 8+ hotels. Reduced internet costs by 20% through bandwidth optimization. Decreased incident resolution time by 25%.",
        expRole3: "IT Technician",
        expDesc3: "Optimized Active Directory and VMware environments. Reduced service downtime by 10% through preventive maintenance.",
        skillsTitle: "// skills",
        skillsSystems: "Systems",
        skillsNetworking: "Networking",
        skillsDev: "Development",
        eduTitle: "// education",
        eduDegree1: "IT Systems & Network Administration",
        eduDesc1: "Higher Technician Degree — Cybersecurity Profile",
        eduDegree2: "Microcomputer Systems & Networks",
        eduDesc2: "Middle Grade Degree",
        certTitle: "// certifications",
        homelabTitle: "// homelab",
        homelabDesc: "Personal Raspberry Pi server running 24/7",
        statStatus: "Status",
        statUptime: "Uptime",
        statTemp: "Temp",
        statMemory: "Memory",
        statBlocked: "Blocked",
        statBlocklist: "Blocklist",
        projTitle: "// projects",
        projPibotDesc: "Telegram bot for remote Raspberry Pi management. Controls WireGuard VPN, Pi-hole v6, monitors public IP, and auto-updates dynamic DNS.",
        projWgDesc: "Personal VPN server for secure remote access. Client management via Telegram with QR code generation.",
        projCfDesc: "Secure tunnel exposing local services to the internet without opening ports. Powers this site's live stats API.",
        projPiholeDesc: "Network-wide ad blocker running Pi-hole v6. Blocks 770K+ domains across ads, trackers, malware, and crypto-mining for all devices on the network.",
        contactTitle: "// contact",
        footerQuote: "\"I don't need a map — I'll build the route\"",
        cvBtn: "Download CV"
    },
    es: {
        pageTitle: "Oliver C. Díaz | Especialista IT & Redes",
        tagline: "Especialista IT & Redes",
        location: "Barcelona, España",
        status: "Disponible para oportunidades",
        aboutTitle: "// sobre mí",
        aboutText: "Arreglo redes, automatizo lo que puedo y construyo el resto desde cero. De gestionar infraestructura en hoteles a montar mi propio homelab con VPNs, bots y servicios autoalojados — me gustan los sistemas que funcionan y siguen funcionando.",
        expTitle: "// experiencia",
        expDate1: "2024 - Actualidad",
        expRole1: "Agente Helpdesk",
        expDesc1: "Soporte presencial y remoto para el Departament d'Educació de Catalunya. Resolución y escalado de incidencias L1.",
        expRole2: "Técnico IT",
        expDesc2: "Gestión de redes en 8+ hoteles. Reducción del coste de internet un 20% mediante optimización de ancho de banda. Reducción del tiempo de resolución de incidencias un 25%.",
        expRole3: "Técnico IT",
        expDesc3: "Optimización de entornos Active Directory y VMware. Reducción del tiempo de inactividad un 10% mediante mantenimiento preventivo.",
        skillsTitle: "// habilidades",
        skillsSystems: "Sistemas",
        skillsNetworking: "Redes",
        skillsDev: "Desarrollo",
        eduTitle: "// formación",
        eduDegree1: "Administración de Sistemas Informáticos en Red",
        eduDesc1: "Grado Superior — Perfil Ciberseguridad",
        eduDegree2: "Sistemas Microinformáticos y Redes",
        eduDesc2: "Grado Medio",
        certTitle: "// certificaciones",
        homelabTitle: "// homelab",
        homelabDesc: "Servidor personal Raspberry Pi funcionando 24/7",
        statStatus: "Estado",
        statUptime: "Uptime",
        statTemp: "Temp",
        statMemory: "Memoria",
        statBlocked: "Bloqueado",
        statBlocklist: "Blocklist",
        projTitle: "// proyectos",
        projPibotDesc: "Bot de Telegram para gestión remota de Raspberry Pi. Controla WireGuard VPN, Pi-hole v6, monitoriza IP pública y actualiza DNS dinámico automáticamente.",
        projWgDesc: "Servidor VPN personal para acceso remoto seguro. Gestión de clientes vía Telegram con generación de códigos QR.",
        projCfDesc: "Túnel seguro que expone servicios locales a internet sin abrir puertos. Alimenta la API de estadísticas en vivo de esta web.",
        projPiholeDesc: "Bloqueador de anuncios a nivel de red con Pi-hole v6. Bloquea más de 770K dominios entre anuncios, rastreadores, malware y criptominería para todos los dispositivos de la red.",
        contactTitle: "// contacto",
        footerQuote: "\"No necesito un mapa — construiré la ruta\"",
        cvBtn: "Descargar CV"
    }
};

let currentLang = localStorage.getItem('lang') || (navigator.language.startsWith('es') ? 'es' : 'en');

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;

    const t = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });

    const titleKey = document.querySelector('[data-i18n-title]');
    if (titleKey && t[titleKey.getAttribute('data-i18n-title')]) {
        document.title = t[titleKey.getAttribute('data-i18n-title')];
    }

    const langBtn = document.querySelector('.lang-text');
    if (langBtn) langBtn.textContent = lang === 'en' ? 'ES' : 'EN';
}

function setupLangToggle() {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;
    setLanguage(currentLang);
    btn.addEventListener('click', () => setLanguage(currentLang === 'en' ? 'es' : 'en'));
}

function setupThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

// Pi stats
function $(id) { return document.getElementById(id); }

async function updatePiStats() {
    try {
        const res = await fetch('https://api.olivercdiaz.com/api/stats');
        const d = await res.json();

        $('pi-status').textContent = 'ONLINE';
        $('pi-status').classList.add('online');
        $('pi-uptime').textContent = d.uptime;
        $('pi-temp').textContent = d.temp + '°C';
        $('pi-memory').textContent = d.memory + '%';
        $('wg-peers').textContent = d.peers || 0;
        $('pi-pihole-blocked').textContent = (d.pihole_blocked || 0).toLocaleString();
        $('pi-pihole-percent').textContent = (d.pihole_percent || 0) + '%';

        const domains = d.pihole_domains || 0;
        $('pi-pihole-domains').textContent = domains >= 1000 ? Math.round(domains / 1000) + 'K' : domains;

        localStorage.setItem('piStats', JSON.stringify({
            uptime: d.uptime, temp: d.temp, memory: d.memory,
            peers: d.peers || 0, pihole_blocked: d.pihole_blocked || 0,
            pihole_percent: d.pihole_percent || 0, pihole_domains: d.pihole_domains || 0
        }));
    } catch {
        $('pi-status').textContent = 'OFFLINE';
        $('pi-status').classList.remove('online');

        const cached = localStorage.getItem('piStats');
        if (!cached) return;
        const d = JSON.parse(cached);

        $('pi-uptime').textContent = d.uptime + '*';
        $('pi-temp').textContent = d.temp + '°C*';
        $('pi-memory').textContent = d.memory + '%*';
        $('wg-peers').textContent = d.peers + '*';
        $('pi-pihole-blocked').textContent = (d.pihole_blocked || 0).toLocaleString() + '*';
        $('pi-pihole-percent').textContent = (d.pihole_percent || 0) + '%*';

        const domains = d.pihole_domains || 0;
        $('pi-pihole-domains').textContent = (domains >= 1000 ? Math.round(domains / 1000) + 'K' : domains) + '*';
    }
}

setInterval(updatePiStats, 30000);


// Konami
let konamiBuffer = [];
const konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

document.addEventListener('keydown', (e) => {
    konamiBuffer.push(e.key);
    konamiBuffer = konamiBuffer.slice(-10);
    if (konamiBuffer.join(',') !== konamiSeq.join(',')) return;

    document.body.style.animation = 'rainbow 2s linear infinite';
    const s = document.createElement('style');
    s.textContent = '@keyframes rainbow { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }';
    document.head.appendChild(s);
    setTimeout(() => { document.body.style.animation = ''; }, 5000);
});

// Back to top
function setupBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupLangToggle();
    setupBackToTop();

    document.documentElement.classList.remove('loading');
    document.documentElement.classList.add('ready');

    updatePiStats();
});

window.addEventListener('load', () => {
    resize();
    initParticles();
    animateParticles();
});

window.addEventListener('resize', resize);
