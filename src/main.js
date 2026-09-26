import '@fontsource-variable/montserrat';
import '@fontsource-variable/unbounded';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import 'lenis/dist/lenis.css';
import './app.css';

import { renderIcons } from './ui/icons.js';
import { setupDialogs } from './ui/dialogs.js';
import { createCart, setupCartUI } from './ui/cart.js';
import { setupCatalog } from './ui/catalog.js';
import Lenis from 'lenis';
import { mountReact } from './react/mount.tsx';
import {
  setupHeader,
  setupReveals,
  setupCounters,
  setupTilt,
  setupMarquee,
  setupVideo,
  setupNewsletter,
} from './ui/page.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) document.documentElement.classList.add('motion-ok');

const cart = createCart();
const cartUI = setupCartUI(cart);
setupCatalog({ cart, cartUI });
mountReact({ openCart: cartUI.open });
renderIcons();

// Scroll suave, como en los micrositios de producto; se apaga con «reducir movimiento».
if (!reducedMotion) {
  const lenis = new Lenis({ lerp: 0.09, anchors: true });
  const raf = (t) => {
    lenis.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

// Riel de progreso (reemplaza la barra de scroll nativa).
const rail = document.querySelector('[data-scroll-rail]');
const updateRail = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  rail.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
};
addEventListener('scroll', updateRail, { passive: true });
updateRail();

setupDialogs();
setupHeader();
setupMarquee();
setupReveals({ reducedMotion });
setupCounters({ reducedMotion });
setupTilt({ reducedMotion });
setupVideo();
setupNewsletter();
