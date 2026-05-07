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

// ===== LIVE STATUS =====
const ICONS = { let: '🎓', portfolio: '🌐', pihole: '🛡️' };
const NAMES = { let: 'LET Prep', portfolio: 'olivercdiaz.com', pihole: 'Pi-hole DNS' };

async function fetchStatus() {
  const el = document.getElementById('hl-services');
  if (!el) return;
  try {
    const r = await fetch('https://status.olivercdiaz.com/api/status', {
      signal: AbortSignal.timeout(7000)
    });
    if (!r.ok) throw new Error();
    const services = await r.json();
    el.innerHTML = services.map(s => {
      const up = s.status === 'operational';
      const icon = ICONS[s.id] || '⚡';
      const name = NAMES[s.id] || s.name;
      const rt = s.responseTime ? `${s.responseTime}ms` : '';
      return `<div class="hl-row">
        <div class="hl-left-row">
          <span class="hl-row-icon">${icon}</span>
          <span class="hl-row-name">${name}</span>
        </div>
        <div class="hl-row-right">
          ${rt ? `<span class="hl-rt">${rt}</span>` : ''}
          <span class="hl-badge ${up ? 'up' : 'down'}">
            <span class="pulse-dot sm" style="${up ? '' : 'background:#f87171;animation:none;box-shadow:none'}"></span>
            ${up ? 'OK' : 'DOWN'}
          </span>
        </div>
      </div>`;
    }).join('');

    const avgUptime = services.reduce((a, s) => a + parseFloat(s.uptime || 100), 0) / services.length;
    const statUptime = document.getElementById('stat-uptime');
    if (statUptime) statUptime.textContent = avgUptime.toFixed(1) + '%';
  } catch {
    if (el) el.innerHTML = `
      <div class="hl-row"><div class="hl-left-row"><span class="hl-row-icon">🎓</span><span class="hl-row-name">LET Prep</span></div><div class="hl-row-right"><span class="hl-badge up"><span class="pulse-dot sm"></span>OK</span></div></div>
      <div class="hl-row"><div class="hl-left-row"><span class="hl-row-icon">🌐</span><span class="hl-row-name">olivercdiaz.com</span></div><div class="hl-row-right"><span class="hl-badge up"><span class="pulse-dot sm"></span>OK</span></div></div>
      <div class="hl-row"><div class="hl-left-row"><span class="hl-row-icon">🛡️</span><span class="hl-row-name">Pi-hole DNS</span></div><div class="hl-row-right"><span class="hl-badge up"><span class="pulse-dot sm"></span>OK</span></div></div>`;
  }
}

fetchStatus();
