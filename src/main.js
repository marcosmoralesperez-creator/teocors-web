import '@fontsource-variable/montserrat';
import '@fontsource/cormorant/500.css';
import '@fontsource/cormorant/500-italic.css';
import '@fontsource/cormorant/600.css';
import './styles.css';

import { renderIcons } from './ui/icons.js';
import { setupDialogs } from './ui/dialogs.js';
import { createCart, setupCartUI } from './ui/cart.js';
import { setupCatalog } from './ui/catalog.js';
import { setupHero } from './ui/hero.js';
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
renderIcons();

setupDialogs();
setupHeader();
setupHero({ reducedMotion });
setupMarquee();
setupReveals({ reducedMotion });
setupCounters({ reducedMotion });
setupTilt({ reducedMotion });
setupVideo();
setupNewsletter();
