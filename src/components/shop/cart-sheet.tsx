import { useEffect, useRef, useState } from 'react';
import { animate } from 'motion';
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MAX_QTY, useShop, type CartLine } from '@/components/shop/shop-provider';
import { productImage } from '@/data/images';
import { formatPrice, productById } from '@/data/products';
import { FREE_SHIPPING } from '@/data/site';
import { prefersReducedMotion, scrollToSection } from '@/lib/scroll';

const lineKey = (l: Pick<CartLine, 'id' | 'size'>) => `${l.id}:${l.size}`;

export function CartSheet() {
  const { items, count, subtotal, lastAdded, setQty, cartOpen, setCartOpen } = useShop();
  const [checkoutMsg, setCheckoutMsg] = useState('');
  const badgeRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const closeTarget = useRef<string | null>(null);
  // After a line is removed, focus moves to its neighbour instead of the page.
  const pendingFocus = useRef<string | null>(null);

  useEffect(() => setCheckoutMsg(''), [items]);

  useEffect(() => {
    if (lastAdded && badgeRef.current && !prefersReducedMotion()) {
      animate(badgeRef.current, { scale: [1, 1.35, 1] }, { duration: 0.45 });
    }
  }, [lastAdded]);

  useEffect(() => {
    if (pendingFocus.current === null) return;
    const key = pendingFocus.current;
    pendingFocus.current = null;
    const next = key
      ? listRef.current?.querySelector<HTMLElement>(`[data-key="${CSS.escape(key)}"] [data-action]`)
      : document.querySelector<HTMLElement>('[data-cart-empty-cta]');
    next?.focus();
  }, [items]);

  function remove(line: CartLine) {
    const index = items.findIndex((i) => lineKey(i) === lineKey(line));
    const neighbour = items[index + 1] ?? items[index - 1];
    pendingFocus.current = neighbour ? lineKey(neighbour) : '';
    setQty(line.id, line.size, 0);
  }

  const missing = FREE_SHIPPING - subtotal;
  const added = lastAdded && productById(lastAdded.id);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger
        aria-label={`Abrir carrito, ${count} ${count === 1 ? 'producto' : 'productos'}`}
        className="group relative -mr-1.5 inline-flex min-h-11 items-center gap-2.5 justify-self-end text-[13px] font-medium uppercase tracking-[0.16em] lg:mr-0 lg:pl-3"
      >
        <ShoppingBag aria-hidden="true" strokeWidth={1.5} className="size-[22px]" />
        <span className="transition-colors group-hover:text-gold-bright max-lg:hidden">Carrito</span>
        <span
          ref={badgeRef}
          aria-hidden="true"
          className="grid h-[22px] min-w-[22px] place-items-center rounded-full bg-primary px-1.5 text-xs font-bold tracking-normal text-primary-foreground tabular-nums max-lg:absolute max-lg:-top-0.5 max-lg:-right-1.5 max-lg:h-[18px] max-lg:min-w-[18px] max-lg:text-[11px]"
        >
          {count}
        </span>
      </SheetTrigger>

      <SheetContent
        side="right"
        closeLabel="Cerrar carrito"
        aria-describedby={undefined}
        onCloseAutoFocus={(e) => {
          if (!closeTarget.current) return;
          e.preventDefault();
          const id = closeTarget.current;
          closeTarget.current = null;
          requestAnimationFrame(() => scrollToSection(id));
        }}
      >
        <SheetHeader>
          <SheetTitle>
            Tu carrito {count > 0 && <span className="text-xl text-muted-foreground">({count})</span>}
          </SheetTitle>
        </SheetHeader>

        <p role="status" className="empty:hidden">
          {added && lastAdded && (
            <span className="flex items-center gap-2.5 border-b bg-success/[0.08] px-6 py-3 text-sm text-success">
              <Check aria-hidden="true" className="size-[18px]" />
              Añadido: {added.name} · Talla {lastAdded.size}
            </span>
          )}
        </p>

        {items.length === 0 ? (
          <div className="grid flex-1 place-content-center justify-items-center gap-5 p-6 text-center">
            <p className="font-serif text-[26px]">Tu carrito está vacío.</p>
            <p className="-mt-3 text-sm text-muted-foreground">Las piezas de la Colección 01 son de tiraje corto.</p>
            <Button
              variant="glass"
              data-cart-empty-cta
              onClick={() => {
                closeTarget.current = 'coleccion';
                setCartOpen(false);
              }}
            >
              Ver la colección
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b px-6 py-4 text-[13px] text-muted-foreground">
              <p>
                {missing > 0 ? (
                  <>
                    Te faltan <strong className="text-foreground">{formatPrice(missing)}</strong> para el envío
                    gratis.
                  </>
                ) : (
                  <strong className="text-foreground">¡Tienes envío gratis!</strong>
                )}
              </p>
              <div className="mt-2.5 h-[3px] overflow-hidden rounded-full bg-border" aria-hidden="true">
                <span
                  className="block h-full origin-left bg-gold transition-transform duration-600 ease-luxe"
                  style={{ transform: `scaleX(${Math.min(1, subtotal / FREE_SHIPPING)})` }}
                />
              </div>
            </div>

            <ul ref={listRef} className="flex-1 overflow-auto px-6">
              {items.map((line) => {
                const p = productById(line.id)!;
                return (
                  <li
                    key={lineKey(line)}
                    data-key={lineKey(line)}
                    className="grid grid-cols-[80px_minmax(0,1fr)_auto] gap-4 border-b py-5"
                  >
                    <img
                      src={productImage(p.id)}
                      alt=""
                      width={80}
                      height={100}
                      loading="lazy"
                      className="h-[100px] w-20 rounded-md bg-media object-contain"
                    />
                    <div>
                      <p className="font-serif text-xl leading-tight">{p.name}</p>
                      <p className="mt-0.5 mb-3 text-[13px] text-muted-foreground">
                        {p.color} · Talla {line.size}
                      </p>
                      <div
                        role="group"
                        aria-label={`Cantidad de ${p.name}, talla ${line.size}`}
                        className="inline-flex items-center rounded-full border border-input"
                      >
                        <button
                          type="button"
                          data-action="dec"
                          aria-label="Quitar una unidad"
                          onClick={() => (line.qty === 1 ? remove(line) : setQty(line.id, line.size, line.qty - 1))}
                          className="grid size-10 place-items-center rounded-full transition-colors hover:bg-foreground/[0.08]"
                        >
                          <Minus aria-hidden="true" className="size-4" />
                        </button>
                        <span className="min-w-5 text-center font-semibold tabular-nums">{line.qty}</span>
                        <button
                          type="button"
                          data-action="inc"
                          aria-label="Agregar una unidad"
                          disabled={line.qty >= MAX_QTY}
                          onClick={() => setQty(line.id, line.size, line.qty + 1)}
                          className="grid size-10 place-items-center rounded-full transition-colors hover:bg-foreground/[0.08] disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          <Plus aria-hidden="true" className="size-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <p className="font-semibold whitespace-nowrap tabular-nums">{formatPrice(p.price * line.qty)}</p>
                      <Button
                        variant="link"
                        size="inline"
                        data-action="remove"
                        aria-label={`Eliminar ${p.name}, talla ${line.size}`}
                        onClick={() => remove(line)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <SheetFooter className="border-t bg-surface-2 pt-5">
              <div className="flex items-baseline justify-between">
                <span>Subtotal</span>
                <strong className="text-xl tabular-nums">{formatPrice(subtotal)}</strong>
              </div>
              <p className="text-[13px] text-muted-foreground">Impuestos incluidos. El envío se calcula al pagar.</p>
              <Button
                className="w-full"
                onClick={() =>
                  setCheckoutMsg(
                    'El pago en línea llega muy pronto. Mientras tanto, escríbenos por Instagram para apartar tus prendas.',
                  )
                }
              >
                Finalizar compra
              </Button>
              <p role="status" className="text-[13px] text-muted-foreground empty:hidden">
                {checkoutMsg}
              </p>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
