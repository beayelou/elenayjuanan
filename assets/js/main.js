/* Always open the page at the top, even on reload (browsers otherwise
   restore the previous scroll position and land mid-page). */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => {
  if (!location.hash) window.scrollTo(0, 0);
});

/* Hero background video — coax mobile browsers into autoplaying.
   iOS Safari / Android need muted+playsinline AND, when autoplay is
   blocked, a nudge on the first user interaction. */
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  heroVideo.muted = true;            // set the property, not just the attribute
  heroVideo.defaultMuted = true;
  heroVideo.setAttribute('muted', '');
  heroVideo.playsInline = true;

  const playVideo = () => {
    const attempt = heroVideo.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => { /* blocked — will retry on interaction */ });
    }
  };

  playVideo();
  heroVideo.addEventListener('loadeddata', playVideo, { once: true });
  heroVideo.addEventListener('canplay', playVideo, { once: true });

  // Fallback: start playback on the first interaction if autoplay was blocked.
  const interactions = ['touchstart', 'touchend', 'pointerdown', 'click', 'scroll', 'keydown'];
  const resume = () => {
    playVideo();
    interactions.forEach((ev) => window.removeEventListener(ev, resume));
  };
  interactions.forEach((ev) => window.addEventListener(ev, resume, { passive: true }));

  // Resume when the tab/app becomes visible again.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) playVideo();
  });
}

const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

const setNav = (isOpen) => {
  siteNav.classList.toggle('is-open', isOpen);
  navToggle.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('nav-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
};

navToggle.addEventListener('click', () => {
  setNav(!siteNav.classList.contains('is-open'));
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setNav(false));
});

// Close the menu with the Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && siteNav.classList.contains('is-open')) setNav(false);
});

/* Reveal sections on scroll — opt-in so no-JS keeps everything visible */
const revealables = document.querySelectorAll('.band');
const staticMode = location.search.includes('static');
if ('IntersectionObserver' in window && !staticMode && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealables.forEach((el) => {
    el.classList.add('reveal');
    io.observe(el);
  });
}
