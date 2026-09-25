import { useRef } from 'react';
import { useInView } from 'motion/react';
import { ArrowRight, Box, MousePointer2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import { ErrorBoundary } from '@/components/common/error-boundary';
import { Eyebrow, sectionY } from '@/components/common/section-heading';
import { Reveal } from '@/components/common/reveal';
import { productImage } from '@/data/images';
import { LAB_SCENE } from '@/data/site';
import { cn } from '@/lib/utils';

const features = [
  { icon: Box, text: 'Cada prenda se modela en 3D' },
  { icon: MousePointer2, text: 'Escena interactiva: mueve el cursor' },
  { icon: Sparkles, text: 'Renders de estudio en tiempo real' },
];

// Shown if the Spline runtime or the scene can't load (offline, blocked).
const sceneFallback = (
  <img
    src={productImage('eclipse')}
    alt="Hoodie Eclipse de TEOCORS en render de estudio"
    width={960}
    height={1200}
    loading="lazy"
    className="absolute inset-0 size-full object-contain p-6"
  />
);

/**
 * TEOCORS Lab: the interactive Spline scene inside a dark card with a
 * spotlight that follows the pointer. The Spline runtime (~2 MB) is only
 * requested when the section comes near the viewport.
 */
export function Lab3D() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const near = useInView(sceneRef, { once: true, margin: '600px 0px' });

  return (
    <section id="lab" aria-labelledby="lab-title" className={cn(sectionY, 'pt-0')}>
      <div className="shell">
        <Reveal>
          <Card className="relative w-full overflow-hidden border-border bg-black/[0.96] md:h-[560px]">
            <Spotlight size={420} className="from-gold-bright/35 via-gold/15 to-transparent" />

            <div className="flex h-full flex-col md:flex-row">
              <div className="relative z-10 flex flex-1 flex-col justify-center p-8 md:p-12">
                <Eyebrow>TEOCORS Lab · Interactivo</Eyebrow>
                <h2
                  id="lab-title"
                  className="bg-linear-to-b from-neutral-50 to-neutral-400 bg-clip-text font-serif text-[clamp(40px,4.6vw,64px)] leading-[1.02] font-medium text-balance text-transparent"
                >
                  Diseñado en otra dimensión
                </h2>
                <p className="mt-4 max-w-lg text-neutral-300">
                  Cada prenda TEOCORS existe primero en 3D: así probamos caídas, colores y estampados antes de producirla.
                  Asómate al laboratorio y juega con la escena.
                </p>
                <ul className="mt-6 grid gap-3 text-sm text-neutral-300">
                  {features.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3">
                      <span className="grid size-8 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                        <Icon aria-hidden="true" className="size-4" />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="glass" className="mt-8 self-start">
                  <a href="#coleccion">
                    Ver la colección <ArrowRight aria-hidden="true" />
                  </a>
                </Button>
              </div>

              <div
                ref={sceneRef}
                aria-label="Escena 3D interactiva"
                role="img"
                className="relative h-[340px] shrink-0 sm:h-[420px] md:h-auto md:flex-1"
              >
                {near ? (
                  <ErrorBoundary fallback={sceneFallback}>
                    <SplineScene scene={LAB_SCENE} className="size-full" />
                  </ErrorBoundary>
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <span className="loader" />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
