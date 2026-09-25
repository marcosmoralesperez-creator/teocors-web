import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowRight, Play } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/common/section-heading';
import { productImage } from '@/data/images';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';
import type { HeroScene } from '@/three/hero';

const WORDMARK = 'TEOCORS';
const ease = [0.22, 1, 0.36, 1] as const;

// Callouts pinned to points on the 3D garment (1024 design space).
const hotspots = [
  { x: 744, y: 332, side: 'right', long: true, title: 'Estampado dorado', text: 'Serigrafía en relieve' },
  { x: 150, y: 300, side: 'left', long: false, title: '280 g/m²', text: 'Algodón peinado pesado' },
  { x: 770, y: 760, side: 'right', long: false, title: 'Oversize', text: 'Hombro caído, caída amplia' },
] as const;

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2'));
  } catch {
    return false;
  }
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hotspotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [is3d, setIs3d] = useState(false);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const wordY = useTransform(scrollYProgress, [0, 1], ['-58%', '-20%']);
  const wordOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);

  // three.js loads in its own chunk; the poster image stays if WebGL is missing.
  useEffect(() => {
    if (!webglAvailable() || !canvasRef.current || !stageRef.current) return;
    const canvas = canvasRef.current;
    const container = stageRef.current;
    let scene: HeroScene | undefined;
    let stopScroll: (() => void) | undefined;
    let cancelled = false;

    import('@/three/hero')
      .then(({ createHeroScene }) =>
        createHeroScene({
          canvas,
          container,
          garment: products[0].garment,
          hotspots: hotspots.map((h, i) => ({ el: hotspotRefs.current[i]!, x: h.x, y: h.y })),
          reducedMotion: reduced,
        }),
      )
      .then((s) => {
        if (cancelled) return s.dispose();
        scene = s;
        setIs3d(true);
        if (!reduced) stopScroll = scrollYProgress.on('change', (p) => s.setProgress(p));
      })
      .catch((err) => console.warn('Escena 3D no disponible, se muestra la imagen.', err));

    return () => {
      cancelled = true;
      stopScroll?.();
      scene?.dispose();
    };
  }, [reduced, scrollYProgress]);

  const fadeUp = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, ease, delay: 0.55 + i * 0.1 },
        };

  return (
    <section
      ref={sectionRef}
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate -mt-(--header-h) grid min-h-[max(640px,calc(100svh-var(--announce-h)))] overflow-clip"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_40%_at_50%_36%,rgb(201_164_92/0.18),transparent_70%),linear-gradient(180deg,#0b0a09_0%,#100d0b_55%,#0b0a09_100%)] lg:bg-[radial-gradient(ellipse_36%_48%_at_57%_48%,rgb(201_164_92/0.17),transparent_70%),radial-gradient(ellipse_90%_50%_at_50%_115%,rgb(140_104_56/0.2),transparent_70%),linear-gradient(180deg,#0b0a09_0%,#100d0b_55%,#0b0a09_100%)]"
      />

      <motion.h1
        id="hero-title"
        style={{ y: reduced ? '-58%' : wordY, opacity: reduced ? 1 : wordOpacity }}
        className="pointer-events-none absolute inset-x-0 top-[36%] -z-10 overflow-hidden text-center text-[clamp(88px,19.5vw,380px)] leading-[0.9] font-extrabold tracking-[-0.02em] whitespace-nowrap select-none lg:top-[38%]"
      >
        <span className="sr-only">{WORDMARK}</span>
        {[...WORDMARK].map((ch, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="wordmark-char inline-block"
            initial={reduced ? false : { y: '105%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 1.2, ease, delay: i * 0.07 }}
          >
            {ch}
          </motion.span>
        ))}
      </motion.h1>

      <div ref={stageRef} className="absolute inset-0">
        <img
          src={productImage('noir')}
          alt="Camiseta Oversize Noir de TEOCORS colgada de un gancho dorado"
          width={960}
          height={1200}
          fetchPriority="high"
          className={cn(
            'absolute top-[36%] left-1/2 w-[min(90vw,480px)] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-900 ease-luxe lg:top-1/2 lg:left-[57%] lg:h-[84%] lg:w-auto',
            is3d && 'opacity-0',
          )}
        />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={cn(
            'absolute inset-0 size-full opacity-0 transition-opacity duration-1200 ease-luxe',
            is3d && 'opacity-100',
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 opacity-0 transition-opacity delay-800 duration-800 max-[1099px]:hidden',
            is3d && 'opacity-100',
          )}
        >
          {hotspots.map((h, i) => (
            <div
              key={h.title}
              ref={(el) => {
                hotspotRefs.current[i] = el;
              }}
              className="absolute top-0 left-0 will-change-transform"
            >
              <span className="absolute -mt-[5px] -ml-[5px] size-2.5 rounded-full bg-gold shadow-[0_0_0_4px_rgb(201_164_92/0.22)] after:absolute after:-inset-2 after:animate-ping-soft after:rounded-full after:border after:border-gold/60" />
              <span
                style={{ '--len': h.long ? '170px' : '90px' } as React.CSSProperties}
                className={cn(
                  'absolute top-0 grid -translate-y-1/2 gap-0.5 rounded-md border bg-background/60 px-3.5 py-2.5 text-xs whitespace-nowrap text-muted-foreground backdrop-blur-sm',
                  'before:absolute before:top-1/2 before:h-px before:w-(--len)',
                  h.side === 'right'
                    ? 'left-[calc(var(--len)+10px)] before:right-full before:bg-linear-to-r before:from-gold/90 before:to-gold/25'
                    : 'right-[calc(var(--len)+10px)] before:left-full before:bg-linear-to-l before:from-gold/90 before:to-gold/25',
                )}
              >
                <strong className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">{h.title}</strong>
                {h.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="shell pointer-events-none relative z-[2] self-end pt-[calc(var(--header-h)+48px)] pb-8 lg:pb-[clamp(40px,9vh,96px)] [&>*]:pointer-events-auto sm:[&>*]:max-w-[440px]">
        <motion.div {...fadeUp(0)}>
          <Eyebrow>Colección 01 · 2026</Eyebrow>
        </motion.div>
        <motion.p
          {...fadeUp(1)}
          className="mb-4 font-serif text-[44px] leading-none font-medium sm:text-[clamp(42px,4.6vw,72px)] [&_em]:text-gold-bright"
        >
          Vestir con <em>intención</em>.
        </motion.p>
        <motion.p {...fadeUp(2)} className="mb-[22px] text-[15px] text-muted-foreground sm:mb-[30px] sm:text-base">
          Algodón pesado, cortes amplios y detalles en dorado. Ediciones limitadas diseñadas en Colombia para quienes no
          pasan desapercibidos.
        </motion.p>
        <motion.div {...fadeUp(3)} className="flex flex-wrap gap-3 max-sm:[&>*]:flex-[1_1_100%]">
          <Button asChild>
            <a href="#coleccion">
              Comprar colección <ArrowRight aria-hidden="true" />
            </a>
          </Button>
          <Button asChild variant="glass">
            <a href="#musica">
              <Play aria-hidden="true" /> Escuchar la música
            </a>
          </Button>
        </motion.div>
      </div>

      <motion.p
        {...fadeUp(4)}
        aria-hidden="true"
        className="absolute bottom-8 left-[57%] -translate-x-1/2 text-xs tracking-[0.2em] whitespace-nowrap text-muted-foreground uppercase max-lg:hidden"
      >
        Mueve el cursor · la prenda es 3D
      </motion.p>
      <motion.a
        {...fadeUp(5)}
        href="#coleccion"
        className="absolute right-[clamp(16px,4vw,40px)] bottom-[clamp(40px,9vh,96px)] flex flex-col items-center gap-3 text-xs tracking-[0.24em] text-muted-foreground uppercase [writing-mode:vertical-rl] hover:text-foreground max-lg:hidden"
      >
        <span>Desliza</span>
        <ArrowDown aria-hidden="true" className="size-[18px] animate-cue [writing-mode:horizontal-tb]" />
      </motion.a>
    </section>
  );
}
