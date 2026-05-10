/* ============================================================
   MNS PORTFOLIO — script.js
   All interactive behaviour — no frameworks
   ============================================================ */

'use strict';

/* ── 1. Navbar scroll state ──────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── 2. Mobile hamburger / drawer ────────────────────────── */
(function initMobileMenu() {
  const btn    = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  if (!btn || !drawer) return;

  const toggle = () => {
    const open = btn.classList.toggle('is-open');
    drawer.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
  };

  btn.addEventListener('click', toggle);

  // Close on any drawer link click
  drawer.querySelectorAll('.m-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('is-open');
      drawer.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    });
  });
})();


/* ── 3. Typewriter effect ────────────────────────────────── */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Data Analyst & Frontend Developer.',
    'Transforming data into decisions.',
    'Dashboards that actually make sense.',
    'Code that tells a story.',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  const type = () => {
    if (paused) return;

    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;

      if (charIdx === current.length) {
        paused = true;
        setTimeout(() => { deleting = true; paused = false; }, 2200);
      } else {
        setTimeout(type, 60 + Math.random() * 40);
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 380);
      } else {
        setTimeout(type, 32);
      }
    }
  };

  // Start after hero title animation settles
  setTimeout(type, 900);
})();


/* ── 4. Intersection Observer — scroll reveals ───────────── */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.js-reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings in the same parent
          const siblings = Array.from(
            entry.target.closest('.skills-grid, .work-grid, .about-grid, .contact-inner, .about-text-col, .contact-text') ?.querySelectorAll('.js-reveal') ?? []
          );
          const idx = siblings.indexOf(entry.target);
          const delay = Math.max(0, idx * 80);

          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(t => observer.observe(t));
})();


/* ── 5. Skill cards — tilt + dynamic accent border ──────── */
(function initSkillCards() {
  const cards = document.querySelectorAll('.js-tilt');
  if (!cards.length) return;

  cards.forEach(card => {
    const accent = card.dataset.accent || '#6366f1';

    card.addEventListener('mouseenter', () => {
      card.classList.add('is-hovered');
      card.style.setProperty('--card-accent', accent);
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-hovered');
      card.style.removeProperty('--card-accent');
      card.style.transform = '';
    });

    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = e.clientX - rect.left;
      const cy     = e.clientY - rect.top;
      const hw     = rect.width  / 2;
      const hh     = rect.height / 2;
      const rotX   = ((cy - hh) / hh) * -6;  // max ±6deg
      const rotY   = ((cx - hw) / hw) *  6;

      // Percentage for the radial gradient spotlight
      const pctX = ((cx / rect.width)  * 100).toFixed(1);
      const pctY = ((cy / rect.height) * 100).toFixed(1);
      card.style.setProperty('--mx', `${pctX}%`);
      card.style.setProperty('--my', `${pctY}%`);

      card.style.transform =
        `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });
  });
})();


/* ── 6. Magnetic buttons ─────────────────────────────────── */
(function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn--primary, .btn--ghost');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx   = e.clientX - (rect.left + rect.width  / 2);
      const dy   = e.clientY - (rect.top  + rect.height / 2);
      btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();


/* ── 7. Contact form — floating labels + submit ──────────── */
(function initContactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#f87171';
        valid = false;
        input.addEventListener('input', () => {
          input.style.borderColor = '';
        }, { once: true });
      }
    });
    if (!valid) return;

    // Simulate send
    submitBtn.disabled = true;
    submitBtn.style.opacity = '.7';

    setTimeout(() => {
      submitBtn.classList.add('is-success');
      submitBtn.style.opacity = '';
      submitBtn.disabled = false;
      form.reset();

      setTimeout(() => {
        submitBtn.classList.remove('is-success');
      }, 4000);
    }, 1200);
  });
})();


/* ── 8. Active nav link on scroll ────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.style.color = 'var(--text-primary)';
            }
          });
        }
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach(s => observer.observe(s));
})();


/* ── 9. Smooth anchor scroll (offset for sticky header) ─── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const offset = 74;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();