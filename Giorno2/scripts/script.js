/* ========= NAV underline animata al link attivo ========= */
const nav = document.getElementById('days-nav');
const underline = nav.querySelector('.nav-underline');
const links = [...nav.querySelectorAll('.days a')];

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

/* ========= Rivelazione card con IntersectionObserver ========= */
const cards = document.querySelectorAll('.card');
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
        }
    });
}, { threshold: .12 });
cards.forEach(c => io.observe(c));

/* ========= COLLAPSIBLE “Leggi di più” con animazione fluida ========= */
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

/* ========= Scroll a sezione via hash (#id) ========= */
const hash = location.hash.replace('#', '');
if (hash) {
    const card = document.getElementById(hash);
    if (card) { card.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}