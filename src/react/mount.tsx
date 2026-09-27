import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TeocorsHero } from './TeocorsHero';
import { PersonalizaSection } from './PersonalizaSection';
import { FigureTour } from './FigureTour';
import { EmblemChapter } from './EmblemChapter';
import { openDialog } from '../ui/dialogs.js';

/** Monta las piezas React (portada, capítulos 3D y «Personaliza») dentro del sitio. */
export function mountReact({ openCart, openSearch }: { openCart: () => void; openSearch: () => void }) {
  const hero = document.querySelector<HTMLElement>('[data-react-hero]');
  if (hero) {
    const openMenu = () => openDialog(document.querySelector('#mobile-nav'));
    createRoot(hero).render(
      <StrictMode>
        <TeocorsHero onOpenMenu={openMenu} onOpenCart={openCart} onOpenSearch={openSearch} />
      </StrictMode>,
    );
  }

  const chapters = document.querySelector<HTMLElement>('[data-react-chapters]');
  if (chapters) {
    createRoot(chapters).render(
      <StrictMode>
        <FigureTour />
        <EmblemChapter />
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
