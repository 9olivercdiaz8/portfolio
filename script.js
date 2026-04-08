/* ==================== CONSTELLATION CANVAS ==================== */
const canvas = document.getElementById('constellation');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -1000, y: -1000 };
const PARTICLE_COUNT = 80;
const CONNECT_DIST = 150;
const MOUSE_DIST = 200;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 1.5 + 0.5,
            color: Math.random() > 0.5 ? '0,212,255' : '123,47,247'
        });
    }
}

function drawConstellation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const baseAlpha = isDark ? 1 : 0.5;

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
            const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.02;
            p.vx += dx * force;
            p.vy += dy * force;
        }
        p.vx *= 0.99; p.vy *= 0.99;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${0.5 * baseAlpha})`;
        ctx.fill();

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
            if (d < CONNECT_DIST) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(${p.color},${(1 - d / CONNECT_DIST) * 0.15 * baseAlpha})`;
                ctx.stroke();
            }
        }

        // Mouse connections
        if (dist < MOUSE_DIST * 1.5) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0,212,255,${(1 - dist / (MOUSE_DIST * 1.5)) * 0.2 * baseAlpha})`;
            ctx.stroke();
        }
    }
    requestAnimationFrame(drawConstellation);
}

/* ==================== CUSTOM CURSOR ==================== */
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursor-trail');
let cursorX = 0, cursorY = 0, trailX = 0, trailY = 0;

function updateCursor() {
    trailX += (cursorX - trailX) * 0.15;
    trailY += (cursorY - trailY) * 0.15;
    if (cursor) cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    if (trail) trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
    requestAnimationFrame(updateCursor);
}

document.addEventListener('mousemove', e => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Cursor hover effect
document.addEventListener('mouseover', e => {
    const el = e.target.closest('a, button, .project-card, .skill-tag, .contact-card, .nav-btn');
    if (el && cursor) cursor.classList.add('hover');
});
document.addEventListener('mouseout', e => {
    const el = e.target.closest('a, button, .project-card, .skill-tag, .contact-card, .nav-btn');
    if (el && cursor) cursor.classList.remove('hover');
});

/* ==================== PROJECT CARD GLOW ==================== */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
        card.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
});

/* ==================== LOADER ==================== */
function initLoader() {
    const bar = document.querySelector('.loader-progress');
    const loader = document.getElementById('loader');
    let progress = 0;
    const steps = [20, 45, 70, 90, 100];
    let step = 0;

    const interval = setInterval(() => {
        if (step < steps.length) {
            progress = steps[step++];
            if (bar) bar.style.width = progress + '%';
        }
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                if (loader) loader.classList.add('hidden');
                document.body.style.overflow = '';
            }, 400);
        }
    }, 300);
}

/* ==================== TYPING ANIMATION ==================== */
function typeText(el, texts, speed = 80, pause = 2000) {
    let textIdx = 0, charIdx = 0, deleting = false;

    function tick() {
        const current = texts[textIdx];
        if (!deleting) {
            el.textContent = current.slice(0, ++charIdx);
            if (charIdx === current.length) {
                setTimeout(() => { deleting = true; tick(); }, pause);
                return;
            }
        } else {
            el.textContent = current.slice(0, --charIdx);
            if (charIdx === 0) {
                deleting = false;
                textIdx = (textIdx + 1) % texts.length;
            }
        }
        setTimeout(tick, deleting ? 40 : speed);
    }
    tick();
}

/* ==================== SCROLL REVEAL ==================== */
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ==================== SKILL BARS ==================== */
function initSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const tags = entry.target.querySelectorAll('.skill-tag[data-level]');
                tags.forEach((tag, i) => {
                    setTimeout(() => {
                        tag.classList.add('animated');
                        tag.style.setProperty('--level', tag.dataset.level);
                    }, i * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-category').forEach(cat => observer.observe(cat));
}

/* ==================== NAVBAR ==================== */
function initNavbar() {
    const nav = document.getElementById('navbar');
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    window.addEventListener('scroll', () => {
        // Scrolled state
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);

        // Active section
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 200) current = s.id;
        });
        links.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + current);
        });
    });
}

/* ==================== HAMBURGER ==================== */
function initHamburger() {
    const btn = document.getElementById('nav-hamburger');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        btn.classList.toggle('open');
        menu.classList.toggle('open');
    });

    menu.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('open');
            menu.classList.remove('open');
        });
    });
}

/* ==================== THEME ==================== */
function initTheme() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

/* ==================== i18n ==================== */
const T = {
    en: {
        navAbout:"About",navExp:"Experience",navSkills:"Skills",navProjects:"Projects",navHomelab:"Homelab",navContact:"Contact",
        heroGreeting:"Hi, my name is",heroDesc:"I fix networks, automate what I can, and build the rest from scratch.",heroAvailable:"Available",heroViewWork:"View my work",heroContact:"Get in touch",heroScroll:"Scroll down",
        aboutTitle:"// about",aboutText1:"I'm an IT & Network Specialist based in Barcelona. I manage infrastructure, automate processes, and build self-hosted services that run 24/7 without intervention.",aboutText2:"From hotel network management to running a full homelab with VPNs, Telegram bots, media servers, and game automation \u2014 I enjoy turning complex problems into elegant, automated solutions.",aboutText3:"When I'm not fixing networks, I'm probably writing Python bots or tinkering with my Raspberry Pi.",
        termRole:"IT & Network Specialist",termUptime:"5+ years in IT",termServers:"3 running (Pi + VPS + NAS)",termBots:"6 active Telegram bots",termLines:"20K+ Python written",
        expTitle:"// experience",expDate1:"2024 - Present",expRole1:"Helpdesk Agent",expDesc1:"On-site and remote support for the Department of Education of Catalonia. L1 incident resolution and escalation.",expRole2:"IT Technician",expDesc2:"Managed networks for 8+ hotels. Reduced internet costs by 20% through bandwidth optimization. Decreased incident resolution time by 25%.",expRole3:"IT Technician",expDesc3:"Optimized Active Directory and VMware environments. Reduced service downtime by 10% through preventive maintenance.",
        skillsTitle:"// skills",skillsSystems:"Systems",skillsNetworking:"Networking",skillsDev:"Development",skillsLearning:"Learning",
        projTitle:"// projects",projSubtitle:"Personal infrastructure and automation projects",projLines:"lines",projScrapers:"scrapers",projModules:"modules",projDomains:"domains",projBlocked:"blocked",projInterval:"interval",
        projDFType:"Telegram Media Server",projDFDesc:"Full media server via Telegram with 5,300+ lines of Python. Automated downloads, cloud delivery, Radarr/Sonarr/Prowlarr integration, manga consolidation, and subscription notifications.",
        projFWType:"Anime/Manga Streaming",projFWDesc:"Full streaming platform with Next.js frontend and FastAPI backend. Auto-scan, MKV remux, PGS subtitle OCR, multi-source Spanish scrapers, and real-time episode monitoring.",
        projSFType:"Game Automation",projSFDesc:"Fully autonomous game bot with 6,350+ lines. Custom combat simulator v6.0, arena AI, pet strategy optimizer, fortress automation, and dice multi-roll handler.",
        projBBType:"Horse Racing Automation",projBBDesc:"Automated horse racing tipster bot. Scrapes BlogaBet picks, places bets via Stake.com GraphQL API, tracks P&L, and solves CAPTCHAs for premium picks.",
        projPBType:"Pi Management Bot",projPBDesc:"Telegram bot for full Raspberry Pi management. WireGuard VPN control, Pi-hole admin, service monitoring with auto-restart, Google Drive backups, and hardware alerts.",
        projWGType:"Secure Access Network",projWGDesc:"Personal VPN server on Raspberry Pi with 7 peers. Anti-bufferbloat tuning, Cloudflare DDNS, QR config generation, and automated peer management via Telegram.",
        projPHType:"Network Ad Blocker",projPHDesc:"Network-wide ad blocker running Pi-hole v6. Blocks 770K+ domains including ads, trackers, malware, and crypto-mining for all devices on the network.",
        projSPType:"Service Monitoring",projSPDesc:"Real-time monitoring dashboard for all services. Checks every 30 seconds with uptime history and instant Telegram alerts on downtime.",
        homelabTitle:"// homelab",homelabDesc:"Raspberry Pi 5 server running 24/7",statStatus:"Status",statTemp:"Temp",statMemory:"Memory",statBlocked:"Blocked",statUptime:"Uptime",
        eduTitle:"// education",eduDegree1:"IT Systems & Network Administration",eduDesc1:"Higher Technician Degree - Cybersecurity Profile",eduDegree2:"Microcomputer Systems & Networks",eduDesc2:"Middle Grade Degree",
        certTitle:"// certifications",contactTitle:"// contact",contactDesc:"Let's build something together",footerQuote:"\"I don't need a map - I'll build the route\""
    },
    es: {
        navAbout:"Sobre mi",navExp:"Experiencia",navSkills:"Skills",navProjects:"Proyectos",navHomelab:"Homelab",navContact:"Contacto",
        heroGreeting:"Hola, me llamo",heroDesc:"Arreglo redes, automatizo lo que puedo y construyo el resto desde cero.",heroAvailable:"Disponible",heroViewWork:"Ver proyectos",heroContact:"Contactar",heroScroll:"Scroll",
        aboutTitle:"// sobre mi",aboutText1:"Soy especialista en IT y redes en Barcelona. Gestiono infraestructura, automatizo procesos y monto servicios autoalojados que funcionan 24/7 sin intervencion.",aboutText2:"Desde gestionar redes de hoteles hasta montar un homelab completo con VPNs, bots de Telegram, servidores multimedia y automatizacion de juegos \u2014 me gusta convertir problemas complejos en soluciones automatizadas.",aboutText3:"Cuando no estoy arreglando redes, probablemente estoy programando bots en Python o trasteando con mi Raspberry Pi.",
        termRole:"Especialista IT & Redes",termUptime:"5+ anos en IT",termServers:"3 activos (Pi + VPS + NAS)",termBots:"6 bots Telegram activos",termLines:"20K+ lineas Python",
        expTitle:"// experiencia",expDate1:"2024 - Actualidad",expRole1:"Agente Helpdesk",expDesc1:"Soporte presencial y remoto para el Departament d'Educacio de Catalunya. Resolucion y escalado de incidencias L1.",expRole2:"Tecnico IT",expDesc2:"Gestion de redes en 8+ hoteles. Reduccion del coste de internet un 20% mediante optimizacion de ancho de banda. Reduccion del tiempo de resolucion un 25%.",expRole3:"Tecnico IT",expDesc3:"Optimizacion de entornos Active Directory y VMware. Reduccion del tiempo de inactividad un 10% mediante mantenimiento preventivo.",
        skillsTitle:"// habilidades",skillsSystems:"Sistemas",skillsNetworking:"Redes",skillsDev:"Desarrollo",skillsLearning:"Aprendiendo",
        projTitle:"// proyectos",projSubtitle:"Proyectos personales de infraestructura y automatizacion",projLines:"lineas",projScrapers:"scrapers",projModules:"modulos",projDomains:"dominios",projBlocked:"bloqueado",projInterval:"intervalo",
        projDFType:"Servidor multimedia Telegram",projDFDesc:"Servidor multimedia completo via Telegram con 5.300+ lineas de Python. Descargas automaticas, entrega en la nube, integracion Radarr/Sonarr/Prowlarr, consolidacion de manga y notificaciones.",
        projFWType:"Streaming Anime/Manga",projFWDesc:"Plataforma de streaming completa con frontend Next.js y backend FastAPI. Auto-scan, remux MKV, OCR de subtitulos PGS, scrapers multi-fuente en espanol y monitorizacion de episodios.",
        projSFType:"Automatizacion de juego",projSFDesc:"Bot de juego totalmente autonomo con 6.350+ lineas. Simulador de combate v6.0, IA de arena, optimizador de mascotas, automatizacion de fortaleza y gestor de dados multi-tirada.",
        projBBType:"Automatizacion carreras de caballos",projBBDesc:"Bot automatico de apuestas hipicas. Scrapea picks de BlogaBet, apuesta via API GraphQL de Stake.com, trackea P&L y resuelve CAPTCHAs para picks premium.",
        projPBType:"Bot gestion Pi",projPBDesc:"Bot de Telegram para gestion completa de Raspberry Pi. Control WireGuard VPN, admin Pi-hole, monitorizacion de servicios con auto-restart, backups a Google Drive y alertas de hardware.",
        projWGType:"Red de acceso seguro",projWGDesc:"Servidor VPN personal en Raspberry Pi con 7 peers. Tuning anti-bufferbloat, DDNS Cloudflare, generacion QR de configs y gestion automatizada de peers via Telegram.",
        projPHType:"Bloqueador de anuncios en red",projPHDesc:"Bloqueador de anuncios a nivel de red con Pi-hole v6. Bloquea 770K+ dominios incluyendo anuncios, rastreadores, malware y criptomineria para todos los dispositivos.",
        projSPType:"Monitorizacion de servicios",projSPDesc:"Dashboard de monitorizacion en tiempo real de todos los servicios. Comprueba cada 30 segundos con historial de uptime y alertas instantaneas por Telegram.",
        homelabTitle:"// mi servidor",homelabDesc:"Raspberry Pi 5 funcionando 24/7",statStatus:"Estado",statTemp:"Temp",statMemory:"Memoria",statBlocked:"Bloqueado",statUptime:"Uptime",
        eduTitle:"// formacion",eduDegree1:"Administracion de Sistemas Informaticos en Red",eduDesc1:"Grado Superior - Perfil Ciberseguridad",eduDegree2:"Sistemas Microinformaticos y Redes",eduDesc2:"Grado Medio",
        certTitle:"// certificaciones",contactTitle:"// contacto",contactDesc:"Construyamos algo juntos",footerQuote:"\"No necesito un mapa - construire la ruta\""
    },
    ca: {
        navAbout:"Qui soc",navExp:"Experiencia",navSkills:"Skills",navProjects:"Projectes",navHomelab:"Homelab",navContact:"Contacte",
        heroGreeting:"Hola, em dic",heroDesc:"Reparo xarxes, automatitzo el que puc i munto la resta des de zero.",heroAvailable:"Disponible",heroViewWork:"Veure projectes",heroContact:"Contactar",heroScroll:"Scroll",
        aboutTitle:"// qui soc",aboutText1:"Soc especialista en IT i xarxes a Barcelona. Gestiono infraestructura, automatitzo processos i munto serveis autoallotjats que funcionen 24/7 sense intervencio.",aboutText2:"Des de gestionar xarxes d'hotels fins a muntar un homelab complet amb VPNs, bots de Telegram, servidors multimedia i automatitzacio de jocs \u2014 m'agrada convertir problemes complexos en solucions automatitzades.",aboutText3:"Quan no estic arreglant xarxes, probablement estic programant bots en Python o trastejant amb la meva Raspberry Pi.",
        termRole:"Especialista IT & Xarxes",termUptime:"5+ anys en IT",termServers:"3 actius (Pi + VPS + NAS)",termBots:"6 bots Telegram actius",termLines:"20K+ linies Python",
        expTitle:"// experiencia",expDate1:"2024 - Actual",expRole1:"Agent Helpdesk",expDesc1:"Suport presencial i remot pel Departament d'Educacio de la Generalitat. Resolucio i escalat d'incidencies L1.",expRole2:"Tecnic IT",expDesc2:"Gestio de xarxes a mes de 8 hotels. Reduccio d'un 20% en costos d'internet optimitzant l'ample de banda. Millora d'un 25% en temps de resolucio.",expRole3:"Tecnic IT",expDesc3:"Optimitzacio d'entorns Active Directory i VMware. Reduccio d'un 10% del temps d'inactivitat gracies al manteniment preventiu.",
        skillsTitle:"// competencies",skillsSystems:"Sistemes",skillsNetworking:"Xarxes",skillsDev:"Desenvolupament",skillsLearning:"Aprenent",
        projTitle:"// projectes",projSubtitle:"Projectes personals d'infraestructura i automatitzacio",projLines:"linies",projScrapers:"scrapers",projModules:"moduls",projDomains:"dominis",projBlocked:"bloquejat",projInterval:"interval",
        projDFType:"Servidor multimedia Telegram",projDFDesc:"Servidor multimedia complet via Telegram amb 5.300+ linies de Python. Descarregues automatiques, lliurament al nuvol, integracio Radarr/Sonarr/Prowlarr i notificacions.",
        projFWType:"Streaming Anime/Manga",projFWDesc:"Plataforma de streaming completa amb frontend Next.js i backend FastAPI. Auto-scan, remux MKV, OCR de subtitols PGS i scrapers multi-font en castella.",
        projSFType:"Automatitzacio de joc",projSFDesc:"Bot de joc totalment autonom amb 6.350+ linies. Simulador de combat v6.0, IA d'arena, optimitzador de mascotes i gestor de daus multi-tirada.",
        projBBType:"Automatitzacio curses de cavalls",projBBDesc:"Bot automatic d'apostes hipiques. Scrapeig de picks de BlogaBet, aposta via API GraphQL de Stake.com, tracking P&L i resolucio de CAPTCHAs.",
        projPBType:"Bot gestio Pi",projPBDesc:"Bot de Telegram per gestio completa de Raspberry Pi. Control WireGuard VPN, admin Pi-hole, monitoritzacio de serveis amb auto-restart i backups a Google Drive.",
        projWGType:"Xarxa d'acces segur",projWGDesc:"Servidor VPN personal a Raspberry Pi amb 7 peers. Tuning anti-bufferbloat, DDNS Cloudflare, generacio QR de configs i gestio automatitzada de peers.",
        projPHType:"Bloquejador d'anuncis en xarxa",projPHDesc:"Bloquejador d'anuncis a nivell de xarxa amb Pi-hole v6. Bloqueja 770K+ dominis incloent anuncis, rastreig, malware i criptomineria.",
        projSPType:"Monitoritzacio de serveis",projSPDesc:"Dashboard de monitoritzacio en temps real. Comprova cada 30 segons amb historial d'uptime i alertes instantanies per Telegram.",
        homelabTitle:"// el meu servidor",homelabDesc:"Raspberry Pi 5 funcionant 24/7",statStatus:"Estat",statTemp:"Temp",statMemory:"Memoria",statBlocked:"Bloquejat",statUptime:"Uptime",
        eduTitle:"// formacio",eduDegree1:"Administracio de Sistemes Informatics en Xarxa",eduDesc1:"CFGS - Especialitat en Ciberseguretat",eduDegree2:"Sistemes Microinformatics i Xarxes",eduDesc2:"CFGM",
        certTitle:"// certificacions",contactTitle:"// contacte",contactDesc:"Construim alguna cosa junts",footerQuote:"\"No em cal un mapa - ja em fare el cami\""
    }
};

const typingTexts = {
    en: ["IT & Network Specialist", "Infrastructure Automator", "Self-Hosting Enthusiast", "Python Developer"],
    es: ["Especialista IT & Redes", "Automatizador de infraestructura", "Entusiasta del self-hosting", "Desarrollador Python"],
    ca: ["Especialista IT & Xarxes", "Automatitzador d'infraestructura", "Entusiasta del self-hosting", "Desenvolupador Python"]
};

const langOrder = ['en', 'es', 'ca'];
let currentLang = localStorage.getItem('lang') || (navigator.language.startsWith('ca') ? 'ca' : navigator.language.startsWith('es') ? 'es' : 'en');
let typingTimeout = null;

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    const t = T[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });

    const langBtn = document.querySelector('.lang-text');
    if (langBtn) {
        const next = langOrder[(langOrder.indexOf(lang) + 1) % langOrder.length];
        langBtn.textContent = next.toUpperCase();
    }

    // Restart typing
    const target = document.getElementById('typing-target');
    if (target) {
        if (typingTimeout) clearTimeout(typingTimeout);
        target.textContent = '';
        typeText(target, typingTexts[lang] || typingTexts.en);
    }
}

function initLang() {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;
    setLanguage(currentLang);
    btn.addEventListener('click', () => {
        const next = langOrder[(langOrder.indexOf(currentLang) + 1) % langOrder.length];
        setLanguage(next);
    });
}

/* ==================== PI STATS ==================== */
function $(id) { return document.getElementById(id); }

function setRing(id, value, max) {
    const ring = document.querySelector(`#${id} .ring-fill`);
    if (!ring) return;
    const pct = Math.min(value / max, 1);
    const offset = 264 - (264 * pct);
    ring.style.strokeDashoffset = offset;
}

async function updatePiStats() {
    try {
        const res = await fetch('https://api.olivercdiaz.com/api/stats');
        const d = await res.json();

        $('pi-status').textContent = 'ONLINE';
        $('pi-status').style.color = 'var(--accent3)';
        setRing('ring-status', 100, 100);

        const temp = parseFloat(d.temp) || 0;
        $('pi-temp').textContent = temp + '\u00B0C';
        setRing('ring-temp', temp, 85);

        const mem = parseFloat(d.memory) || 0;
        $('pi-memory').textContent = mem + '%';
        setRing('ring-mem', mem, 100);

        const blocked = parseFloat(d.pihole_percent) || 0;
        $('pi-blocked').textContent = blocked + '%';
        setRing('ring-block', blocked, 100);

        $('pi-uptime').textContent = d.uptime || '--';
        $('wg-peers').textContent = d.peers || '0';
        const heroUp = $('hero-uptime');
        if (heroUp) heroUp.textContent = 'Pi: ' + (d.uptime || '--');

        const domains = d.pihole_domains || 0;
        $('pi-domains').textContent = domains >= 1000 ? Math.round(domains / 1000) + 'K' : domains;

        const pholePct = $('pihole-pct');
        if (pholePct) pholePct.textContent = blocked + '%';
        const wgCount = $('wg-peers-count');
        if (wgCount) wgCount.textContent = d.peers || '7';

    } catch {
        $('pi-status').textContent = 'OFFLINE';
        $('pi-status').style.color = '#ff5f57';
        setRing('ring-status', 0, 100);
    }
}

/* ==================== BACK TO TOP ==================== */
function initBackToTop() {
    const btn = $('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ==================== KONAMI ==================== */
let konamiBuffer = [];
const konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
document.addEventListener('keydown', e => {
    konamiBuffer.push(e.key);
    konamiBuffer = konamiBuffer.slice(-10);
    if (konamiBuffer.join(',') !== konamiSeq.join(',')) return;
    document.body.style.animation = 'rainbow 2s linear infinite';
    const s = document.createElement('style');
    s.textContent = '@keyframes rainbow{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}';
    document.head.appendChild(s);
    setTimeout(() => { document.body.style.animation = ''; s.remove(); }, 5000);
});

/* ==================== SVG GRADIENT DEF ==================== */
function addSVGGradient() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    svg.innerHTML = `<defs><linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#00d4ff"/><stop offset="100%" stop-color="#7b2ff7"/></linearGradient></defs>`;
    document.body.prepend(svg);
}

/* ==================== SMOOTH SCROLL ==================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';
    addSVGGradient();
    initLoader();
    initTheme();
    initLang();
    initNavbar();
    initHamburger();
    initReveal();
    initSkillBars();
    initBackToTop();
    updateCursor();
    updatePiStats();
    setInterval(updatePiStats, 30000);

    const yearEl = $('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

window.addEventListener('load', () => {
    resizeCanvas();
    createParticles();
    drawConstellation();
});

window.addEventListener('resize', resizeCanvas);
