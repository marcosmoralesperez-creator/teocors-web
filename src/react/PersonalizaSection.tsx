import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, MousePointer2 } from 'lucide-react';
import { SplineScene } from '@/components/ui/splite';
import { Card } from '@/components/ui/card';
import { Spotlight } from '@/components/ui/spotlight';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { KeyedVideo } from '@/components/ui/keyed-video';
import figuraMp4 from '@/assets/media/teocors-figura.mp4';
import figuraWebm from '@/assets/media/teocors-figura.webm';
import figuraPoster from '@/assets/media/teocors-figura-poster.webp';
import { SPLINE_PERSONALIZA } from './config';

const STEPS = [
  { n: '01', title: 'Elige la prenda', text: 'Chaqueta, hoodie, camiseta o jean.' },
  { n: '02', title: 'Ajusta el color', text: 'Paleta neutra: hueso, arena, grafito y negro.' },
  { n: '03', title: 'Ponle tu marca', text: 'Iniciales, bordado o estampado en relieve.' },
];

/**
 * Sección «Personaliza»: el demo SplineSceneBasic adaptado a la marca.
 * La escena de Spline (~2 MB) solo se descarga cuando la sección está por
 * aparecer en pantalla, para que la portada cargue rápido.
 */
export function PersonalizaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="mx-auto w-full max-w-[1320px] px-[clamp(16px,4vw,40px)]">
      <Card className="relative h-auto overflow-hidden rounded-[28px] border-white/20 bg-black/[0.96] md:h-[560px]">
        <Spotlight className="-top-40 left-0 from-white/30 via-white/10 to-transparent md:-top-20 md:left-60" size={420} />

        <div className="flex h-full flex-col md:flex-row">
          <div className="relative z-10 flex flex-1 flex-col justify-center p-7 sm:p-10">
            <p className="eyebrow">Personaliza</p>
            <h2
              id="personaliza-title"
              className="m-0 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text font-display text-[clamp(30px,4vw,52px)] font-semibold leading-[1.05] tracking-[-0.03em] text-transparent"
            >
              Diseña tu pieza en 3D
            </h2>
            <p className="mb-0 mt-4 max-w-lg text-neutral-300">
              Gira la escena, mira cada ángulo y cuéntanos cómo la quieres. Hacemos piezas únicas sobre nuestras siluetas,
              con el mismo algodón y los mismos acabados de la colección.
            </p>

            <ol className="m-0 mt-7 grid list-none gap-4 p-0 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              {STEPS.map((s) => (
                <li key={s.n} className="border-t border-white/15 pt-3">
                  <span className="font-display text-xs text-neutral-500">{s.n}</span>
                  <strong className="mt-1 block font-display text-sm font-medium text-neutral-100">{s.title}</strong>
                  <span className="mt-1 block text-sm leading-snug text-neutral-400">{s.text}</span>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a className="btn btn-primary" href="#contacto">
                Pedir diseño <ArrowUpRight className="size-[18px]" />
              </a>
              <span className="hidden items-center gap-2 text-xs text-neutral-500 md:inline-flex">
                <MousePointer2 className="size-4" /> Arrastra para girar
              </span>
            </div>
          </div>

          <div className="relative h-[380px] flex-1 sm:h-[460px] md:h-full">
            {near ? (
              <ErrorBoundary
                fallback={
                  <KeyedVideo
                    className="mx-auto h-full max-w-full py-6"
                    sources={[
                      { src: figuraWebm, type: 'video/webm' },
                      { src: figuraMp4, type: 'video/mp4' },
                    ]}
                    poster={figuraPoster}
                    width={570}
                    height={710}
                    label="Modelo TEOCORS con chaqueta beige girando"
                  />
                }
              >
                <SplineScene scene={SPLINE_PERSONALIZA} className="h-full w-full" />
              </ErrorBoundary>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="loader"></span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
