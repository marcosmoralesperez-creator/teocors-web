import { animate, inView, stagger } from 'motion';
import { openDialog } from './dialogs.js';

const ease = [0.22, 1, 0.36, 1];

export function setupHeader() {
  const header = document.querySelector('[data-header]');
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  update();
  window.addEventListener('scroll', update, { passive: true });

  // Highlight the nav link of the section in view.
  const links = [...document.querySelectorAll('[data-nav]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href')));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          const on = a.getAttribute('href') === `#${entry.target.id}`;
          a.classList.toggle('is-active', on);
          if (on) a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => s && io.observe(s));

  const menu = document.querySelector('#mobile-nav');
  document.querySelector('[data-menu-open]').addEventListener('click', () => openDialog(menu));
}

export function setupReveals({ reducedMotion }) {
  if (reducedMotion) return;
  inView(
    '[data-reveal]',
    (el) => {
      animate(el, { opacity: [0, 1], transform: ['translateY(28px)', 'translateY(0px)'] }, { duration: 1, ease });
    },
    { margin: '0px 0px -12% 0px' },
  );
  const grid = document.querySelector('[data-product-grid]');
  inView(
    grid,
    () => {
      const cards = [...grid.children].filter((c) => !c.hidden);
      animate(cards, { opacity: [0, 1], transform: ['translateY(32px)', 'translateY(0px)'] }, { delay: stagger(0.08), duration: 0.9, ease });
    },
    { margin: '0px 0px -15% 0px' },
  );
}

export function setupCounters({ reducedMotion }) {
  if (reducedMotion) return;
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    el.textContent = '0';
    inView(el, () => {
      animate(0, target, { duration: 1.6, ease, onUpdate: (v) => (el.textContent = Math.round(v)) });
    });
  });
}

/** Cards tilt toward the pointer, with a soft glare following it. */
export function setupTilt({ reducedMotion }) {
  if (reducedMotion || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const grid = document.querySelector('[data-product-grid]');
  grid.addEventListener('pointermove', (e) => {
    const media = e.target.closest('.product-media');
    if (!media) return;
    const r = media.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    media.style.setProperty('--ry', `${(x - 0.5) * 10}deg`);
    media.style.setProperty('--rx', `${(0.5 - y) * 8}deg`);
    media.style.setProperty('--gx', `${x * 100}%`);
    media.style.setProperty('--gy', `${y * 100}%`);
  });
  grid.addEventListener(
    'pointerleave',
    (e) => {
      const media = e.target.closest?.('.product-media');
      if (!media) return;
      media.style.setProperty('--ry', '0deg');
      media.style.setProperty('--rx', '0deg');
    },
    true,
  );
}

export function setupMarquee() {
  const track = document.querySelector('[data-marquee]');
  track.innerHTML += track.innerHTML;
}

/** Lightweight YouTube embed: the player loads only after the visitor presses play. */
export function setupVideo() {
  const box = document.querySelector('[data-video]');
  const poster = box.querySelector('.video-poster');
  const img = poster.querySelector('img');
  img.addEventListener('error', () => (img.hidden = true), { once: true });
  poster.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${box.dataset.videoId}?autoplay=1&rel=0&playsinline=1`;
    iframe.title = 'Música por amigos del colegio de Marko';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    poster.replaceWith(iframe);
    box.classList.add('is-playing');
    iframe.focus();
  });
}

export function setupNewsletter() {
  const form = document.querySelector('[data-newsletter]');
  const input = form.querySelector('input');
  const msg = form.querySelector('[data-newsletter-msg]');
  const button = form.querySelector('button');
  const helpText = msg.textContent;
  let attempted = false;

  const setMsg = (text, kind = '') => {
    msg.textContent = text;
    msg.className = `field-help ${kind}`;
  };
  const validate = () => {
    const ok = input.value.trim() !== '' && input.checkValidity();
    input.setAttribute('aria-invalid', String(!ok));
    if (!ok) setMsg('Escribe un correo válido, por ejemplo nombre@correo.com.', 'is-error');
    else setMsg(helpText);
    return ok;
  };

  input.addEventListener('blur', () => attempted && validate());
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    attempted = true;
    if (!validate()) {
      input.focus();
      return;
    }
    button.disabled = true;
    button.textContent = 'Enviando…';
    setTimeout(() => {
      button.disabled = false;
      button.textContent = 'Suscribirme';
      form.reset();
      attempted = false;
      input.removeAttribute('aria-invalid');
      setMsg('¡Listo! Ya estás en la lista. Te avisaremos del próximo drop.', 'is-success');
    }, 700);
  });
}
