import { useEffect, useState } from 'react';
import { Award, Check, Gem, Scale, ShieldCheck, Truck, X } from 'lucide-react';
import { formatPrice, productById, productImage, sizeSurcharge, type Product } from '@/data/products';
import { useCart } from '@/lib/cart';
import { whatsappLink } from '@/lib/site';
import { SheetDialog } from '@/components/sheet-dialog';
import { WhatsAppIcon } from '@/components/brand-icons';
import { cn } from '@/lib/utils';

export function ProductDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  const current = id ? productById(id) : undefined;
  // Keep the last piece mounted so the same <dialog> closes cleanly.
  const [last, setLast] = useState<Product>();
  const p = current ?? last;
  const { add, setOpen } = useCart();
  const [size, setSize] = useState('');
  const [engraving, setEngraving] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!current) return;
    setLast(current);
    setSize(current.sizes[0] ?? '');
    setEngraving('');
    setAdded(false);
  }, [current]);

  if (!p) return null;

  const price = p.price + sizeSurcharge(size || p.sizes[0]);
  const sizeLabel = p.category === 'anillos' ? 'Talla' : p.category === 'dijes' || p.category === 'aretes' ? 'Opción' : 'Largo';

  const addToBag = () => {
    add({ id: p.id, size, engraving: engraving.trim() });
    setAdded(true);
    setTimeout(() => {
      onClose();
      setOpen(true);
    }, 650);
  };

  return (
    <SheetDialog open={!!current} onClose={onClose} label={p.name} className="h-dvh w-screen">
      <div className="flex min-h-full items-end justify-center sm:items-center sm:p-6" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="relative grid max-h-[94dvh] w-full max-w-5xl overflow-y-auto bg-paper shadow-2xl md:grid-cols-2 md:overflow-hidden">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 inline-flex size-11 items-center justify-center bg-paper/80 backdrop-blur"
            aria-label="Cerrar"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
          <div className="bg-sand-soft">
            <img src={productImage(p.id)} alt={p.name} className="mx-auto aspect-[4/5] max-h-[46dvh] w-full object-contain p-4 md:max-h-none" />
          </div>
          <div className="flex flex-col p-6 sm:p-10 md:max-h-[94dvh] md:overflow-y-auto">
            {p.badge && <p className="eyebrow text-gold">{p.badge}</p>}
            <h2 className="display mt-2 text-4xl sm:text-5xl">{p.name}</h2>
            <p className="mt-3 text-xl tracking-wide">{formatPrice(price)}</p>
            <p className="mt-5 leading-relaxed text-ink-soft">{p.description}</p>

            <ul className="mt-6 space-y-2.5 border-y border-border py-5 text-sm">
              <li className="flex gap-3"><Award className="size-4 shrink-0 text-gold" strokeWidth={1.5} /> Oro amarillo de 18k, sello 750</li>
              <li className="flex gap-3"><Scale className="size-4 shrink-0 text-gold" strokeWidth={1.5} /> Peso aproximado: {p.weight}</li>
              {p.stones && <li className="flex gap-3"><Gem className="size-4 shrink-0 text-gold" strokeWidth={1.5} /> {p.stones}</li>}
              <li className="flex gap-3"><ShieldCheck className="size-4 shrink-0 text-gold" strokeWidth={1.5} /> Certificado de pureza y garantía de por vida</li>
              <li className="flex gap-3"><Truck className="size-4 shrink-0 text-gold" strokeWidth={1.5} /> Envío asegurado sin costo, en estuche de la casa</li>
            </ul>

            <fieldset className="mt-6">
              <legend className="eyebrow text-[0.66rem] text-ink-soft">{sizeLabel}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.sizes.map((s) => (
                  <label
                    key={s}
                    className={cn(
                      'cursor-pointer border px-4 py-2.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold',
                      size === s ? 'border-ink bg-ink text-ivory' : 'border-border hover:border-ink',
                    )}
                  >
                    <input type="radio" name="opcion" value={s} checked={size === s} onChange={() => setSize(s)} className="sr-only" />
                    {s}
                  </label>
                ))}
              </div>
            </fieldset>

            {p.engraving && (
              <label className="mt-6 block">
                <span className="eyebrow text-[0.66rem] text-ink-soft">Grabado (opcional)</span>
                <input
                  className="field mt-3"
                  maxLength={20}
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value)}
                  placeholder="Iniciales, fecha o una letra"
                />
              </label>
            )}

            <div className="mt-8 flex flex-col gap-3">
              <button type="button" onClick={addToBag} className="btn btn-dark" disabled={added}>
                {added ? (
                  <>
                    <Check className="size-4" strokeWidth={1.5} /> En la bolsa
                  </>
                ) : (
                  'Agregar a la bolsa'
                )}
              </button>
              <a
                className="btn btn-line text-ink"
                target="_blank"
                rel="noreferrer"
                href={whatsappLink(`Hola, Casa del Sebas. Me interesa ${p.name} (${size})${engraving ? `, con grabado «${engraving}»` : ''}. ¿Me pueden dar más información?`)}
              >
                <WhatsAppIcon className="size-4" /> Preguntar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </SheetDialog>
  );
}
