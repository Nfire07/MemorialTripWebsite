/* ========= NAV underline animata al link attivo ========= */
(() => {
  const nav = document.getElementById('days-nav');
  if (!nav) return;

  const underline = nav.querySelector('.nav-underline');
  const links = [...nav.querySelectorAll('.days a')];
  if (!underline || links.length === 0) return;

  function moveUnderline(el) {
    const r = el.getBoundingClientRect();
    const parentR = nav.querySelector('.days').getBoundingClientRect();
    underline.style.width = r.width + 'px';
    underline.style.transform = `translateX(${r.left - parentR.left}px)`;
  }

  const active = links.find(a => a.classList.contains('active')) || links[0];
  moveUnderline(active);

  links.forEach(a => {
    a.addEventListener('mouseenter', () => moveUnderline(a));
    a.addEventListener('mouseleave', () => moveUnderline(active));
    a.addEventListener('focus', () => moveUnderline(a));
    a.addEventListener('blur', () => moveUnderline(active));
  });
  window.addEventListener('resize', () => moveUnderline(active));
})();

/* ========= Rivelazione card con IntersectionObserver ========= */
(() => {
  const cards = document.querySelectorAll('.card');
  if (!cards.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .12 });

  cards.forEach(c => io.observe(c));
})();

/* ========= COLLAPSIBLE “Leggi di più” con animazione fluida ========= */
(() => {
  document.querySelectorAll('[data-toggle]').forEach(btn => {
    const id = btn.getAttribute('data-toggle');
    const panel = document.getElementById(id);
    if (!panel) return;

    const open = () => {
      panel.hidden = false;
      panel.getBoundingClientRect(); // reflow
      panel.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      btn.textContent = 'Mostra meno';
    };
    const close = () => {
      panel.classList.remove('open');
      const onEnd = (e) => {
        if (e.propertyName === 'grid-template-rows') {
          panel.hidden = true;
          panel.removeEventListener('transitionend', onEnd);
        }
      };
      panel.addEventListener('transitionend', onEnd);
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = 'Leggi di più';
    };

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      expanded ? close() : open();
    });
  });
})();

/* ========= Scroll a sezione via hash (#id) ========= */
(() => {
  const hash = location.hash.replace('#', '');
  if (!hash) return;

  const card = document.getElementById(hash);
  if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
})();

/* ========= Photo carousel (detail pages) ========= */
(() => {
  const carousels = document.querySelectorAll('.carousel');
  if (!carousels.length) return;

  carousels.forEach((carousel) => {
    const track = carousel.querySelector('.carousel-track');
    const slides = [...carousel.querySelectorAll('.slide')];
    const prev = carousel.querySelector('.carousel-btn.prev');
    const next = carousel.querySelector('.carousel-btn.next');
    if (!track || slides.length === 0 || !prev || !next) return;

    // Legge l'indice iniziale (data-start="2") e lo normalizza
    const startAttr = carousel.getAttribute('data-start');
    const startIndexRaw = startAttr !== null ? parseInt(startAttr, 10) : 0;
    let index = Number.isFinite(startIndexRaw) ? startIndexRaw : 0;
    index = Math.max(0, Math.min(slides.length - 1, index));

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;
      prev.setAttribute('aria-disabled', String(prev.disabled));
      next.setAttribute('aria-disabled', String(next.disabled));
    };

    const go = (delta) => {
      index = Math.max(0, Math.min(slides.length - 1, index + delta));
      update();
    };

    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));

    // Keyboard support when focused inside the carousel
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    });

    // Make focus possible
    if (!carousel.hasAttribute('tabindex')) carousel.setAttribute('tabindex', '0');

    update();
  });
})();
