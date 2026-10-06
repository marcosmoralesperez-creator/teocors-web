import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { CartProvider } from '@/lib/cart';
import type { CategoryId } from '@/data/products';
import { Header } from '@/components/sections/header';
import { Hero, TrustMarquee } from '@/components/sections/hero';
import { Catalog, Categories } from '@/components/sections/catalog';
import { Bespoke, Closeup } from '@/components/sections/craft';
import { Care, Footer, Gold18k, Visit, WhatsAppFloat } from '@/components/sections/info';
import { ProductDialog } from '@/components/sections/product-dialog';
import { CartDrawer } from '@/components/sections/cart-drawer';

export default function App() {
  const [viewing, setViewing] = useState<string | null>(null);
  const [filter, setFilter] = useState<CategoryId | 'todo'>('todo');

  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <a href="#coleccion" className="sr-only z-50 bg-ink px-4 py-3 text-ivory focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          Saltar a la colección
        </a>
        <Header />
        <main>
          <Hero onView={setViewing} />
          <TrustMarquee />
          <Categories onPick={setFilter} />
          <Closeup />
          <Catalog filter={filter} setFilter={setFilter} onView={setViewing} />
          <Bespoke />
          <Gold18k />
          <Care />
          <Visit />
        </main>
        <Footer />
        <WhatsAppFloat />
        <ProductDialog id={viewing} onClose={() => setViewing(null)} />
        <CartDrawer />
      </CartProvider>
    </MotionConfig>
  );
}
