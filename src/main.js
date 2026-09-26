import '@fontsource-variable/montserrat';
import '@fontsource-variable/unbounded';
import './app.css';

import { renderIcons } from './ui/icons.js';
import { setupDialogs } from './ui/dialogs.js';
import { createCart, setupCartUI } from './ui/cart.js';
import { setupCatalog } from './ui/catalog.js';
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

setupDialogs();
setupHeader();
setupMarquee();
setupReveals({ reducedMotion });
setupCounters({ reducedMotion });
setupTilt({ reducedMotion });
setupVideo();
setupNewsletter();
