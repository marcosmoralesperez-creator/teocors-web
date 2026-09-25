import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { Eyebrow, SectionTitle, sectionY } from '@/components/common/section-heading';
import { Reveal } from '@/components/common/reveal';
import { ProductCard } from '@/components/shop/product-card';
import { useShop } from '@/components/shop/shop-provider';
import { categories, categoryLabel, products } from '@/data/products';
import { cn } from '@/lib/utils';

const ease = [0.22, 1, 0.36, 1] as const;

export function Collection() {
  const { filter, setFilter } = useShop();
  const visible = products.filter((p) => filter === 'all' || p.category === filter);

  // Announce the result of a filter change (not the initial render).
  const [status, setStatus] = useState('');
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const n = visible.length;
    setStatus(
      `Mostrando ${n} ${n === 1 ? 'producto' : 'productos'}${filter === 'all' ? '' : ` de ${categoryLabel(filter)}`}.`,
    );
  }, [filter, visible.length]);

  return (
    <section id="coleccion" aria-labelledby="coleccion-title" className={cn('relative', sectionY)}>
      <div className="shell">
        <div className="mb-[clamp(40px,5vw,64px)] flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <Reveal>
            <Eyebrow>Colección 01</Eyebrow>
            <SectionTitle id="coleccion-title">
              Piezas que se <em>sienten</em>
            </SectionTitle>
          </Reveal>
          <Reveal role="group" aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const n = c.id === 'all' ? products.length : products.filter((p) => p.category === c.id).length;
              const pressed = filter === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setFilter(c.id)}
                  className={cn(
                    'inline-flex min-h-11 items-center gap-2 rounded-full border border-input px-[18px] text-[13px] font-medium tracking-[0.06em] transition-colors duration-250 ease-luxe hover:border-foreground',
                    pressed && 'border-foreground bg-foreground text-background',
                  )}
                >
                  {c.label}
                  <span className="text-xs tabular-nums opacity-65">{n}</span>
                </button>
              );
            })}
          </Reveal>
        </div>

        <p className="sr-only" aria-live="polite">
          {status}
        </p>

        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-[clamp(12px,2vw,28px)] sm:gap-y-[clamp(36px,4vw,56px)] lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease, delay: i * 0.06 } }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              >
                <Reveal delay={(i % 3) * 0.08} className="h-full">
                  <ProductCard product={p} />
                </Reveal>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
}
