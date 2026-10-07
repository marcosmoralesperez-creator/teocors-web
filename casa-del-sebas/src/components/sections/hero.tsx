import { motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import heroPhoto from '@/assets/photos/hero.webp';
import { formatPrice, productById } from '@/data/products';
import { whatsappLink } from '@/lib/site';

// Piezas señaladas sobre la foto (posición en % de la imagen).
const hotspots = [
  { id: 'cubana-iced-14', x: 73, y: 30 },
  { id: 'placa-iced', x: 51, y: 54 },
  { id: 'pulsera-cubana-iced', x: 60, y: 87 },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ onView }: { onView: (id: string) => void }) {
  return (
    <section id="inicio" className="relative overflow-hidden bg-sand">
      <div className="mx-auto grid max-w-[1400px] items-center gap-6 px-4 pt-24 sm:px-8 lg:min-h-[100svh] lg:grid-cols-[1.05fr_1fr] lg:gap-0 lg:pt-20">
        <div className="relative z-10 max-w-xl py-6 lg:py-16">
          <motion.p className="eyebrow text-ink-soft" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
            Alta joyería · Oro de 18 quilates
          </motion.p>
          <motion.h1
            className="display mt-6 text-[3.4rem] text-ink sm:text-7xl xl:text-[5.6rem]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease }}
          >
            El oro se lleva <em className="gold-text pr-2 not-italic sm:italic">con peso.</em>
          </motion.h1>
          <motion.p
            className="mt-7 max-w-md text-lg leading-relaxed text-ink-soft"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease }}
          >
            Cubanas, tenis y dijes iced en oro macizo de 18k, engastados a mano con diamantes. Cada pieza sale del taller con su sello 750 y certificado de pureza.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease }}
          >
            <a href="#coleccion" className="btn btn-dark group">
              Ver la colección
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </a>
            <a href={whatsappLink('Hola, Casa del Sebas. Quiero agendar una cita privada.')} target="_blank" rel="noreferrer" className="btn btn-line text-ink">
              Agendar cita privada
            </a>
          </motion.div>
          <motion.dl
            className="mt-14 grid max-w-md grid-cols-3 gap-4 border-t border-ink/15 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {[
              ['750', 'milésimas de oro puro'],
              ['100%', 'macizo, sin relleno'],
              ['Vitalicia', 'garantía del taller'],
            ].map(([n, t]) => (
              <div key={t}>
                <dt className="display text-2xl text-ink sm:text-3xl">{n}</dt>
                <dd className="mt-1 text-xs leading-snug text-ink-soft">{t}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-[640px] self-end lg:mr-0 lg:max-w-[min(640px,calc(100svh-6rem))]"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease }}
        >
          <img
            src={heroPhoto}
            alt="Mano con cadena de placa iced, cadena cubana y pulseras cubanas iced en oro de 18k"
            width={736}
            height={736}
            fetchPriority="high"
            className="block aspect-square w-full object-cover [mask-image:linear-gradient(to_bottom,transparent,#000_10%),linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] [mask-composite:intersect]"
          />
          {hotspots.map((h, i) => {
            const p = productById(h.id)!;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => onView(h.id)}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                aria-label={`Ver ${p.name}, ${formatPrice(p.price)}`}
              >
                <motion.span
                  className="relative flex size-9 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-lg backdrop-blur"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.15, type: 'spring', stiffness: 260, damping: 18 }}
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-ivory/60 motion-reduce:hidden" />
                  <Plus className="relative size-4" strokeWidth={1.5} />
                </motion.span>
                <span className="pointer-events-none absolute top-1/2 left-12 hidden -translate-y-1/2 bg-ivory px-4 py-2.5 text-left whitespace-nowrap opacity-0 shadow-xl transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
                  <span className="block text-sm font-medium text-ink">{p.name}</span>
                  <span className="block text-xs text-ink-soft">{formatPrice(p.price)}</span>
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export function TrustMarquee() {
  const items = ['Oro 18k certificado', 'Hecho a mano', 'Manillas tejidas a mano', 'Diamantes VS de laboratorio', 'Envío asegurado', 'Garantía de por vida', 'Sello 750 en cada pieza'];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-gold/25 bg-noir py-4 text-gold-pale" aria-label={items.join(', ')}>
      <div className="flex w-max animate-marquee motion-reduce:animate-none" aria-hidden="true">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {row.map((t, i) => (
              <span key={`${k}-${i}`} className="eyebrow flex items-center gap-10 px-5 text-[0.68rem]">
                {t}
                <span className="text-gold-bright">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
