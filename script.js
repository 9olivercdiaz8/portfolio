// ===== i18n =====
const T = {
  es: {
    'nav-about': 'Sobre mí', 'nav-exp': 'Experiencia', 'nav-projects': 'Proyectos',
    'nav-homelab': 'Homelab', 'nav-contact': 'Contacto',
    'sb-checking': 'Comprobando servicios…', 'sb-link': 'Ver estado →',
    'sb-all-ok': 'Todos los sistemas operativos', 'sb-down': 'caído', 'sb-down-pl': 'caídos', 'sb-unavail': 'Estado no disponible',
    'hero-location': 'Barcelona, España',
    'hero-sub': 'Redes, Linux y automatización. Si puede hacerse automático,<br class="br-desk"> lo hago automático.',
    'hero-cta1': 'Ver proyectos', 'hero-cta2': 'Contacto',
    'sec-about': '01 — Sobre mí',
    'about-h2': 'Developer curioso<br>con base en Barcelona.',
    'about-p1': 'Me muevo entre redes, sistemas Linux y automatización. Trabajo con infraestructura real — VPNs, DNS, servidores propios, bots y apps que corren 24/7 en hardware que tengo en casa.',
    'about-p2': 'Si algo se repite más de dos veces, escribo un script. Si algo puede estar siempre disponible, lo levanto en mi Pi.',
    'skill-sys': 'Sistemas & Red', 'skill-code': 'Código',
    'sec-exp': '02 — Experiencia', 'exp-h2': 'Donde he trabajado.',
    'irium-role': 'Help Desk & IT Consultant · Dept. Educació Catalunya', 'irium-date': '2024 — Actual',
    'irium-desc': "Consultoría IT para el Departament d'Educació de la Generalitat de Catalunya.",
    'netland-role': 'Técnico IT', 'netland-desc': 'Instalación y mantenimiento de redes, soporte técnico y administración de infraestructura informática.',
    'plastic-role': 'IT & Sistemas', 'plastic-desc': 'Mantenimiento de sistemas internos, soporte a usuarios y gestión de equipos e infraestructura de red.',
    'sec-proj': '03 — Proyectos', 'proj-h2': 'Lo que he construido.', 'proj-sub': 'Proyectos reales, todos en producción.',
    'let-desc': 'PWA de estudio para el examen de profesores de Filipinas. SRS (repetición espaciada), exámenes mock, biblioteca de 760MB de PDFs, notas personales y 119 fichas de estudio por tema.',
    'pibot-desc': 'Bot de Telegram para gestionar la Raspberry Pi remotamente. Controla WireGuard, monitorea IP pública, actualiza DNS dinámico y hace backups automáticos a Google Drive.',
    'sf-desc': 'Bot autónomo para Shakes & Fidget. Gestiona arena, quests, herrería, mascotas y subterráneo. +5.000 líneas de Python con estrategias matemáticas propias para cada modo de juego.',
    'status-desc': 'Monitor de estado en tiempo real para mis servicios. WebSocket para updates live sin recargar, historial de uptime de 90 días y soporte en 3 idiomas.',
    'remedy-desc': 'Bot de automatización completa para Remedy ITSM. Sin API — usa scraping de navegador para leer, categorizar y resolver incidencias automáticamente. Genera respuestas en el idioma correcto listas para pegar, con umbral de confianza configurable, detección de VIPs y kill switch de seguridad.',
    'sec-hl': '04 — Homelab', 'hl-h2': 'Infraestructura propia.',
    'hl-sub': 'Raspberry Pi 5 · 8GB · Debian 13 · corriendo 24/7',
    'hl-loading': 'Cargando estado en vivo…', 'hl-backup': 'Backups diarios',
    'stat-uptime-label': 'Uptime', 'stat-disk': 'Disco', 'stat-temp': 'Temperatura',
    'sec-contact': '05 — Contacto', 'contact-h2': 'Hablemos.',
    'contact-desc': '¿Tienes un proyecto, una propuesta o simplemente quieres hablar de IT? Aquí me tienes.',
  },
  ca: {
    'nav-about': 'Sobre mi', 'nav-exp': 'Experiència', 'nav-projects': 'Projectes',
    'nav-homelab': 'Homelab', 'nav-contact': 'Contacte',
    'sb-checking': 'Comprovant serveis…', 'sb-link': 'Veure estat →',
    'sb-all-ok': 'Tots els sistemes operatius', 'sb-down': 'caigut', 'sb-down-pl': 'caiguts', 'sb-unavail': 'Estat no disponible',
    'hero-location': 'Barcelona, Espanya',
    'hero-sub': 'Xarxes, Linux i automatització. Si es pot fer automàtic,<br class="br-desk"> ho faig automàtic.',
    'hero-cta1': 'Veure projectes', 'hero-cta2': 'Contacte',
    'sec-about': '01 — Sobre mi',
    'about-h2': 'Developer curiós<br>amb base a Barcelona.',
    'about-p1': "Em moc entre xarxes, sistemes Linux i automatització. Treballo amb infraestructura real — VPNs, DNS, servidors propis, bots i apps que funcionen 24/7 en hardware que tinc a casa.",
    'about-p2': "Si alguna cosa es repeteix més de dues vegades, escric un script. Si alguna cosa pot estar sempre disponible, la munto a la meva Pi.",
    'skill-sys': 'Sistemes & Xarxa', 'skill-code': 'Codi',
    'sec-exp': '02 — Experiència', 'exp-h2': 'On he treballat.',
    'irium-role': 'Help Desk & IT Consultant · Dept. Educació Catalunya', 'irium-date': '2024 — Actual',
    'irium-desc': "Consultoria IT per al Departament d'Educació de la Generalitat de Catalunya.",
    'netland-role': 'Tècnic IT', 'netland-desc': "Instal·lació i manteniment de xarxes, suport tècnic i administració d'infraestructura informàtica.",
    'plastic-role': 'IT & Sistemes', 'plastic-desc': "Manteniment de sistemes interns, suport als usuaris i gestió d'equips i infraestructura de xarxa.",
    'sec-proj': '03 — Projectes', 'proj-h2': 'El que he construït.', 'proj-sub': 'Projectes reals, tots en producció.',
    'let-desc': "PWA d'estudi per a l'examen de professors de Filipines. SRS (repetició espaiadal), exàmens simulats, biblioteca de 760MB de PDFs, notes personals i 119 fitxes d'estudi per tema.",
    'pibot-desc': "Bot de Telegram per gestionar la Raspberry Pi remotament. Controla WireGuard, monitoritza la IP pública, actualitza el DNS dinàmic i fa còpies de seguretat automàtiques a Google Drive.",
    'sf-desc': "Bot autònom per a Shakes & Fidget. Gestiona l'arena, quests, ferreria, mascotes i subterrani. +5.000 línies de Python amb estratègies matemàtiques pròpies per a cada mode de joc.",
    'status-desc': "Monitor d'estat en temps real per als meus serveis. WebSocket per a actualitzacions en directe sense recarregar, historial d'uptime de 90 dies i suport en 3 idiomes.",
    'remedy-desc': "Bot d'automatització completa per a Remedy ITSM. Sense API — utilitza scraping del navegador per llegir, categoritzar i resoldre incidències automàticament. Genera respostes en l'idioma correcte llestes per enganxar, amb llindar de confiança configurable, detecció de VIPs i kill switch de seguretat.",
    'sec-hl': '04 — Homelab', 'hl-h2': 'Infraestructura pròpia.',
    'hl-sub': 'Raspberry Pi 5 · 8GB · Debian 13 · funcionant 24/7',
    'hl-loading': 'Carregant estat en directe…', 'hl-backup': 'Còpies de seguretat diàries',
    'stat-uptime-label': 'Uptime', 'stat-disk': 'Disc', 'stat-temp': 'Temperatura',
    'sec-contact': '05 — Contacte', 'contact-h2': 'Parlem.',
    'contact-desc': "Tens un projecte, una proposta o simplement vols parlar d'IT? Aquí em tens.",
  },
  en: {
    'nav-about': 'About', 'nav-exp': 'Experience', 'nav-projects': 'Projects',
    'nav-homelab': 'Homelab', 'nav-contact': 'Contact',
    'sb-checking': 'Checking services…', 'sb-link': 'View status →',
    'sb-all-ok': 'All systems operational', 'sb-down': 'down', 'sb-down-pl': 'down', 'sb-unavail': 'Status unavailable',
    'hero-location': 'Barcelona, Spain',
    'hero-sub': 'Networks, Linux and automation. If it can be automated,<br class="br-desk"> I automate it.',
    'hero-cta1': 'View projects', 'hero-cta2': 'Contact',
    'sec-about': '01 — About',
    'about-h2': 'Curious developer<br>based in Barcelona.',
    'about-p1': 'I work across networks, Linux systems and automation. I build real infrastructure — VPNs, DNS, self-hosted servers, bots and apps running 24/7 on hardware I own.',
    'about-p2': 'If something repeats more than twice, I write a script. If something can always be available, I run it on my Pi.',
    'skill-sys': 'Systems & Network', 'skill-code': 'Code',
    'sec-exp': '02 — Experience', 'exp-h2': "Where I've worked.",
    'irium-role': 'Help Desk & IT Consultant · Dept. Educació Catalunya', 'irium-date': '2024 — Present',
    'irium-desc': "IT consulting for the Department of Education of the Generalitat de Catalunya.",
    'netland-role': 'IT Technician', 'netland-desc': 'Network installation and maintenance, technical support and IT infrastructure administration.',
    'plastic-role': 'IT & Systems', 'plastic-desc': 'Internal systems maintenance, user support and management of equipment and network infrastructure.',
    'sec-proj': '03 — Projects', 'proj-h2': "What I've built.", 'proj-sub': 'Real projects, all in production.',
    'let-desc': 'Study PWA for the Philippine Teachers Licensure Exam. SRS (spaced repetition), mock exams, 760MB PDF library, personal notes and 119 topic study cards.',
    'pibot-desc': 'Telegram bot to manage the Raspberry Pi remotely. Controls WireGuard, monitors public IP, updates dynamic DNS and runs automatic backups to Google Drive.',
    'sf-desc': 'Autonomous bot for Shakes & Fidget. Manages arena, quests, blacksmith, pets and dungeon. 5,000+ lines of Python with custom mathematical strategies for each game mode.',
    'status-desc': 'Real-time status monitor for my services. WebSocket for live updates without reloading, 90-day uptime history and support in 3 languages.',
    'remedy-desc': 'Full automation bot for Remedy ITSM. No API — uses browser scraping to read, categorize and automatically resolve tickets. Generates ready-to-paste responses in the correct language, with configurable confidence threshold, VIP detection and kill switch.',
    'sec-hl': '04 — Homelab', 'hl-h2': 'Own infrastructure.',
    'hl-sub': 'Raspberry Pi 5 · 8GB · Debian 13 · running 24/7',
    'hl-loading': 'Loading live status…', 'hl-backup': 'Daily backups',
    'stat-uptime-label': 'Uptime', 'stat-disk': 'Storage', 'stat-temp': 'Temperature',
    'sec-contact': '05 — Contact', 'contact-h2': "Let's talk.",
    'contact-desc': 'Got a project, a proposal or just want to talk about IT? I\'m here.',
  },
};

function detectLang() {
  const l = navigator.language || 'en';
  if (l.startsWith('ca')) return 'ca';
  if (l.startsWith('es')) return 'es';
  return 'en';
}

function applyLang(lang) {
  const t = T[lang] || T.en;
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  window._lang = lang;
}

applyLang(detectLang());

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ===== MOBILE MENU =====
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ===== SCROLL REVEAL =====
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 70);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

// ===== LIVE STATUS (homelab + status bar) =====
const ICONS = { let: '🎓', portfolio: '🌐', pihole: '🛡️', remedy: '🎫' };
const NAMES = { let: 'LET Prep', portfolio: 'olivercdiaz.com', pihole: 'Pi-hole DNS', remedy: 'Remedy Bot' };

async function fetchStatus() {
  const hl = document.getElementById('hl-services');
  const t = T[window._lang] || T.en;
  try {
    const r = await fetch('https://status.olivercdiaz.com/api/status', { signal: AbortSignal.timeout(7000) });
    if (!r.ok) throw new Error();
    const services = await r.json();

    if (hl) {
      hl.innerHTML = services.map(s => {
        const up = s.status === 'operational';
        return `<div class="hl-row">
          <div class="hl-left-row">
            <span class="hl-row-icon">${ICONS[s.id] || '⚡'}</span>
            <span class="hl-row-name">${NAMES[s.id] || s.name}</span>
          </div>
          <div class="hl-row-right">
            ${s.responseTime ? `<span class="hl-rt">${s.responseTime}ms</span>` : ''}
            <span class="hl-badge ${up ? 'up' : 'down'}">
              <span class="pulse-dot sm" style="${up ? '' : 'background:#f87171;animation:none;box-shadow:none'}"></span>
              ${up ? 'OK' : 'DOWN'}
            </span>
          </div>
        </div>`;
      }).join('');
    }

    const avgUptime = services.reduce((a, s) => a + parseFloat(s.uptime || 100), 0) / services.length;
    const statUp = document.getElementById('stat-uptime');
    if (statUp) statUp.textContent = avgUptime.toFixed(1) + '%';

    // Status bar
    const down = services.filter(s => s.status !== 'operational');
    const dot = document.getElementById('sb-dot');
    const sbText = document.getElementById('sb-text');
    if (dot && sbText) {
      if (down.length === 0) {
        dot.className = 'sb-dot up';
        sbText.textContent = t['sb-all-ok'];
      } else {
        dot.className = 'sb-dot down';
        const word = down.length === 1 ? t['sb-down'] : t['sb-down-pl'];
        sbText.textContent = down.map(s => NAMES[s.id] || s.name).join(', ') + ' ' + word;
      }
    }
  } catch {
    const dot = document.getElementById('sb-dot');
    const sbText = document.getElementById('sb-text');
    if (dot) dot.className = 'sb-dot';
    if (sbText) sbText.textContent = t['sb-unavail'];

    if (hl) hl.innerHTML = ['let','portfolio','pihole','remedy'].map(id => `
      <div class="hl-row">
        <div class="hl-left-row"><span class="hl-row-icon">${ICONS[id]}</span><span class="hl-row-name">${NAMES[id]}</span></div>
        <div class="hl-row-right"><span class="hl-badge up"><span class="pulse-dot sm"></span>OK</span></div>
      </div>`).join('');
  }
}

fetchStatus();
setInterval(fetchStatus, 60000);

// ===== AUTO-UPDATE =====
let _currentVersion = null;
async function checkVersion() {
  try {
    const r = await fetch('/version', { cache: 'no-store', signal: AbortSignal.timeout(5000) });
    if (!r.ok) return;
    const { v } = await r.json();
    if (_currentVersion === null) { _currentVersion = v; return; }
    if (v !== _currentVersion) window.location.reload();
  } catch {}
}
checkVersion();
setInterval(checkVersion, 30000);
