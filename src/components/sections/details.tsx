import { Eyebrow, SectionLead, SectionTitle, sectionY } from '@/components/common/section-heading';
import { Reveal } from '@/components/common/reveal';
import { productImage } from '@/data/images';
import { cn } from '@/lib/utils';

const shots = [
  {
    id: 'detail-print',
    alt: 'Primer plano del estampado dorado TEOCORS sobre algodón negro',
    title: 'Estampado en relieve',
    text: 'Tinta dorada con cuerpo, que no se agrieta con los lavados.',
  },
  {
    id: 'detail-cords',
    alt: 'Cordones del hoodie Eclipse con puntas metálicas doradas',
    title: 'Puntas metálicas',
    text: 'Cordones gruesos con terminación dorada.',
  },
  {
    id: 'detail-type',
    alt: 'Cuello en rib y tipografía dorada del buzo Medianoche',
    title: 'Tipografía editorial',
    text: 'Letras serif doradas y cuello en rib grueso.',
  },
];

export function Details() {
  return (
    <section id="detalles" aria-labelledby="detalles-title" className={cn(sectionY, 'pt-[clamp(24px,4vw,56px)]')}>
      <div className="shell">
        <Reveal className="mb-[clamp(40px,5vw,64px)] flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <Eyebrow>De cerca</Eyebrow>
            <SectionTitle id="detalles-title">
              Detalles que se notan <em>de cerca</em>
            </SectionTitle>
          </div>
          <SectionLead>Cada prenda pasa por tres pruebas antes de salir: cómo cae, cómo se siente y cómo envejece.</SectionLead>
        </Reveal>

        <div className="grid auto-rows-[400px] grid-cols-1 gap-[clamp(12px,2vw,24px)] sm:auto-rows-[clamp(280px,60vw,460px)] sm:grid-cols-2 lg:auto-rows-[clamp(420px,42vw,620px)] lg:grid-cols-[1.3fr_1fr_1fr]">
          {shots.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.08} className={cn(i === 0 && 'sm:max-lg:col-span-2')}>
              <figure className="group relative size-full overflow-hidden rounded-md bg-media">
                <img
                  src={productImage(s.id)}
                  alt={s.alt}
                  width={960}
                  height={1200}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-1200 ease-luxe group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 grid gap-1 bg-linear-to-b from-transparent to-[rgb(8_7_6/0.94)] to-55% px-6 pt-16 pb-6 text-sm text-muted-foreground">
                  <span className="text-xs tracking-[0.2em] text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <strong className="font-serif text-[26px] leading-[1.1] font-medium text-foreground">{s.title}</strong>
                  {s.text}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
