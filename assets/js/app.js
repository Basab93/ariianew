// ======================================================
// ARIIA 2026 — App JS (Bootstrap-based, no jQuery)
// ======================================================

// 1) Mark that JS is enabled (for progressive enhancement)
document.documentElement.classList.add('js');

// 2) Optional: safely set slide backgrounds from data-bg
//    <div class="carousel-item" data-bg="images/MU Jaipur.jpg"></div>
document.querySelectorAll('.carousel-item[data-bg]').forEach(el => {
  const src = el.getAttribute('data-bg');
  if (src) el.style.backgroundImage = `url('${encodeURI(src)}')`;
});

// 3) Navbar scroll effect (adds .scrolled)
(() => {
  const nav = document.querySelector('.custom-navbar');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// 4) Reveal-on-scroll (fails open if IO unsupported)
(() => {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  // Respect user preference
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    els.forEach(el => el.classList.add('in'));
    return;
  }

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  els.forEach(el => io.observe(el));

  // Safety net
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
  }, 2000);
})();

// 5) Back-to-top button
(() => {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggle = () => {
    if (window.scrollY > 300) btn.classList.add('show');
    else btn.classList.remove('show');
  };
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// 6) Collapse mobile navbar on nav-link click (Bootstrap)
(() => {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const bsCollapse = bootstrap.Collapse.getInstance(nav);
      if (bsCollapse) bsCollapse.hide();
    });
  });
})();

// 7) Countdown (supports both "big card" and slim info-band)
//    Big card IDs:  cd-days, cd-hours, cd-minutes, cd-seconds
//    Slim band IDs: days,   hours,   minutes,   seconds
(() => {
  // Change this once in one place:
  const TARGET_TIME = new Date('December 18, 2026 09:00:00').getTime();

  // Detect which set of elements exists
  const big = {
    d: document.getElementById('cd-days'),
    h: document.getElementById('cd-hours'),
    m: document.getElementById('cd-minutes'),
    s: document.getElementById('cd-seconds'),
    live: document.getElementById('cd-live')
  };
  const slim = {
    d: document.getElementById('days'),
    h: document.getElementById('hours'),
    m: document.getElementById('minutes'),
    s: document.getElementById('seconds'),
    live: document.getElementById('cd-live')
  };

  const hasBig = big.d && big.h && big.m && big.s;
  const hasSlim = slim.d && slim.h && slim.m && slim.s;
  if (!hasBig && !hasSlim) return;

  const setVals = (d,h,m,s) => {
    const pad = n => String(n).padStart(2, '0');
    if (hasBig) {
      big.d.textContent = pad(d);
      big.h.textContent = pad(h);
      big.m.textContent = pad(m);
      big.s.textContent = pad(s);
    }
    if (hasSlim) {
      slim.d.textContent = pad(d);
      slim.h.textContent = pad(h);
      slim.m.textContent = pad(m);
      slim.s.textContent = pad(s);
    }
    const live = (hasBig && big.live) ? big.live : (hasSlim && slim.live ? slim.live : null);
    if (live) live.textContent = `${d} days, ${h} hours, ${m} minutes and ${s} seconds until ARIIA 2026.`;
  };

  let last = { d: null, h: null, m: null, s: null }; // for minimal DOM updates
  const tick = () => {
    const now = Date.now();
    let diff = Math.max(0, TARGET_TIME - now);

    const S = 1000, M = 60*S, H = 60*M, D = 24*H;
    const d = Math.floor(diff / D); diff -= d*D;
    const h = Math.floor(diff / H); diff -= h*H;
    const m = Math.floor(diff / M); diff -= m*M;
    const s = Math.floor(diff / S);

    // Only update when values change
    if (d!==last.d || h!==last.h || m!==last.m || s!==last.s) {
      setVals(d,h,m,s);
      last = { d,h,m,s };
    }

    if (now >= TARGET_TIME) {
      clearInterval(timer);
      // Optional: swap to "Live" message if big card present
      const grid = document.querySelector('.countdown-card .count-grid');
      if (grid) grid.innerHTML = '<div class="text-center w-100"><h3 class="fw-bold m-0">ARIIA 2026 is Live</h3><p class="mb-0">Welcome to the conference — join us now.</p></div>';
    }
  };

  tick();
  const timer = setInterval(tick, 250); // smooth & efficient (4x/sec)
})();
