import { useState, type FormEvent } from 'react';
import { CalendarDays, Hammer, PackageCheck, PenTool } from 'lucide-react';
import closeup from '@/assets/photos/cubana-iced-cerca.webp';
import { Reveal, SectionHeading } from '@/components/reveal';
import { SplineSceneBasic } from '@/components/spline-scene-basic';
import { whatsappLink } from '@/lib/site';

export function Closeup() {
  const notes = [
    ['14 mm', 'de ancho por eslabón, cerrado a mano y soldado uno a uno'],
    ['612', 'diamantes de laboratorio VS engastados al grano'],
    ['Doble seguro', 'en el broche de caja, para que no se abra nunca'],
  ];
  return (
    <section aria-labelledby="cerca-titulo" className="relative overflow-hidden bg-noir text-ivory">
      <div className="grid items-center lg:grid-cols-2">
        <Reveal className="relative order-2 lg:order-1">
          <img
            src={closeup}
            alt="Cadena cubana iced de cerca: eslabones cubiertos de diamantes y broche de caja"
            loading="lazy"
            width={778}
            height={428}
            // Fade the photo's edges into the black background.
            className="aspect-[778/428] w-full object-cover [mask-image:linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent),linear-gradient(to_bottom,transparent,#000_16%,#000_84%,transparent)] [mask-composite:intersect]"
          />
        </Reveal>
        <div className="order-1 max-w-2xl px-4 py-20 sm:px-8 lg:order-2 lg:px-16 lg:py-28">
          <Reveal>
            <p className="eyebrow text-gold-bright">La firma de la casa</p>
            <h2 id="cerca-titulo" className="display mt-4 text-4xl sm:text-5xl lg:text-6xl">
              La cubana iced, <em className="gold-text">de cerca.</em>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-ivory/70">
              Una cadena cubana de verdad no es hueca ni tiene baño: es oro macizo de 18k que pesa en la mano. Por eso pesamos cada pieza frente a ti y te damos el número en el certificado.
            </p>
          </Reveal>
          <dl className="mt-12 divide-y divide-ivory/10 border-y border-ivory/10">
            {notes.map(([n, t], i) => (
              <Reveal key={n} delay={i * 0.08} className="flex items-baseline gap-6 py-5">
                <dt className="display w-36 shrink-0 text-3xl text-gold-pale">{n}</dt>
                <dd className="text-sm leading-relaxed text-ivory/70">{t}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

const steps = [
  { icon: CalendarDays, title: 'Cita privada', text: 'En el showroom o por videollamada. Nos cuentas la idea, probamos largos y pesos.' },
  { icon: PenTool, title: 'Diseño en 3D', text: 'Te enviamos el modelo para que lo gires y lo apruebes antes de fundir un solo gramo.' },
  { icon: Hammer, title: 'Taller', text: 'Fundición, pulido y engaste a mano. Entre tres y cinco semanas según la pieza.' },
  { icon: PackageCheck, title: 'Entrega', text: 'Estuche de la casa, certificado de pureza y peso, y envío asegurado hasta tu puerta.' },
];

const pieces = ['Cadena', 'Pulso', 'Manilla tejida', 'Dije', 'Anillo', 'Aretes', 'Grill', 'Otra pieza'];
const budgets = ['Hasta $10.000.000', '$10.000.000 a $25.000.000', '$25.000.000 a $50.000.000', 'Más de $50.000.000'];

export function Bespoke() {
  const [error, setError] = useState('');
  const [link, setLink] = useState('');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('nombre') ?? '').trim();
    const idea = String(f.get('idea') ?? '').trim();
    if (!name || !idea) {
      setError('Escribe tu nombre y cuéntanos la idea para poder ayudarte.');
      return;
    }
    setError('');
    const message = [
      'Hola, Casa del Sebas. Quiero una pieza a medida.',
      `Nombre: ${name}`,
      `Pieza: ${f.get('pieza')}`,
      `Presupuesto: ${f.get('presupuesto')}`,
      `Idea: ${idea}`,
    ].join('\n');
    setLink(whatsappLink(message));
  };

  return (
    <section id="a-medida" aria-labelledby="medida-titulo" className="bg-ivory px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="A medida"
          title={<span id="medida-titulo">Si lo imaginas, lo fundimos</span>}
          intro="Tu inicial, el nombre de tu gente, una placa con tu logo o la cubana más pesada de la ciudad. Hacemos piezas únicas en oro de 18k."
        />

        <ol className="mt-16 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08} className="bg-ivory p-7 lg:p-9">
              <li className="list-none">
                <div className="flex items-center justify-between">
                  <s.icon className="size-6 text-gold" strokeWidth={1.25} />
                  <span className="display text-4xl text-ink/15">0{i + 1}</span>
                </div>
                <h3 className="display mt-8 text-2xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-16">
          <SplineSceneBasic />
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <Reveal>
            <h3 className="display text-3xl sm:text-4xl">Cuéntanos tu idea</h3>
            <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
              Te respondemos por WhatsApp con un boceto, el peso estimado y el precio. La cotización no tiene costo ni compromiso.
            </p>
          </Reveal>
          <Reveal>
            <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="eyebrow text-[0.64rem] text-ink-soft">Nombre</span>
                <input name="nombre" autoComplete="name" required className="field mt-2" />
              </label>
              <label className="block">
                <span className="eyebrow text-[0.64rem] text-ink-soft">Tipo de pieza</span>
                <select name="pieza" className="field mt-2">
                  {pieces.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="eyebrow text-[0.64rem] text-ink-soft">Presupuesto aproximado</span>
                <select name="presupuesto" className="field mt-2">
                  {budgets.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="eyebrow text-[0.64rem] text-ink-soft">Tu idea</span>
                <textarea
                  name="idea"
                  required
                  rows={4}
                  className="field mt-2 resize-y"
                  placeholder="Ej.: una placa iced con el nombre de mi hija, en cadena cubana de 10 mm"
                  aria-describedby={error ? 'medida-error' : undefined}
                />
              </label>
              {error && (
                <p id="medida-error" role="alert" className="text-sm text-red-800 sm:col-span-2">
                  {error}
                </p>
              )}
              {link ? (
                <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
                  <a href={link} target="_blank" rel="noreferrer" className="btn btn-gold">
                    Abrir WhatsApp con tu mensaje
                  </a>
                  <button type="submit" className="text-sm text-ink-soft underline underline-offset-4 hover:text-ink">
                    Actualizar mensaje
                  </button>
                </div>
              ) : (
                <button type="submit" className="btn btn-dark sm:col-span-2 sm:justify-self-start">
                  Preparar mensaje de WhatsApp
                </button>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
