import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TeocorsHero } from './TeocorsHero';
import { PersonalizaSection } from './PersonalizaSection';
import { openDialog } from '../ui/dialogs.js';

/** Monta las piezas React (portada y «Personaliza») dentro del sitio. */
export function mountReact({ openCart }: { openCart: () => void }) {
  const hero = document.querySelector<HTMLElement>('[data-react-hero]');
  if (hero) {
    const openMenu = () => openDialog(document.querySelector('#mobile-nav'));
    createRoot(hero).render(
      <StrictMode>
        <TeocorsHero onOpenMenu={openMenu} onOpenCart={openCart} />
      </StrictMode>,
    );
  }

  const personaliza = document.querySelector<HTMLElement>('[data-react-personaliza]');
  if (personaliza) {
    createRoot(personaliza).render(
      <StrictMode>
        <PersonalizaSection />
      </StrictMode>,
    );
  }
}
