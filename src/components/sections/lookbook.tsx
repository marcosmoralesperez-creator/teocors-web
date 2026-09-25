import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Eyebrow, SectionLead, SectionTitle, sectionY } from '@/components/common/section-heading';
import { Reveal } from '@/components/common/reveal';
import { moodImages, type MoodImage } from '@/data/lookbook';
import { cn } from '@/lib/utils';

function MoodPhoto({ image, sizes, className }: { image: MoodImage; sizes: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className={cn('group relative overflow-hidden rounded-md bg-media', className)}>
      {failed ? (
        // Keeps the layout if the photo can't load.
        <div aria-hidden="true" className="grid size-full place-items-center">
          <span className="font-serif text-4xl text-foreground/10 italic">TEOCORS</span>
        </div>
      ) : (
        <img
          src={image.src(1200)}
          srcSet={`${image.src(640)} 640w, ${image.src(1200)} 1200w, ${image.src(1800)} 1800w`}
          sizes={sizes}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="size-full object-cover brightness-[0.78] saturate-[0.55] transition-[transform,filter] duration-1200 ease-luxe group-hover:scale-[1.04] group-hover:brightness-90 group-hover:saturate-100"
        />
      )}
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-b from-transparent to-[rgb(8_7_6/0.85)] px-5 pt-14 pb-5 font-serif text-2xl italic">
        {image.caption}
      </figcaption>
    </figure>
  );
}

export function Lookbook() {
  const [a, b, c, d] = moodImages;
  return (
    <section id="lookbook" aria-labelledby="lookbook-title" className={cn(sectionY, 'border-t')}>
      <div className="shell">
        <Reveal className="mb-[clamp(40px,5vw,64px)] flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <Eyebrow>Lookbook · Inspiración</Eyebrow>
            <SectionTitle id="lookbook-title">
              La calle como <em>pasarela</em>
            </SectionTitle>
          </div>
          <SectionLead>
            Calle, noche y oficio: las imágenes que inspiraron la Colección 01. Tonos apagados, volumen y texturas que se
            sienten.
          </SectionLead>
        </Reveal>

        <div className="grid gap-[clamp(12px,2vw,24px)] md:grid-cols-12 md:grid-rows-[repeat(2,clamp(260px,26vw,380px))]">
          <Reveal className="md:col-span-7 md:row-span-2">
            <MoodPhoto image={a} sizes="(min-width: 768px) 58vw, 100vw" className="h-[480px] md:h-full" />
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-5">
            <MoodPhoto image={b} sizes="(min-width: 768px) 42vw, 100vw" className="h-[320px] md:h-full" />
          </Reveal>
          <Reveal delay={0.16} className="md:col-span-5">
            <MoodPhoto image={c} sizes="(min-width: 768px) 42vw, 100vw" className="h-[320px] md:h-full" />
          </Reveal>
        </div>

        <Reveal className="mt-[clamp(12px,2vw,24px)]">
          <div className="relative isolate overflow-hidden rounded-md">
            <MoodPhoto image={d} sizes="100vw" className="absolute inset-0 -z-10 rounded-none [&_figcaption]:hidden" />
            <div className="flex min-h-[320px] flex-col items-start justify-end gap-5 bg-linear-to-r from-background/95 via-background/70 to-transparent p-[clamp(24px,5vw,64px)] md:min-h-[360px]">
              <p className="text-xs font-semibold tracking-[0.24em] text-gold uppercase">{d.caption}</p>
              <p className="max-w-[18ch] font-serif text-[clamp(32px,4vw,56px)] leading-[1.02]">
                Pocas piezas. Hechas para <em className="text-gold-bright">quedarse</em>.
              </p>
              <Button asChild>
                <a href="#coleccion">
                  Comprar Colección 01 <ArrowRight aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
        <p className="mt-4 text-xs text-muted-foreground">Fotos de inspiración: Unsplash.</p>
      </div>
    </section>
  );
}
