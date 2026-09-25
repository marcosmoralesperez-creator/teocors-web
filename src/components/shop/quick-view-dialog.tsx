import { useEffect, useRef, useState } from 'react';
import { Check, Ruler, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Eyebrow } from '@/components/common/section-heading';
import { useShop } from '@/components/shop/shop-provider';
import { productImage } from '@/data/images';
import { categoryLabel, formatPrice, productById, sizes, type Product, type Size } from '@/data/products';
import { cn } from '@/lib/utils';

export function QuickViewDialog() {
  const { quickViewId, closeQuickView, returnFocus } = useShop();
  // Keep showing the last product while the dialog animates out.
  const [product, setProduct] = useState<Product | undefined>();
  const handedOff = useRef(false);

  useEffect(() => {
    const p = quickViewId ? productById(quickViewId) : undefined;
    if (p) setProduct(p);
  }, [quickViewId]);

  return (
    <Dialog open={quickViewId !== null} onOpenChange={(open) => !open && closeQuickView()}>
      <DialogContent
        className="grid max-h-[calc(100dvh-32px)] max-w-[1040px] md:grid-cols-2 max-md:h-[calc(100dvh-32px)] max-md:grid-rows-[auto_minmax(0,1fr)]"
        onOpenAutoFocus={() => (handedOff.current = false)}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          // Adding to the cart hands focus to the cart drawer instead.
          if (!handedOff.current) returnFocus.current.quickView?.focus();
        }}
      >
        {product && <QuickViewBody key={product.id} product={product} onAdded={() => (handedOff.current = true)} />}
      </DialogContent>
    </Dialog>
  );
}

function QuickViewBody({ product: p, onAdded }: { product: Product; onAdded: () => void }) {
  const { addToCart, closeQuickView, setCartOpen, openSizeGuide } = useShop();
  const [size, setSize] = useState<Size | null>(null);
  const [error, setError] = useState(false);
  const firstSize = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!size) {
      setError(true);
      firstSize.current?.focus();
      return;
    }
    onAdded();
    addToCart(p.id, size);
    closeQuickView();
    setCartOpen(true);
  }

  const firstAvailable = sizes.find((s) => !p.soldOut.includes(s));

  return (
    <>
      <div className="bg-media max-md:h-[34vh]">
        <img
          src={productImage(p.id)}
          alt={`${p.name} colgada en un gancho dorado`}
          width={960}
          height={1200}
          className="size-full object-contain"
        />
      </div>
      <form noValidate onSubmit={submit} className="flex flex-col gap-4 overflow-auto p-[clamp(24px,4vw,48px)]">
        <Eyebrow className="mb-0">{categoryLabel(p.category)}</Eyebrow>
        <DialogTitle className="pr-10">{p.name}</DialogTitle>
        <p className="text-lg font-semibold tabular-nums">{formatPrice(p.price)}</p>
        <DialogDescription>{p.description}</DialogDescription>

        <fieldset className="mt-2">
          <legend className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em]">
            Talla <span className="font-normal normal-case tracking-normal text-muted-foreground">· Color: {p.color}</span>
          </legend>
          <div className="grid grid-cols-4 gap-2">
            {sizes.map((s) => {
              const out = p.soldOut.includes(s);
              return (
                <label key={s} className="group relative">
                  <input
                    ref={s === firstAvailable ? firstSize : undefined}
                    type="radio"
                    name="size"
                    value={s}
                    disabled={out}
                    checked={size === s}
                    aria-describedby={error ? 'qv-size-error' : undefined}
                    onChange={() => {
                      setSize(s);
                      setError(false);
                    }}
                    className="peer absolute inset-0 m-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                  />
                  <span
                    className={cn(
                      'grid min-h-[50px] place-items-center rounded-md border border-input font-semibold transition-colors',
                      'group-hover:border-foreground peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background',
                      'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold',
                      'peer-disabled:border-dashed peer-disabled:text-[#6f6961] peer-disabled:line-through peer-disabled:group-hover:border-input',
                    )}
                  >
                    {s}
                    {out && <span className="sr-only"> (agotada)</span>}
                  </span>
                </label>
              );
            })}
          </div>
          {error && (
            <p id="qv-size-error" role="alert" className="mt-2.5 text-[13px] text-destructive">
              Elige una talla para continuar.
            </p>
          )}
        </fieldset>

        <Button type="button" variant="link" size="inline" className="self-start" onClick={openSizeGuide}>
          <Ruler aria-hidden="true" /> Guía de tallas
        </Button>
        <Button type="submit" className="w-full">
          Añadir al carrito <ShoppingBag aria-hidden="true" />
        </Button>

        <ul className="mt-2 grid gap-2 border-t pt-5 text-sm text-muted-foreground">
          {p.details.map((d) => (
            <li key={d} className="flex items-center gap-2.5">
              <Check aria-hidden="true" className="size-4 text-gold" />
              {d}
            </li>
          ))}
        </ul>
      </form>
    </>
  );
}
