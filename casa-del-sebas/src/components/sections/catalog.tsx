import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { categories, formatPrice, productImage, products, type CategoryId, type Product } from '@/data/products';
import { Reveal, SectionHeading } from '@/components/reveal';
import { cn } from '@/lib/utils';

// Foto de portada de cada categoría.
const cover: Record<CategoryId, string> = {
  cadenas: 'cubana-iced-14',
  pulseras: 'pulsera-cubana-iced',
  manillas: 'manilla-placa',
  dijes: 'placa-iced',
  anillos: 'anillo-sello',
  aretes: 'topos-solitario',
};

type Sort = 'destacados' | 'menor' | 'mayor';

export function Categories({ onPick }: { onPick: (id: CategoryId) => void }) {
  return (
    <section aria-labelledby="categorias-titulo" className="bg-ivory px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <p className="eyebrow text-gold">Comprar por pieza</p>
            <h2 id="categorias-titulo" className="display mt-3 text-4xl sm:text-5xl">
              Elige cómo llevar el oro
            </h2>
          </Reveal>
          <a href="#coleccion" className="eyebrow inline-flex items-center gap-2 text-ink hover:text-gold">
            Toda la colección <ArrowUpRight className="size-4" strokeWidth={1.5} />
          </a>
        </div>
        <div className="mt-10 -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 xl:grid-cols-7">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.06} className="w-[58vw] shrink-0 snap-start sm:w-auto">
              <a
                href="#coleccion"
                onClick={() => onPick(c.id)}
                className="group block"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-sand-soft">
                  <img
                    src={productImage(cover[c.id])}
                    alt=""
                    loading="lazy"
                    className="size-full object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                </div>
                <div className="mt-4">
                  <span className="display block text-xl leading-tight xl:text-2xl">{c.name}</span>
                  <span className="mt-1 block text-xs text-ink-soft">{products.filter((p) => p.category === c.id).length} piezas</span>
                </div>
              </a>
            </Reveal>
          ))}
          <Reveal delay={0.3} className="w-[58vw] shrink-0 snap-start sm:w-auto">
            <a href="#personaliza" className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                <img
                  src={productImage('inicial-s')}
                  alt=""
                  loading="lazy"
                  className="size-full object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <span className="eyebrow absolute top-3 left-3 bg-gold-bright px-2.5 py-1.5 text-[0.56rem] text-ink">Personaliza</span>
              </div>
              <div className="mt-4">
                <span className="display block text-xl leading-tight xl:text-2xl">Crea tu estilo</span>
                <span className="mt-1 flex items-center gap-1 text-xs text-ink-soft">
                  Arma tu pieza <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                </span>
              </div>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Catalog({ filter, setFilter, onView }: { filter: CategoryId | 'todo'; setFilter: (f: CategoryId | 'todo') => void; onView: (id: string) => void }) {
  const [sort, setSort] = useState<Sort>('destacados');
  const list = useMemo(() => {
    const out = products.filter((p) => filter === 'todo' || p.category === filter);
    if (sort === 'menor') out.sort((a, b) => a.price - b.price);
    if (sort === 'mayor') out.sort((a, b) => b.price - a.price);
    return out;
  }, [filter, sort]);

  const chips: { id: CategoryId | 'todo'; name: string }[] = [{ id: 'todo', name: 'Todo' }, ...categories];

  return (
    <section id="coleccion" aria-labelledby="coleccion-titulo" className="bg-paper px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="La colección"
          title={<span id="coleccion-titulo">Piezas de la casa</span>}
          intro="Las piezas listas de la casa, todas en oro macizo de 18k. Los precios incluyen certificado, estuche y envío asegurado a cualquier ciudad de Colombia. ¿Quieres armar la tuya? Más abajo está Crea tu estilo."
        />

        <div className="mt-12 flex flex-col gap-4 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filtrar por categoría">
            {chips.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={filter === c.id}
                onClick={() => setFilter(c.id)}
                className={cn(
                  'eyebrow min-h-10 shrink-0 border px-4 text-[0.66rem] transition-colors',
                  filter === c.id ? 'border-ink bg-ink text-ivory' : 'border-border text-ink hover:border-ink',
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3 text-sm text-ink-soft">
            Ordenar
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="field min-h-10 w-auto py-1.5 pr-8 text-sm text-ink">
              <option value="destacados">Destacados</option>
              <option value="menor">Precio: menor a mayor</option>
              <option value="mayor">Precio: mayor a menor</option>
            </select>
          </label>
        </div>

        <p className="sr-only" aria-live="polite">
          {list.length} piezas
        </p>
        <motion.ul layout className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={p} onView={onView} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}

function ProductCard({ product: p, onView }: { product: Product; onView: (id: string) => void }) {
  return (
    <button type="button" onClick={() => onView(p.id)} className="group block w-full text-left">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand-soft">
        <img
          src={productImage(p.id)}
          alt={p.name}
          loading="lazy"
          width={1000}
          height={1250}
          className="size-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        {p.badge && <span className="eyebrow absolute top-3 left-3 bg-ivory px-2.5 py-1.5 text-[0.58rem] text-ink">{p.badge}</span>}
        <span className="eyebrow absolute inset-x-3 bottom-3 hidden translate-y-2 bg-ink py-3 text-center text-[0.62rem] text-ivory opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:block">
          Ver la pieza
        </span>
      </div>
      <div className="mt-4">
        <h3 className="display text-lg leading-tight sm:text-2xl">{p.name}</h3>
        <p className="mt-1 text-xs text-ink-soft sm:text-sm">
          Oro 18k · {p.weight}
          {p.stones ? ' · Iced' : ''}
        </p>
        <p className="mt-2 text-sm font-medium tracking-wide sm:text-base">{formatPrice(p.price)}</p>
        {p.swatches && (
          <span className="mt-2 flex gap-1.5" aria-label={`${p.sizes.length} colores de hilo`}>
            {p.sizes.map((s) => (
              <span key={s} className="size-3 rounded-full ring-1 ring-ink/15" style={{ background: p.swatches![s] }} />
            ))}
          </span>
        )}
      </div>
    </button>
  );
}
