import { Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useShop } from '@/components/shop/shop-provider';
import { productImage } from '@/data/images';
import { formatPrice, type Product } from '@/data/products';
import { prefersReducedMotion } from '@/lib/scroll';

const canTilt = () => !prefersReducedMotion() && matchMedia('(hover: hover) and (pointer: fine)').matches;

/** The photo tilts toward the pointer, with a soft glare following it. */
function tilt(e: React.PointerEvent<HTMLElement>) {
  if (!canTilt()) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty('--ry', `${(x - 0.5) * 10}deg`);
  el.style.setProperty('--rx', `${(0.5 - y) * 8}deg`);
  el.style.setProperty('--gx', `${x * 100}%`);
  el.style.setProperty('--gy', `${y * 100}%`);
}

function untilt(e: React.PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--ry', '0deg');
  e.currentTarget.style.setProperty('--rx', '0deg');
}

export function ProductCard({ product: p }: { product: Product }) {
  const { openQuickView } = useShop();

  return (
    <article aria-labelledby={`p-${p.id}`} className="flex h-full flex-col gap-4">
      <button
        type="button"
        aria-label={`Vista rápida: ${p.name}`}
        onClick={() => openQuickView(p.id)}
        onPointerMove={tilt}
        onPointerLeave={untilt}
        className="group relative block aspect-[4/5] w-full overflow-hidden rounded-md bg-media transition-transform duration-600 ease-luxe [--rx:0deg] [--ry:0deg] [transform:perspective(900px)_rotateX(var(--rx))_rotateY(var(--ry))]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_var(--gx,50%)_var(--gy,30%),rgb(255_240_215/0.09),transparent_45%)] opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] border" />
        {p.badge && (
          <Badge className="absolute top-3.5 left-3.5 z-[2] max-sm:top-auto max-sm:bottom-2 max-sm:left-2 max-sm:px-1.5 max-sm:py-1 max-sm:tracking-[0.04em]">
            {p.badge}
          </Badge>
        )}
        <img
          src={productImage(p.id)}
          alt=""
          width={960}
          height={1200}
          loading="lazy"
          decoding="async"
          className="size-full object-contain transition-transform duration-900 ease-luxe group-hover:scale-[1.04]"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-4 left-1/2 z-[2] -translate-x-1/2 translate-y-2.5 rounded-full bg-foreground px-4.5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-background opacity-0 transition-[opacity,translate] duration-400 ease-luxe group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 max-sm:hidden"
        >
          Vista rápida
        </span>
      </button>

      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div>
          <h3 id={`p-${p.id}`} className="font-serif text-[clamp(19px,1.8vw,25px)] font-medium leading-[1.15]">
            {p.name}
          </h3>
          <p className="mt-1 flex items-center gap-2 text-[13px] text-muted-foreground">
            <span
              aria-hidden="true"
              className="size-2.5 rounded-full border border-input"
              style={{ background: p.garment.base }}
            />
            {p.color}
          </p>
        </div>
        <p className="text-[15px] font-semibold whitespace-nowrap tabular-nums">{formatPrice(p.price)}</p>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="mt-auto w-full max-sm:px-2.5 max-sm:tracking-[0.08em] max-sm:[&_svg]:hidden"
        onClick={() => openQuickView(p.id)}
      >
        Elegir talla <Plus aria-hidden="true" />
      </Button>
    </article>
  );
}
