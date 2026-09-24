import { animate, scroll, stagger } from 'motion';
import { products } from '../data/products.js';

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2'));
  } catch {
    return false;
  }
}

export function setupHero({ reducedMotion }) {
  const hero = document.querySelector('[data-hero]');
  const wordmark = hero.querySelector('[data-hero-wordmark]');
  const stage = hero.querySelector('[data-hero-stage]');

  // Split the wordmark so the letters can rise in one by one.
  const text = wordmark.textContent.trim();
  wordmark.setAttribute('aria-label', text);
  wordmark.innerHTML = [...text].map((ch) => `<span class="char" aria-hidden="true">${ch}</span>`).join('');
  wordmark.classList.add('is-split');

  if (!reducedMotion) {
    const ease = [0.22, 1, 0.36, 1];
    animate(wordmark.querySelectorAll('.char'), { transform: ['translateY(105%)', 'translateY(0%)'], opacity: [0, 1] }, { delay: stagger(0.07), duration: 1.2, ease });
    animate(hero.querySelectorAll('[data-hero-in]'), { opacity: [0, 1], transform: ['translateY(22px)', 'translateY(0px)'] }, { delay: stagger(0.1, { startDelay: 0.55 }), duration: 1, ease });
    scroll(animate(wordmark, { transform: ['translateY(-58%)', 'translateY(-20%)'], opacity: [1, 0.25] }), {
      target: hero,
      offset: ['start start', 'end start'],
    });
  }

  if (!webglAvailable()) return;

  const hotspots = [...hero.querySelectorAll('[data-hotspot]')].map((el) => ({
    el,
    x: Number(el.dataset.x),
    y: Number(el.dataset.y),
  }));

  import('../three/hero.js')
    .then(({ createHeroScene }) =>
      createHeroScene({
        canvas: hero.querySelector('[data-hero-canvas]'),
        container: stage,
        garment: products[0].garment,
        hotspots,
        reducedMotion,
      }),
    )
    .then((scene) => {
      hero.classList.add('is-3d');
      if (!reducedMotion) {
        scroll((progress) => scene.setProgress(progress), { target: hero, offset: ['start start', 'end start'] });
      }
    })
    .catch((err) => console.warn('Escena 3D no disponible, se muestra la imagen.', err));
}
