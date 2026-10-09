import { useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { chainTypes, describe, imageOf, lengths, pendants, priceOf, widthOf, type ChainConfig, type ChainType, type PendantType } from '@/data/custom-chain';
import {
  anilloSizes,
  anilloStyles,
  aretesPrice,
  aretesStyles,
  defaultStyle,
  DOUBLE_WRAP,
  kinds,
  manillaPieces,
  manillaPrice,
  pulsoPrice,
  pulsoSizes,
  pulsoTypes,
  pulsoWidth,
  SINGLE_FACTOR,
  stylePresets,
  threads,
  type AnilloConfig,
  type AnilloStyle,
  type AretesConfig,
  type AretesStyle,
  type Kind,
  type ManillaConfig,
  type ManillaPiece,
  type PulsoConfig,
  type PulsoType,
  type StyleConfig,
} from '@/data/custom-style';
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

function TextField({ id, label, value, max, hint, error, onChange }: { id: string; label: string; value: string; max: number; hint: string; error?: string; onChange: (v: string) => void }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm">{label}</span>
      <input
        id={id}
        className="field mt-2 bg-paper"
        value={value}
        maxLength={max}
        onChange={(e) => onChange(max === 1 ? e.target.value.slice(-1).toUpperCase() : e.target.value)}
        aria-invalid={!!error}
        aria-describedby={`${id}-ayuda`}
      />
      <span id={`${id}-ayuda`} className={cn('mt-1.5 block text-xs', error ? 'text-red-800' : 'text-ink-soft')}>
        {error ?? hint}
      </span>
    </label>
  );
}

/** Lo que muestra la columna de vista previa y el resumen de precio, para cualquier pieza. */
interface Summary {
  title: string;
  image: string;
  overlay?: ReactNode;
  caption?: string;
  lines: { label: string; price: number }[];
  total: number;
  facts: { label: string; value: string }[];
  detail: string;
  error?: string;
}

function cadenaSummary(c: ChainConfig): Summary {
  const price = priceOf(c);
  const type = chainTypes[c.type];
  const p = pendants[c.pendant];
  const lines = [{ label: `Cadena ${type.name.toLowerCase()} ${c.mm} mm · ${c.length} cm`, price: price.chain }];
  if (c.pendant !== 'ninguno') lines.push({ label: `Dije ${p.name.toLowerCase()}${c.pendantIced ? ' iced' : ''}`, price: price.pendant });
  return {
    title: 'Cadena a tu estilo',
    image: imageOf(c),
    overlay: c.pendant !== 'ninguno' ? <PendantPreview c={c} /> : undefined,
    lines,
    total: price.total,
    facts: [
      { label: 'Peso aprox.', value: `${price.grams} g de oro` },
      { label: 'Ancho', value: `${widthOf(c).mm} mm` },
      { label: 'Entrega', value: '3 a 4 semanas' },
    ],
    detail: describe(c),
    error: c.pendant !== 'ninguno' && !c.text.trim() ? 'Escribe el texto del dije para continuar.' : undefined,
  };
}

function pulsoSummary(c: PulsoConfig): Summary {
  const t = pulsoTypes[c.type];
  const price = pulsoPrice(c);
  const text = t.engraving ? c.text.trim() : '';
  const lines = [{ label: `Pulso ${t.name.toLowerCase()} ${c.mm} mm · ${c.size} cm`, price: price.total }];
  if (text) lines.push({ label: `Grabado «${text}»`, price: 0 });
  return {
    title: 'Pulso a tu estilo',
    image: t.image,
    caption: text ? `Grabado: «${text}»` : undefined,
    lines,
    total: price.total,
    facts: [
      { label: 'Peso aprox.', value: `${price.grams} g de oro` },
      { label: 'Ancho', value: `${pulsoWidth(c).mm} mm` },
      { label: 'Entrega', value: '2 a 3 semanas' },
    ],
    detail: `${t.name} ${c.mm} mm · ${c.size} cm${text ? ` · grabado «${text}»` : ''}`,
  };
}

function manillaSummary(c: ManillaConfig): Summary {
  const piece = manillaPieces[c.piece];
  const thread = threads.find((t) => t.name === c.thread) ?? threads[0];
  const text = piece.text ? c.text.trim() : '';
  const lines = [{ label: `${piece.name} en oro 18k · hilo ${thread.name.toLowerCase()}`, price: piece.price }];
  if (c.double) lines.push({ label: 'Doble vuelta de hilo', price: DOUBLE_WRAP });
  if (text) lines.push({ label: `${piece.text!.label} «${text}»`, price: 0 });
  return {
    title: 'Manilla a tu estilo',
    image: `${piece.product}--${thread.slug}`,
    caption: text ? `${piece.text!.label}: «${text}»` : undefined,
    lines,
    total: manillaPrice(c),
    facts: [
      { label: 'Oro', value: piece.grams },
      { label: 'Tejido', value: piece.weave },
      { label: 'Entrega', value: '3 a 5 días hábiles' },
    ],
    detail: `${piece.name} · hilo ${thread.name.toLowerCase()}${c.double ? ' · doble vuelta' : ''}${text ? ` · «${text}»` : ''}`,
    error: piece.text && !text ? `Escribe ${piece.text.max === 1 ? 'la letra' : 'el texto'} para continuar.` : undefined,
  };
}

function aretesSummary(c: AretesConfig): Summary {
  const s = aretesStyles[c.style];
  const total = aretesPrice(c);
  return {
    title: 'Aretes a tu estilo',
    image: c.single ? `${s.image}--uno` : s.image,
    lines: [{ label: `${s.name} ${c.size} · ${c.single ? 'un solo arete' : 'el par'}`, price: total }],
    total,
    facts: [
      { label: s.sizeLabel, value: c.size },
      { label: 'Cantidad', value: c.single ? '1 arete' : 'Par' },
      { label: 'Entrega', value: '2 a 3 semanas' },
    ],
    detail: `${s.name} ${c.size} · ${c.single ? 'un solo arete' : 'par'}`,
  };
}

function anilloSummary(c: AnilloConfig): Summary {
  const s = anilloStyles[c.style];
  const text = s.text ? c.text.trim() : '';
  const lines = [{ label: `Anillo ${s.name.toLowerCase()} · talla ${c.size}`, price: s.price }];
  if (text) lines.push({ label: `Iniciales «${text}»`, price: 0 });
  return {
    title: 'Anillo a tu estilo',
    image: s.image,
    caption: text ? `Iniciales: «${text}»` : undefined,
    lines,
    total: s.price,
    facts: [
      { label: 'Peso aprox.', value: s.grams },
      { label: 'Talla', value: String(c.size) },
      { label: 'Entrega', value: '2 a 3 semanas' },
    ],
    detail: `${s.name} · talla ${c.size}${text ? ` · iniciales «${text}»` : ''}`,
  };
}

function summaryOf(s: StyleConfig): Summary {
  switch (s.kind) {
    case 'cadena':
      return cadenaSummary(s.cadena);
    case 'pulso':
      return pulsoSummary(s.pulso);
    case 'manilla':
      return manillaSummary(s.manilla);
    case 'aretes':
      return aretesSummary(s.aretes);
    case 'anillo':
      return anilloSummary(s.anillo);
  }
}

/* ---------------------------------------------------------------- options per piece */

function CadenaOptions({ c, set }: { c: ChainConfig; set: (p: Partial<ChainConfig>) => void }) {
  const type = chainTypes[c.type];
  const p = pendants[c.pendant];
  return (
    <>
      <Step n={2} title="Tipo de cadena">
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(chainTypes) as ChainType[]).map((t) => (
            <ImageChoice key={t} name="cadena-tipo" selected={c.type === t} onSelect={() => set({ type: t })} image={chainTypes[t].image} label={chainTypes[t].name} />
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-soft">{type.note}</p>
      </Step>
      <Step n={3} title="Grosor">
        <div className="flex flex-wrap gap-2">
          {type.widths.map((w) => (
            <Chip key={w.mm} name="cadena-grosor" value={String(w.mm)} selected={c.mm === w.mm} onSelect={() => set({ mm: w.mm })}>
              {w.mm} mm
            </Chip>
          ))}
        </div>
      </Step>
      <Step n={4} title="Largo" aside="45 cm: cuello · 55 cm: clavícula · 65 cm: pecho">
        <div className="flex flex-wrap gap-2">
          {lengths.map((l) => (
            <Chip key={l} name="cadena-largo" value={String(l)} selected={c.length === l} onSelect={() => set({ length: l })}>
              {l} cm
            </Chip>
          ))}
        </div>
      </Step>
      <Step n={5} title="Dije">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(pendants) as PendantType[]).map((k) => (
            <Chip key={k} name="cadena-dije" value={k} selected={c.pendant === k} onSelect={() => set({ pendant: k })}>
              {pendants[k].name}
            </Chip>
          ))}
        </div>
        {c.pendant !== 'ninguno' && (
          <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
            <TextField
              id="dije-texto"
              label={c.pendant === 'inicial' ? 'Letra' : c.pendant === 'placa' ? 'Texto grabado' : 'Nombre'}
              value={c.text}
              max={p.maxLength}
              hint={p.hint}
              error={!c.text.trim() ? 'Escribe el texto del dije para continuar.' : undefined}
              onChange={(text) => set({ text })}
            />
            <Toggle checked={c.pendantIced} onChange={(pendantIced) => set({ pendantIced })} className="sm:mt-7">
              Dije iced (+{formatPrice(p.icedPrice)})
            </Toggle>
          </div>
        )}
      </Step>
    </>
  );
}

function PulsoOptions({ c, set }: { c: PulsoConfig; set: (p: Partial<PulsoConfig>) => void }) {
  const t = pulsoTypes[c.type];
  return (
    <>
      <Step n={2} title="Tipo de pulso">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(Object.keys(pulsoTypes) as PulsoType[]).map((k) => (
            <ImageChoice key={k} name="pulso-tipo" selected={c.type === k} onSelect={() => set({ type: k })} image={pulsoTypes[k].image} label={pulsoTypes[k].name} />
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-soft">{t.note}</p>
      </Step>
      <Step n={3} title="Grosor">
        <div className="flex flex-wrap gap-2">
          {t.widths.map((w) => (
            <Chip key={w.mm} name="pulso-grosor" value={String(w.mm)} selected={c.mm === w.mm} onSelect={() => set({ mm: w.mm })}>
              {w.mm} mm
            </Chip>
          ))}
        </div>
      </Step>
      <Step n={4} title="Talla" aside="Mide tu muñeca y suma 1 cm">
        <div className="flex flex-wrap gap-2">
          {pulsoSizes.map((cm) => (
            <Chip key={cm} name="pulso-talla" value={String(cm)} selected={c.size === cm} onSelect={() => set({ size: cm })}>
              {cm} cm
            </Chip>
          ))}
        </div>
      </Step>
      {t.engraving && (
        <Step n={5} title="Grabado de la placa" aside="Incluido">
          <TextField id="pulso-texto" label="Texto" value={c.text} max={20} hint="Nombre, fecha o iniciales. Hasta 20 caracteres." onChange={(text) => set({ text })} />
        </Step>
      )}
    </>
  );
}

function ManillaOptions({ c, set }: { c: ManillaConfig; set: (p: Partial<ManillaConfig>) => void }) {
  const piece = manillaPieces[c.piece];
  const slug = threads.find((t) => t.name === c.thread)?.slug ?? 'negro';
  return (
    <>
      <Step n={2} title="Pieza de oro">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(Object.keys(manillaPieces) as ManillaPiece[]).map((k) => (
            <ImageChoice
              key={k}
              name="manilla-pieza"
              selected={c.piece === k}
              onSelect={() => set({ piece: k })}
              image={`${manillaPieces[k].product}--${slug}`}
              label={manillaPieces[k].name}
            />
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-soft">
          {piece.weave} a mano · {piece.grams} de oro de 18k · nudo corredizo de 15 a 22 cm
        </p>
      </Step>
      <Step n={3} title="Color del hilo">
        <div className="flex flex-wrap gap-2">
          {threads.map((t) => (
            <Chip key={t.slug} name="manilla-hilo" value={t.name} selected={c.thread === t.name} onSelect={() => set({ thread: t.name })}>
              <span className="mr-2 inline-block size-3.5 rounded-full ring-1 ring-ivory/30" style={{ background: t.color }} aria-hidden="true" />
              {t.name}
            </Chip>
          ))}
        </div>
      </Step>
      <Step n={4} title="Extras">
        <Toggle checked={c.double} onChange={(double) => set({ double })}>
          Doble vuelta de hilo (+{formatPrice(DOUBLE_WRAP)})
        </Toggle>
      </Step>
      {piece.text && (
        <Step n={5} title={piece.text.max === 1 ? 'Tu letra' : 'Grabado'}>
          <TextField
            id="manilla-texto"
            label={piece.text.label}
            value={c.text}
            max={piece.text.max}
            hint={piece.text.hint}
            error={!c.text.trim() ? `Escribe ${piece.text.max === 1 ? 'la letra' : 'el texto'} para continuar.` : undefined}
            onChange={(text) => set({ text })}
          />
        </Step>
      )}
    </>
  );
}

function AretesOptions({ c, set }: { c: AretesConfig; set: (p: Partial<AretesConfig>) => void }) {
  const s = aretesStyles[c.style];
  return (
    <>
      <Step n={2} title="Estilo">
        <div className="grid grid-cols-2 gap-2 sm:max-w-md">
          {(Object.keys(aretesStyles) as AretesStyle[]).map((k) => (
            <ImageChoice key={k} name="aretes-estilo" selected={c.style === k} onSelect={() => set({ style: k })} image={aretesStyles[k].image} label={aretesStyles[k].name} />
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-soft">{s.note}</p>
      </Step>
      <Step n={3} title={s.sizeLabel}>
        <div className="flex flex-wrap gap-2">
          {s.sizes.map((z) => (
            <Chip key={z.name} name="aretes-tamano" value={z.name} selected={c.size === z.name} onSelect={() => set({ size: z.name })}>
              {z.name}
            </Chip>
          ))}
        </div>
      </Step>
      <Step n={4} title="Cantidad">
        <div className="flex flex-wrap gap-2">
          <Chip name="aretes-cantidad" value="par" selected={!c.single} onSelect={() => set({ single: false })}>
            El par
          </Chip>
          <Chip name="aretes-cantidad" value="uno" selected={c.single} onSelect={() => set({ single: true })}>
            Un solo arete ({Math.round(SINGLE_FACTOR * 100)} % del par)
          </Chip>
        </div>
      </Step>
    </>
  );
}

function AnilloOptions({ c, set }: { c: AnilloConfig; set: (p: Partial<AnilloConfig>) => void }) {
  const s = anilloStyles[c.style];
  return (
    <>
      <Step n={2} title="Estilo">
        <div className="grid grid-cols-2 gap-2 sm:max-w-md">
          {(Object.keys(anilloStyles) as AnilloStyle[]).map((k) => (
            <ImageChoice key={k} name="anillo-estilo" selected={c.style === k} onSelect={() => set({ style: k })} image={anilloStyles[k].image} label={anilloStyles[k].name} />
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-soft">{s.note}</p>
      </Step>
      <Step n={3} title="Talla" aside="¿No la sabes? Te enviamos un medidor gratis">
        <div className="flex flex-wrap gap-2">
          {anilloSizes.map((n) => (
            <Chip key={n} name="anillo-talla" value={String(n)} selected={c.size === n} onSelect={() => set({ size: n })}>
              {n}
            </Chip>
          ))}
        </div>
      </Step>
      {s.text && (
        <Step n={4} title="Grabado" aside="Incluido">
          <TextField id="anillo-texto" label={s.text.label} value={c.text} max={s.text.max} hint={s.text.hint} onChange={(text) => set({ text: text.toUpperCase() })} />
        </Step>
      )}
    </>
  );
}

function ImageChoice({ name, selected, onSelect, image, label }: { name: string; selected: boolean; onSelect: () => void; image: string; label: string }) {
  return (
    <label
      className={cn(
        'cursor-pointer border p-2 text-center transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold',
        selected ? 'border-ink bg-paper' : 'border-border bg-paper/60 hover:border-ink',
      )}
    >
      <input type="radio" name={name} value={label} checked={selected} onChange={onSelect} className="sr-only" />
      <img src={productImage(image)} alt="" className="mx-auto aspect-square w-full object-contain" />
      <span className="mt-1 flex items-center justify-center gap-1.5 text-sm leading-tight">
        {selected && <Check className="size-3.5 shrink-0 text-gold" strokeWidth={2} />}
        {label}
      </span>
    </label>
  );
}

function Toggle({ checked, onChange, children, className }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; className?: string }) {
  return (
    <label
      className={cn(
        'inline-flex min-h-12 cursor-pointer items-center gap-3 border border-border bg-paper px-4 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold',
        className,
      )}
    >
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[#17140f]" />
      {children}
    </label>
  );
}

/* ---------------------------------------------------------------- section */

export function Configurator() {
  const [s, setS] = useState<StyleConfig>(defaultStyle);
  const [added, setAdded] = useState(false);
  const { add, setOpen } = useCart();
  const sum = summaryOf(s);
  const kindName = kinds.find((k) => k.id === s.kind)!.name;

  const update = (next: (prev: StyleConfig) => StyleConfig) => {
    setAdded(false);
    setS(next);
  };

  const setCadena = (patch: Partial<ChainConfig>) =>
    update((prev) => {
      const prevC = prev.cadena;
      const c = { ...prevC, ...patch };
      // Keep the width valid for the type and drop pavé where it does not apply.
      if (!chainTypes[c.type].widths.some((w) => w.mm === c.mm)) c.mm = chainTypes[c.type].widths[1]?.mm ?? chainTypes[c.type].widths[0].mm;
      if (patch.pendant && patch.pendant !== prevC.pendant && patch.text === undefined) c.text = patch.pendant === 'inicial' ? prevC.text.slice(0, 1) : prevC.text.slice(0, pendants[patch.pendant].maxLength);
      return { ...prev, cadena: c };
    });
  const setPulso = (patch: Partial<PulsoConfig>) =>
    update((prev) => {
      const c = { ...prev.pulso, ...patch };
      const t = pulsoTypes[c.type];
      if (!t.widths.some((w) => w.mm === c.mm)) c.mm = t.widths[1]?.mm ?? t.widths[0].mm;
      return { ...prev, pulso: c };
    });
  const setManilla = (patch: Partial<ManillaConfig>) =>
    update((prev) => {
      const c = { ...prev.manilla, ...patch };
      const max = manillaPieces[c.piece].text?.max;
      if (max && patch.piece && patch.text === undefined) c.text = max === 1 ? c.text.slice(0, 1).toUpperCase() : c.text.slice(0, max);
      return { ...prev, manilla: c };
    });
  const setAretes = (patch: Partial<AretesConfig>) =>
    update((prev) => {
      const c = { ...prev.aretes, ...patch };
      const sizes = aretesStyles[c.style].sizes;
      if (!sizes.some((z) => z.name === c.size)) c.size = sizes[1]?.name ?? sizes[0].name;
      return { ...prev, aretes: c };
    });
  const setAnillo = (patch: Partial<AnilloConfig>) => update((prev) => ({ ...prev, anillo: { ...prev.anillo, ...patch } }));

  const addToBag = () => {
    if (sum.error) return;
    add({
      id: `estilo:${s.kind}:${sum.detail}`,
      size: '',
      engraving: '',
      custom: { title: sum.title, detail: sum.detail, price: sum.total, image: sum.image },
    });
    setAdded(true);
    setTimeout(() => setOpen(true), 500);
  };

  const options: Record<Kind, ReactNode> = {
    cadena: <CadenaOptions c={s.cadena} set={setCadena} />,
    pulso: <PulsoOptions c={s.pulso} set={setPulso} />,
    manilla: <ManillaOptions c={s.manilla} set={setManilla} />,
    aretes: <AretesOptions c={s.aretes} set={setAretes} />,
    anillo: <AnilloOptions c={s.anillo} set={setAnillo} />,
  };
  const hasOverlay = !!sum.overlay;

  return (
    <section id="personaliza" aria-labelledby="personaliza-titulo" className="bg-sand-soft px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Personaliza tu pieza"
          title={<span id="personaliza-titulo">Crea tu estilo</span>}
          intro="Arma tu cadena, tu pulso, tu manilla tejida, tus aretes o tu anillo: elige cada detalle y mira la foto y el precio cambiar mientras eliges."
        />

        <Reveal className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stylePresets.map((pr) => {
            const active = JSON.stringify(pr.apply(s)) === JSON.stringify(s);
            return (
              <button
                key={pr.id}
                type="button"
                aria-pressed={active}
                onClick={() => update(pr.apply)}
                className={cn('border p-5 text-left transition-colors', active ? 'border-ink bg-ink text-ivory' : 'border-ink/15 bg-paper hover:border-ink')}
              >
                <span className="display block text-xl">{pr.name}</span>
                <span className={cn('mt-1 block text-sm', active ? 'text-ivory/70' : 'text-ink-soft')}>{pr.text}</span>
                <span className={cn('mt-3 block text-sm font-medium', active ? 'text-gold-pale' : 'text-ink')}>
                  {formatPrice(summaryOf(pr.apply(s)).total)}
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
                  key={sum.image}
                  src={productImage(sum.image)}
                  alt={`Vista previa: ${sum.title.toLowerCase()}, ${sum.detail}`}
                  className={cn('absolute inset-x-0 top-0 mx-auto w-full object-contain', hasOverlay ? 'h-[80%]' : 'h-full')}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              {hasOverlay && <div className="absolute inset-x-0 top-[70%] flex justify-center">{sum.overlay}</div>}
              <p className="eyebrow absolute top-4 left-4 bg-ivory/85 px-3 py-1.5 text-[0.58rem] text-ink backdrop-blur">Vista previa · {kindName}</p>
              {sum.caption && (
                <p className="display absolute inset-x-4 bottom-4 truncate bg-ink/85 px-4 py-2.5 text-center text-lg text-gold-pale backdrop-blur">{sum.caption}</p>
              )}
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-4 text-sm">
              {sum.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs text-ink-soft">{f.label}</dt>
                  <dd className="mt-1 tabular-nums">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Opciones */}
          <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()} aria-label="Opciones de tu pieza">
            <Step n={1} title="¿Qué quieres crear?">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {kinds.map((k) => (
                  <ImageChoice key={k.id} name="pieza" selected={s.kind === k.id} onSelect={() => update((prev) => ({ ...prev, kind: k.id }))} image={k.image} label={k.name} />
                ))}
              </div>
            </Step>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={s.kind}
                className="flex flex-col gap-8"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {options[s.kind]}
              </motion.div>
            </AnimatePresence>

            <div className="border-t border-ink pt-6">
              <dl className="space-y-1.5 text-sm">
                {sum.lines.map((l) => (
                  <div key={l.label} className="flex justify-between gap-4">
                    <dt className="text-ink-soft">{l.label}</dt>
                    <dd className="shrink-0 tabular-nums">{l.price ? formatPrice(l.price) : 'Incluido'}</dd>
                  </div>
                ))}
                <div className="flex items-baseline justify-between gap-4 pt-3">
                  <dt className="eyebrow text-[0.66rem]">Total</dt>
                  <dd className="display text-4xl tabular-nums" aria-live="polite">
                    {formatPrice(sum.total)}
                  </dd>
                </div>
              </dl>
              {sum.error && (
                <p role="alert" className="mt-3 text-sm text-red-800">
                  {sum.error}
                </p>
              )}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={addToBag} disabled={!!sum.error} className="btn btn-dark disabled:opacity-50">
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
                  href={whatsappLink(`Hola, Casa del Sebas. Quiero crear esta pieza: ${sum.title} — ${sum.detail}. Total en la web: ${formatPrice(sum.total)}.`)}
                >
                  <WhatsAppIcon className="size-4" /> Consultar por WhatsApp
                </a>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ink-soft">
                Todo el oro es de 18k macizo; los diamantes de dijes, aretes y anillos son de laboratorio VS. Antes de fabricar te enviamos el diseño para que lo apruebes.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
