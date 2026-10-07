import { ChevronDown, Clock, MapPin } from 'lucide-react';
import { Reveal, SectionHeading } from '@/components/reveal';
import { InstagramIcon, Monogram, WhatsAppIcon } from '@/components/brand-icons';
import { INSTAGRAM_URL, WHATSAPP_DISPLAY, whatsappLink } from '@/lib/site';

export function Gold18k() {
  const tones = [
    { name: 'Amarillo', swatch: 'linear-gradient(135deg,#8a5f17,#e2b75c 40%,#f8e3a8 55%,#b8862c)', note: 'El de siempre. Toda la colección viene en este tono.' },
    { name: 'Blanco', swatch: 'linear-gradient(135deg,#8d8a83,#e6e3dc 45%,#ffffff 55%,#a9a59c)', note: 'Bajo pedido, con baño de rodio que realza los diamantes.' },
    { name: 'Rosado', swatch: 'linear-gradient(135deg,#8c4f3a,#e3a588 45%,#f6d2bf 55%,#b97761)', note: 'Bajo pedido. Más cobre en la aleación, el mismo 75 % de oro.' },
  ];
  return (
    <section id="oro-18k" aria-labelledby="oro-titulo" className="bg-sand px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <p className="eyebrow text-ink-soft">El oro 18k</p>
          <h2 id="oro-titulo" className="display mt-4 text-4xl sm:text-5xl lg:text-6xl">
            Setecientas cincuenta partes de mil.
          </h2>
          <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">
            El oro de 18 quilates es 75 % oro puro. El otro 25 % es plata y cobre, lo justo para que la pieza aguante el uso diario sin rayarse ni deformarse. Más puro sería demasiado blando para una cubana; menos puro ya no es alta joyería.
          </p>
          <figure className="mt-10" aria-label="Composición del oro de 18 quilates">
            <div className="flex h-14 overflow-hidden">
              <div className="flex w-3/4 items-center px-4 text-sm font-medium text-ink" style={{ background: 'linear-gradient(100deg,#b8862c,#e2b75c 50%,#c99637)' }}>
                75 % oro fino
              </div>
              <div className="flex w-1/4 items-center justify-center bg-ink text-xs text-ivory">25 % aleación</div>
            </div>
            <figcaption className="mt-3 text-xs text-ink-soft">Cada pieza lleva grabado el sello 750 y sale con certificado de pureza y peso.</figcaption>
          </figure>
        </Reveal>
        <div className="grid content-center gap-4">
          {tones.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className="flex items-center gap-6 bg-ivory/60 p-5 backdrop-blur-sm">
              <span className="size-16 shrink-0 rounded-full shadow-inner" style={{ background: t.swatch }} aria-hidden="true" />
              <div>
                <h3 className="display text-2xl">Oro {t.name.toLowerCase()} 18k</h3>
                <p className="mt-1 text-sm text-ink-soft">{t.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: '¿El oro de 18k se pone negro o se cae?',
    a: 'No. No es un baño: la pieza es oro macizo de 18k de lado a lado. Con el tiempo puede perder brillo por el uso, y se lo devolvemos gratis en el taller.',
  },
  {
    q: '¿Cómo limpio mis joyas?',
    a: 'Agua tibia, unas gotas de jabón neutro y un cepillo de dientes suave; seca con un paño de microfibra. Evita el cloro de las piscinas y los perfumes directo sobre las piedras.',
  },
  {
    q: '¿Qué cubre la garantía de por vida?',
    a: 'Defectos de fabricación, soldaduras, broches y piedras que se suelten por fallas del engaste. Además, una limpieza y un pulido al año sin costo.',
  },
  {
    q: '¿Qué largo de cadena me sirve?',
    a: '45 cm queda en la base del cuello; 50 a 55 cm, sobre la clavícula; 60 cm, en el pecho, y 65 cm, más abajo, ideal para llevar un dije grande. Si dudas, en la cita te las probamos.',
  },
  {
    q: '¿Las manillas tejidas se pueden mojar?',
    a: 'Sí. El hilo es encerado y aguanta la ducha y el mar; el oro de 18k no se oxida. Si con los años el tejido se gasta, lo volvemos a tejer conservando tus piezas de oro.',
  },
  {
    q: '¿Cómo son los envíos?',
    a: 'Sin costo y asegurados por el valor total de la pieza, a cualquier ciudad de Colombia, en 24 a 72 horas para las piezas en existencia. Las piezas a medida se entregan en tres a cinco semanas.',
  },
  {
    q: '¿Puedo cambiar una pieza?',
    a: 'Tienes 15 días para cambiar una pieza sin uso y sin grabado. Las tallas de anillo se ajustan sin costo la primera vez.',
  },
  {
    q: '¿Los diamantes son reales?',
    a: 'Sí. Usamos diamantes de laboratorio de pureza VS: química y ópticamente son diamante, con el mismo brillo y dureza que uno de mina. Si prefieres diamantes naturales, los cotizamos a medida.',
  },
];

export function Care() {
  return (
    <section id="cuidado" aria-labelledby="cuidado-titulo" className="bg-paper px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="Cuidado y garantía" title={<span id="cuidado-titulo">Preguntas de la casa</span>} />
        <Reveal className="mt-12 divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-1">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left [&::-webkit-details-marker]:hidden">
                <span className="display text-xl sm:text-2xl">{f.q}</span>
                <ChevronDown className="size-5 shrink-0 text-gold transition-transform duration-300 group-open:rotate-180" strokeWidth={1.5} />
              </summary>
              <p className="pb-6 leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function Visit() {
  return (
    <section aria-labelledby="visita-titulo" className="bg-noir px-4 py-20 text-center text-ivory sm:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-2xl">
        <Monogram className="mx-auto size-14 text-gold-bright" />
        <h2 id="visita-titulo" className="display mt-8 text-4xl sm:text-6xl">
          Ven a sentir <em className="gold-text">el peso.</em>
        </h2>
        <p className="mx-auto mt-6 max-w-md leading-relaxed text-ivory/70">
          Atendemos con cita privada para que pruebes las piezas con calma, sin vitrinas ni afanes.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={whatsappLink('Hola, Casa del Sebas. Quiero agendar una cita privada.')} target="_blank" rel="noreferrer" className="btn btn-gold">
            <WhatsAppIcon className="size-4" /> Agendar por WhatsApp
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="btn btn-line text-ivory hover:!border-ivory hover:!bg-ivory hover:!text-ink">
            <InstagramIcon className="size-4" /> Ver Instagram
          </a>
        </div>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 text-sm text-ivory/60 sm:flex-row sm:gap-10">
          <span className="flex items-center gap-2">
            <MapPin className="size-4 text-gold-bright" strokeWidth={1.5} /> Showroom con cita · Colombia
          </span>
          <span className="flex items-center gap-2">
            <WhatsAppIcon className="size-4 text-gold-bright" /> WhatsApp {WHATSAPP_DISPLAY}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="size-4 text-gold-bright" strokeWidth={1.5} /> Lunes a sábado, 10:00 a 19:00
          </span>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const cols = [
    { title: 'Colección', links: [['Cadenas', '#coleccion'], ['Pulsos', '#coleccion'], ['Manillas tejidas', '#coleccion'], ['Dijes', '#coleccion'], ['Anillos y aretes', '#coleccion']] },
    { title: 'La casa', links: [['A medida', '#a-medida'], ['El oro 18k', '#oro-18k'], ['Cuidado y garantía', '#cuidado']] },
    {
      title: 'Contacto',
      links: [
        [`WhatsApp ${WHATSAPP_DISPLAY}`, whatsappLink('Hola, Casa del Sebas.')],
        ['Instagram', INSTAGRAM_URL],
      ],
    },
  ];
  return (
    <footer className="border-t border-gold/20 bg-noir px-4 pt-16 pb-10 text-ivory/70 sm:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <div className="flex items-center gap-3 text-ivory">
            <Monogram className="size-9 text-gold-bright" />
            <span className="display text-xl tracking-[0.28em] uppercase">Casa del Sebas</span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed">Alta joyería en oro macizo de 18 quilates. Hecha a mano, pesada frente a ti y garantizada de por vida.</p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="eyebrow text-[0.64rem] text-gold-bright">{c.title}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="transition-colors hover:text-ivory" {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto mt-16 flex max-w-[1400px] flex-col gap-3 border-t border-ivory/10 pt-6 text-xs sm:flex-row sm:justify-between">
        <p>© {year} Casa del Sebas. Todos los derechos reservados.</p>
        <p>Precios en pesos colombianos, IVA incluido.</p>
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink('Hola, Casa del Sebas. Tengo una pregunta.')}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] z-30 inline-flex size-14 items-center justify-center rounded-full bg-ink text-gold-bright shadow-xl ring-1 ring-gold-bright/40 transition-transform hover:scale-105 sm:right-6 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
    >
      <WhatsAppIcon className="size-6" />
    </a>
  );
}
