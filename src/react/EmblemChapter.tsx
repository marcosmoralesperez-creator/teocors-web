import { useEffect, useRef } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { EmblemScene } from './emblemScene';

const PRINCIPLES = [
  ['Silueta', 'Cortes amplios y modernos'],
  ['Tela', 'Fibras naturales'],
  ['Diseño', 'Honesto, sin ruido'],
  ['Simplicidad', 'Pocas piezas, bien pensadas'],
  ['Calidad', 'Hechas para durar'],
];

const LINES = ['Cinco estrellas.', 'Cinco criterios.', 'Una sola firma.'];

function Line({ text, i, p }: { text: string; i: number; p: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const a = [0.02, 0.36, 0.72][i];
  const b = [0.3, 0.66, 1][i];
  const opacity = useTransform(p, [a, a + 0.06, b - 0.06, b], [0, 1, 1, i === 2 ? 1 : 0]);
  const y = useTransform(opacity, [0, 1], [30, 0]);
  return (
    <motion.p
      style={{ opacity, y }}
      className="absolute inset-x-0 bottom-0 m-0 text-center font-display text-[clamp(34px,6vw,96px)] font-semibold leading-none tracking-[-0.045em] text-[#ece8e1]"
    >
      {text}
    </motion.p>
  );
}

/**
 * Capítulo 02: las cinco estrellas del logo en metal pulido (three.js, PBR,
 * mapa de entorno y tonemapping ACES). Con el scroll giran, se separan para
 * mostrar los cinco criterios de la marca y vuelven a formar el emblema.
 */
// Distancia entre el centro de la estrella y su etiqueta.
const gap = () => (window.innerWidth < 640 ? 54 : 96);

export function EmblemChapter() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sceneRef = useRef<EmblemScene | null>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => sceneRef.current?.setProgress(v));
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    let cancelled = false;
    let io: IntersectionObserver | undefined;
    const section = sectionRef.current!;

    // three.js se descarga solo cuando el capítulo se acerca.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        import('./emblemScene')
          .then(({ createEmblemScene }) => {
            if (cancelled) return;
            const scene = createEmblemScene(canvasRef.current!, { reducedMotion: !!reduce });
            sceneRef.current = scene;
            scene.setProgress(scrollYProgress.get());
            scene.onLabels((items) => {
              items.forEach((it, i) => {
                const el = labelRefs.current[i];
                if (!el) return;
                // Etiqueta hacia afuera: a la derecha de las estrellas de la derecha y viceversa.
                const right = it.x >= (canvasRef.current?.clientWidth ?? 0) / 2;
                // En celular no hay espacio a los lados: va debajo de la estrella.
                const below = window.innerWidth < 640;
                el.dataset.side = below ? 'below' : right ? 'right' : 'left';
                el.style.transform = below
                  ? `translate(calc(${it.x}px - 50%), ${it.y + gap()}px)`
                  : right
                  ? `translate(${it.x + gap()}px, ${it.y}px)`
                  : `translate(calc(${it.x - gap()}px - 100%), ${it.y}px)`;
                el.style.opacity = String(it.show);
              });
            });
            io = new IntersectionObserver(([e]) => (e.isIntersecting ? scene.start() : scene.stop()));
            io.observe(section);
          })
          .catch((err) => console.warn('Emblema 3D no disponible.', err));
      },
      { rootMargin: '100% 0px' },
    );
    near.observe(section);

    return () => {
      cancelled = true;
      near.disconnect();
      io?.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    sceneRef.current?.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <section
      ref={sectionRef}
      id="emblema"
      aria-labelledby="emblema-title"
      className="relative h-[380svh] bg-[#0c0c0c] text-[#ece8e1]"
    >
      <div className="sticky top-0 h-svh overflow-hidden" onPointerMove={onPointerMove}>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_50%_48%,#23201c_0%,#0c0c0c_75%)]"
        />
        <div className="grain pointer-events-none absolute inset-0 z-20 opacity-[0.06] mix-blend-overlay" aria-hidden="true" />

        <div className="absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-4 px-5 pt-20 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8b8883] sm:px-8 md:pt-24">
          <h2 id="emblema-title" className="m-0 font-mono text-[11px] font-normal">
            02 — El emblema
          </h2>
          <span className="hidden sm:inline">Acero pulido · 5 piezas</span>
          <span>TEO / CORS</span>
        </div>

        <canvas ref={canvasRef} className="absolute inset-0 z-10 h-full w-full" aria-hidden="true" />

        {/* Etiquetas que siguen a cada estrella cuando se separan */}
        <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
          {PRINCIPLES.map(([name, text], i) => (
            <div
              key={name}
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              className="absolute left-0 top-0 opacity-0 will-change-transform"
            >
              <div className="-translate-y-1/2 whitespace-nowrap border-[#ece8e1]/40 font-mono text-[10px] uppercase tracking-[0.12em] in-data-[side=left]:border-r in-data-[side=left]:pr-3 in-data-[side=left]:text-right in-data-[side=right]:border-l in-data-[side=right]:pl-3 in-data-[side=below]:text-center sm:text-[11px]">
                <span className="text-[#8b8883]">0{i + 1}</span> {name}
                <span className="hidden normal-case tracking-normal text-[#8b8883] sm:block">{text}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="sr-only">
          <p>Los cinco criterios de TEOCORS:</p>
          <ul>
            {PRINCIPLES.map(([name, text]) => (
              <li key={name}>
                {name}: {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute inset-x-5 bottom-[9%] z-30 h-[1.1em] text-[clamp(34px,6vw,96px)] sm:inset-x-8" aria-hidden="true">
          {LINES.map((t, i) => (
            <Line key={t} text={t} i={i} p={scrollYProgress} />
          ))}
        </div>

        <div className="absolute inset-x-5 bottom-0 z-30 h-px bg-white/10 sm:inset-x-8">
          <motion.div style={{ width: bar }} className="h-full bg-[#ece8e1]" />
        </div>
      </div>
    </section>
  );
}
