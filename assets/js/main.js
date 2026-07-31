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
  const resume = () => {
    playVideo();
    ['touchstart', 'pointerdown', 'click', 'scroll'].forEach((ev) =>
      window.removeEventListener(ev, resume)
    );
  };
  ['touchstart', 'pointerdown', 'click', 'scroll'].forEach((ev) =>
    window.addEventListener(ev, resume, { passive: true })
  );

  // Resume when the tab/app becomes visible again.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) playVideo();
  });
}

const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
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
