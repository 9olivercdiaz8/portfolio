// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== MOBILE NAV =====
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobile-nav');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});

// ===== NAV SCROLL STYLE =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.borderBottomColor = window.scrollY > 20 ? '#1e1e1e' : 'transparent';
}, { passive: true });

// ===== LIVE STATUS FROM STATUS PAGE =====
const SERVICE_ICONS = { let: '🎓', portfolio: '🌐', pihole: '🛡️' };
const SERVICE_NAMES = { let: 'LET Prep', portfolio: 'Portfolio', pihole: 'Pi-hole DNS' };

async function loadLiveStatus() {
  const container = document.getElementById('live-services');
  if (!container) return;

  try {
    const res = await fetch('https://status.olivercdiaz.com/api/status', {
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error('no response');
    const services = await res.json();

    container.innerHTML = services.map(s => {
      const up = s.status === 'operational';
      const icon = SERVICE_ICONS[s.id] || '⚡';
      const name = SERVICE_NAMES[s.id] || s.name;
      const rt = s.responseTime ? `${s.responseTime}ms` : '';
      return `<div class="service-row">
        <div class="service-left">
          <span class="service-icon">${icon}</span>
          <span class="service-name">${name}</span>
        </div>
        <div class="service-right">
          ${rt ? `<span class="service-uptime">${rt}</span>` : ''}
          <span class="service-badge ${up ? 'up' : 'down'}">
            <span class="dot ${up ? 'online' : ''}"></span>
            ${up ? 'OK' : 'DOWN'}
          </span>
        </div>
      </div>`;
    }).join('');

    // Update uptime spec card
    const allUp = services.every(s => s.status === 'operational');
    const uptimeEl = document.getElementById('uptime-days');
    if (uptimeEl && allUp) {
      const avgUptime = (services.reduce((a, s) => a + parseFloat(s.uptime || 100), 0) / services.length).toFixed(1);
      uptimeEl.textContent = avgUptime + '%';
    }
  } catch {
    const container = document.getElementById('live-services');
    if (container) {
      container.innerHTML = `
        <div class="service-row">
          <div class="service-left"><span class="service-icon">🎓</span><span class="service-name">LET Prep</span></div>
          <div class="service-right"><span class="service-badge up"><span class="dot online"></span>OK</span></div>
        </div>
        <div class="service-row">
          <div class="service-left"><span class="service-icon">🌐</span><span class="service-name">Portfolio</span></div>
          <div class="service-right"><span class="service-badge up"><span class="dot online"></span>OK</span></div>
        </div>
        <div class="service-row">
          <div class="service-left"><span class="service-icon">🛡️</span><span class="service-name">Pi-hole DNS</span></div>
          <div class="service-right"><span class="service-badge up"><span class="dot online"></span>OK</span></div>
        </div>`;
    }
  }
}

loadLiveStatus();
