import { useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import {
  chainTypes,
  defaultConfig,
  describe,
  imageOf,
  lengths,
  pendants,
  presets,
  priceOf,
  widthOf,
  type ChainConfig,
  type ChainType,
  type PendantType,
} from '@/data/custom-chain';
import { formatPrice, productImage } from '@/data/products';
import { useCart } from '@/lib/cart';
import { whatsappLink } from '@/lib/site';
import { Reveal, SectionHeading } from '@/components/reveal';
import { WhatsAppIcon } from '@/components/brand-icons';
import { cn } from '@/lib/utils';

const gold = 'linear-gradient(115deg,#8a5f17 0%,#e2b75c 32%,#fbe7b0 48%,#c99637 66%,#8a5f17 100%)';
// Pavé: tiny white points over the gold, so letters and plates read as iced.
const pave = `radial-gradient(circle at 50% 50%, #fffdf6 0 1.1px, rgba(255,255,255,0.55) 1.5px, transparent 2.1px) 0 0 / 5px 5px, ${gold}`;

/** Vista del dije, dibujada en CSS para que muestre el texto que escribe el cliente. */
function PendantPreview({ c }: { c: ChainConfig }) {
  if (c.pendant === 'ninguno') return null;
  const fill: CSSProperties = {
    background: c.pendantIced ? pave : gold,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    filter: 'drop-shadow(0 2px 2px rgb(60 40 10 / 0.35))',
  };
  const bail = <span className="mx-auto block size-3 rounded-full border-[3px] border-[#c99637]" aria-hidden="true" />;
  const text = c.text.trim();

  if (c.pendant === 'nombre') {
    return (
      <div className="flex flex-col items-center">
        {bail}
        <span className="display -mt-1 px-2 text-[clamp(2.2rem,7vw,3.6rem)] leading-none whitespace-nowrap italic" style={fill}>
          {text || 'Nombre'}
        </span>
      </div>
    );
  }
  if (c.pendant === 'inicial') {
    return (
      <div className="flex flex-col items-center">
        {bail}
        <span className="display -mt-1 text-[clamp(4rem,12vw,6rem)] leading-none" style={fill}>
          {(text || 'S').slice(0, 1).toUpperCase()}
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center">
      {bail}
      <div
        className="flex aspect-[3/4] w-[clamp(5.5rem,22vw,7.5rem)] items-center justify-center rounded-[6px] p-2 shadow-[inset_0_0_0_3px_rgb(138_95_23/0.55),0_8px_18px_rgb(60_40_10/0.3)]"
        style={{ background: c.pendantIced ? pave : gold }}
      >
        <span
          className="display max-w-full text-center text-[1.05rem] leading-tight break-words text-[#6b4a12]"
          style={{ textShadow: '0 1px 0 rgb(255 240 200 / 0.7)' }}
        >
          {text || 'Tu texto'}
        </span>
      </div>
    </div>
  );
}

function Step({ n, title, children, aside }: { n: number; title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <fieldset className="border-t border-border pt-6">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-baseline justify-between gap-4">
        <p className="flex items-baseline gap-3">
          <span className="display text-2xl text-gold">{n}</span>
          <span className="eyebrow text-[0.66rem] text-ink" aria-hidden="true">
            {title}
          </span>
        </p>
        {aside && <span className="text-xs text-ink-soft">{aside}</span>}
      </div>
      <div className="mt-4">{children}</div>
    </fieldset>
  );
}

function Chip({ selected, onSelect, name, value, children, disabled }: { selected: boolean; onSelect: () => void; name: string; value: string; children: ReactNode; disabled?: boolean }) {
  return (
    <label
      className={cn(
        'inline-flex min-h-11 cursor-pointer items-center justify-center border px-4 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold',
        selected ? 'border-ink bg-ink text-ivory' : 'border-border bg-paper hover:border-ink',
        disabled && 'pointer-events-none opacity-40',
      )}
    >
      <input type="radio" name={name} value={value} checked={selected} onChange={onSelect} disabled={disabled} className="sr-only" />
      {children}
    </label>
  );
}

export function Configurator() {
  const [c, setC] = useState<ChainConfig>(defaultConfig);
  const [added, setAdded] = useState(false);
  const { add, setOpen } = useCart();
  const type = chainTypes[c.type];
  const price = priceOf(c);
  const p = pendants[c.pendant];
  const needsText = c.pendant !== 'ninguno' && !c.text.trim();

  const set = (patch: Partial<ChainConfig>) => {
    setAdded(false);
    setC((prev) => {
      const next = { ...prev, ...patch };
      // Keep the width valid for the type and drop pavé where it does not apply.
      if (!chainTypes[next.type].widths.some((w) => w.mm === next.mm)) next.mm = chainTypes[next.type].widths[1]?.mm ?? chainTypes[next.type].widths[0].mm;
      if (!chainTypes[next.type].canIce) next.iced = false;
      if (patch.pendant && patch.pendant !== prev.pendant && patch.text === undefined) next.text = patch.pendant === 'inicial' ? prev.text.slice(0, 1) : prev.text.slice(0, pendants[patch.pendant].maxLength);
      return next;
    });
  };

  const addToBag = () => {
    if (needsText) return;
    add({
      id: `cadena:${describe(c)}`,
      size: `${c.length} cm`,
      engraving: '',
      custom: { title: 'Cadena personalizada', detail: describe(c), price: price.total, image: imageOf(c) },
    });
    setAdded(true);
    setTimeout(() => setOpen(true), 500);
  };

  return (
    <section id="personaliza" aria-labelledby="personaliza-titulo" className="bg-sand-soft px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Cadenas personalizables"
          title={<span id="personaliza-titulo">Crea tu cadena</span>}
          intro="Elige la cadena, el grosor y el largo, y súmale un dije con tu nombre, una placa grabada o tu inicial. El precio se actualiza mientras eliges."
        />

        <Reveal className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {presets.map((pr) => {
            const active = JSON.stringify(pr.config) === JSON.stringify(c);
            return (
              <button
                key={pr.id}
                type="button"
                aria-pressed={active}
                onClick={() => set(pr.config)}
                className={cn('border p-5 text-left transition-colors', active ? 'border-ink bg-ink text-ivory' : 'border-ink/15 bg-paper hover:border-ink')}
              >
                <span className="display block text-xl">{pr.name}</span>
                <span className={cn('mt-1 block text-sm', active ? 'text-ivory/70' : 'text-ink-soft')}>{pr.text}</span>
                <span className={cn('mt-3 block text-sm font-medium', active ? 'text-gold-pale' : 'text-ink')}>
                  Desde {formatPrice(priceOf(pr.config).total)}
                </span>
              </button>
            );
          })}
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* Vista previa */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand">
              <AnimatePresence mode="wait">
                <motion.img
                  key={imageOf(c)}
                  src={productImage(imageOf(c))}
                  alt={`Vista previa: cadena ${describe(c)}`}
                  className={cn('absolute inset-x-0 top-0 mx-auto w-full object-contain', c.pendant === 'ninguno' ? 'h-full' : 'h-[80%]')}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              <div className="absolute inset-x-0 top-[70%] flex justify-center">
                <PendantPreview c={c} />
              </div>
              <p className="eyebrow absolute top-4 left-4 bg-ivory/85 px-3 py-1.5 text-[0.58rem] text-ink backdrop-blur">Vista previa</p>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-xs text-ink-soft">Peso aprox.</dt>
                <dd className="mt-1 tabular-nums">{price.grams} g de oro</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft">Ancho</dt>
                <dd className="mt-1 tabular-nums">{widthOf(c).mm} mm</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft">Entrega</dt>
                <dd className="mt-1">3 a 4 semanas</dd>
              </div>
            </dl>
          </div>

          {/* Opciones */}
          <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()} aria-label="Opciones de la cadena">
            <Step n={1} title="Tipo de cadena">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(Object.keys(chainTypes) as ChainType[]).map((t) => (
                  <label
                    key={t}
                    className={cn(
                      'cursor-pointer border p-2 text-center transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold',
                      c.type === t ? 'border-ink bg-paper' : 'border-border bg-paper/60 hover:border-ink',
                    )}
                  >
                    <input type="radio" name="tipo" value={t} checked={c.type === t} onChange={() => set({ type: t })} className="sr-only" />
                    <img src={productImage(chainTypes[t].image)} alt="" className="mx-auto aspect-square w-full object-contain" />
                    <span className="mt-1 flex items-center justify-center gap-1.5 text-sm">
                      {c.type === t && <Check className="size-3.5 text-gold" strokeWidth={2} />}
                      {chainTypes[t].name}
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-sm text-ink-soft">{type.note}</p>
            </Step>

            <Step n={2} title="Grosor">
              <div className="flex flex-wrap gap-2">
                {type.widths.map((w) => (
                  <Chip key={w.mm} name="grosor" value={String(w.mm)} selected={c.mm === w.mm} onSelect={() => set({ mm: w.mm })}>
                    {w.mm} mm
                  </Chip>
                ))}
              </div>
            </Step>

            <Step n={3} title="Largo" aside="45 cm: cuello · 55 cm: clavícula · 65 cm: pecho">
              <div className="flex flex-wrap gap-2">
                {lengths.map((l) => (
                  <Chip key={l} name="largo" value={String(l)} selected={c.length === l} onSelect={() => set({ length: l })}>
                    {l} cm
                  </Chip>
                ))}
              </div>
            </Step>

            <Step n={4} title="Acabado" aside={type.canIce ? undefined : `La ${type.name.toLowerCase()} va pulida`}>
              <div className="flex flex-wrap gap-2">
                <Chip name="acabado" value="pulida" selected={!c.iced} onSelect={() => set({ iced: false })}>
                  Pulida a espejo
                </Chip>
                <Chip name="acabado" value="iced" selected={c.iced} onSelect={() => set({ iced: true })} disabled={!type.canIce}>
                  Iced con diamantes (+60 %)
                </Chip>
              </div>
            </Step>

            <Step n={5} title="Dije">
              <div className="flex flex-wrap gap-2">
                {(Object.keys(pendants) as PendantType[]).map((k) => (
                  <Chip key={k} name="dije" value={k} selected={c.pendant === k} onSelect={() => set({ pendant: k })}>
                    {pendants[k].name}
                  </Chip>
                ))}
              </div>
              {c.pendant !== 'ninguno' && (
                <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <label className="block" htmlFor="dije-texto">
                    <span className="text-sm">{c.pendant === 'inicial' ? 'Letra' : c.pendant === 'placa' ? 'Texto grabado' : 'Nombre'}</span>
                    <input
                      id="dije-texto"
                      className="field mt-2 bg-paper"
                      value={c.text}
                      maxLength={p.maxLength}
                      onChange={(e) => set({ text: c.pendant === 'inicial' ? e.target.value.slice(-1).toUpperCase() : e.target.value })}
                      aria-invalid={needsText}
                      aria-describedby="dije-ayuda"
                    />
                    <span id="dije-ayuda" className={cn('mt-1.5 block text-xs', needsText ? 'text-red-800' : 'text-ink-soft')}>
                      {needsText ? 'Escribe el texto del dije para continuar.' : p.hint}
                    </span>
                  </label>
                  <label className="inline-flex min-h-12 cursor-pointer items-center gap-3 border border-border bg-paper px-4 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold sm:mb-6">
                    <input
                      type="checkbox"
                      checked={c.pendantIced}
                      onChange={(e) => set({ pendantIced: e.target.checked })}
                      className="size-4 accent-[#17140f]"
                    />
                    Dije iced (+{formatPrice(p.icedPrice)})
                  </label>
                </div>
              )}
            </Step>

            <div className="border-t border-ink pt-6">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">
                    Cadena {type.name.toLowerCase()} {c.mm} mm · {c.length} cm{c.iced ? ' · iced' : ''}
                  </dt>
                  <dd className="tabular-nums">{formatPrice(price.chain)}</dd>
                </div>
                {c.pendant !== 'ninguno' && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-soft">
                      Dije {p.name.toLowerCase()}
                      {c.pendantIced ? ' iced' : ''}
                    </dt>
                    <dd className="tabular-nums">{formatPrice(price.pendant)}</dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between gap-4 pt-3">
                  <dt className="eyebrow text-[0.66rem]">Total</dt>
                  <dd className="display text-4xl tabular-nums" aria-live="polite">
                    {formatPrice(price.total)}
                  </dd>
                </div>
              </dl>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={addToBag} disabled={needsText} className="btn btn-dark disabled:opacity-50">
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
                  href={whatsappLink(`Hola, Casa del Sebas. Quiero esta cadena personalizada: ${describe(c)}. Total en la web: ${formatPrice(price.total)}.`)}
                >
                  <WhatsAppIcon className="size-4" /> Consultar por WhatsApp
                </a>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ink-soft">
                Oro de 18k macizo. Los dijes iced llevan diamantes de laboratorio VS. Antes de fundir te enviamos el diseño en 3D para que lo apruebes.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
