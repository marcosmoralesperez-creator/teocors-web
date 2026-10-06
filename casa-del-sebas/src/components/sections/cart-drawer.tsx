import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { formatPrice, productById, productImage } from '@/data/products';
import { unitPrice, useCart } from '@/lib/cart';
import { whatsappLink } from '@/lib/site';
import { SheetDialog } from '@/components/sheet-dialog';
import { WhatsAppIcon } from '@/components/brand-icons';

export function CartDrawer() {
  const { items, subtotal, open, setOpen, setQty, count } = useCart();

  const order = [
    'Hola, Casa del Sebas. Quiero hacer este pedido:',
    '',
    ...items.map((i) => {
      const p = productById(i.id)!;
      return `• ${i.qty} × ${p.name} — ${i.size}${i.engraving ? ` — grabado «${i.engraving}»` : ''} — ${formatPrice(unitPrice(i) * i.qty)}`;
    }),
    '',
    `Total: ${formatPrice(subtotal)}`,
  ].join('\n');

  return (
    <SheetDialog open={open} onClose={() => setOpen(false)} label="Tu bolsa" className="ml-auto h-dvh w-full max-w-md">
      <div className="flex h-full flex-col bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="display text-2xl">
            Tu bolsa <span className="text-base text-ink-soft">({count})</span>
          </h2>
          <button type="button" onClick={() => setOpen(false)} className="-mr-2 inline-flex size-11 items-center justify-center" aria-label="Cerrar bolsa">
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <ShoppingBag className="size-10 text-gold" strokeWidth={1} />
            <p className="display text-2xl">Tu bolsa está vacía</p>
            <p className="text-sm text-ink-soft">Empieza por la cubana iced: es la pieza que define la casa.</p>
            <a href="#coleccion" onClick={() => setOpen(false)} className="btn btn-dark mt-2">
              Ver la colección
            </a>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {items.map((i) => {
                const p = productById(i.id)!;
                return (
                  <li key={`${i.id}-${i.size}-${i.engraving}`} className="flex gap-4 py-5">
                    <img src={productImage(p.id)} alt="" className="h-24 w-20 shrink-0 bg-sand-soft object-contain" />
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-3">
                        <p className="display text-lg leading-tight">{p.name}</p>
                        <p className="text-sm whitespace-nowrap">{formatPrice(unitPrice(i) * i.qty)}</p>
                      </div>
                      <p className="mt-1 text-xs text-ink-soft">
                        {i.size}
                        {i.engraving && ` · Grabado «${i.engraving}»`}
                      </p>
                      <div className="mt-auto flex items-center gap-1 pt-3">
                        <button type="button" onClick={() => setQty(i, i.qty - 1)} className="inline-flex size-9 items-center justify-center border border-border" aria-label={`Quitar una ${p.name}`}>
                          <Minus className="size-3.5" strokeWidth={1.5} />
                        </button>
                        <span className="w-8 text-center text-sm" aria-label="Cantidad">
                          {i.qty}
                        </span>
                        <button type="button" onClick={() => setQty(i, i.qty + 1)} className="inline-flex size-9 items-center justify-center border border-border" aria-label={`Agregar una ${p.name}`}>
                          <Plus className="size-3.5" strokeWidth={1.5} />
                        </button>
                        <button type="button" onClick={() => setQty(i, 0)} className="ml-auto text-xs text-ink-soft underline underline-offset-4 hover:text-ink">
                          Quitar
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-border px-6 py-6">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Envío asegurado</dt>
                  <dd>Sin costo</dd>
                </div>
                <div className="flex justify-between text-base">
                  <dt>Total</dt>
                  <dd className="font-medium">{formatPrice(subtotal)}</dd>
                </div>
              </dl>
              <a href={whatsappLink(order)} target="_blank" rel="noreferrer" className="btn btn-gold mt-5 w-full">
                <WhatsAppIcon className="size-4" /> Finalizar pedido por WhatsApp
              </a>
              <p className="mt-3 text-center text-xs leading-relaxed text-ink-soft">
                Un asesor confirma la disponibilidad, el pago y la entrega contigo.
              </p>
            </div>
          </>
        )}
      </div>
    </SheetDialog>
  );
}
