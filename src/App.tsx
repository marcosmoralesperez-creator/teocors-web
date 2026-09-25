import { MotionConfig } from 'motion/react';

import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { Benefits } from '@/components/sections/benefits';
import { Collection } from '@/components/sections/collection';
import { Details } from '@/components/sections/details';
import { Hero } from '@/components/sections/hero';
import { Lab3D } from '@/components/sections/lab-3d';
import { Lookbook } from '@/components/sections/lookbook';
import { Manifesto } from '@/components/sections/manifesto';
import { Marquee } from '@/components/sections/marquee';
import { Music } from '@/components/sections/music';
import { Newsletter } from '@/components/sections/newsletter';
import { QuickViewDialog } from '@/components/shop/quick-view-dialog';
import { ShopProvider } from '@/components/shop/shop-provider';
import { SizeGuideDialog } from '@/components/shop/size-guide-dialog';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ShopProvider>
        <a
          href="#main"
          className="absolute -top-24 left-4 z-[200] bg-primary px-[18px] py-3 font-semibold text-primary-foreground focus:top-3"
        >
          Saltar al contenido
        </a>
        <AnnouncementBar />
        <SiteHeader />
        <main id="main">
          <Hero />
          <Marquee />
          <Collection />
          <Details />
          <Lab3D />
          <Lookbook />
          <Music />
          <Manifesto />
          <Benefits />
          <Newsletter />
        </main>
        <SiteFooter />
        <QuickViewDialog />
        <SizeGuideDialog />
      </ShopProvider>
    </MotionConfig>
  );
}
