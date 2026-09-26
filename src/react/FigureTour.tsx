import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

// 122 cuadros de la figura con fondo transparente (scripts/make-figure-frames.py).
const FRAME_URLS = Object.values(
  import.meta.glob<string>('@/assets/figure-frames/*.webp', { eager: true, query: '?url', import: 'default' }),
).sort();
const FRAME_W = 570;
const FRAME_H = 710;

type Stop = {
  id: string;
  word: string;
  title: string;
  kicker: string;
  specs: [string, string][];
  /** Punto de la figura (0–1) al que se acerca la cámara, y cuánto. */
  focus: [number, number, number];
};

const STOPS: Stop[] = [
  {
    id: '01',
    word: 'ARENA',
    title: 'Chaqueta Arena',
    kicker: 'Capa exterior',
    specs: [
      ['Tela', 'Nylon mate acolchado'],
      ['Relleno', 'Fibra térmica'],
      ['Corte', 'Cropped, hombro amplio'],
      ['Capucha', 'Envolvente, fija'],
    ],
    focus: [0.6, 0.27, 1.55],
  },
  {
    id: '02',
    word: 'DENIM',
    title: 'Jean Patchwork',
    kicker: 'Capa media',
    specs: [
      ['Tela', 'Denim en dos lavados'],
      ['Paneles', 'Cosidos por tramos'],
      ['Bota', 'Extra amplia'],
      ['Tiro', 'Medio, relajado'],
    ],
    focus: [0.47, 0.56, 1.45],
  },
  {
    id: '03',
    word: 'HUESO',
    title: 'Zapatilla Hueso',
    kicker: 'Styling',
    specs: [
      ['Color', 'Hueso / arena'],
      ['Suela', 'Gruesa, de caucho'],
      ['Perfil', 'Bajo'],
      ['Combina', 'Con toda la paleta'],
    ],
    focus: [0.72, 0.82, 1.6],
  },
];

// Recorrido: plano general → chaqueta → jean → zapatilla → plano general.
const P = [0, 0.1, 0.2, 0.33, 0.43, 0.56, 0.66, 0.8, 0.9, 1];
const ZOOM = [1, 1, ...STOPS.flatMap((s) => [s.focus[2], s.focus[2]]), 0.92, 0.92];
const FX = [0.5, 0.5, ...STOPS.flatMap((s) => [s.focus[0], s.focus[0]]), 0.5, 0.5];
const FY = [0.5, 0.5, ...STOPS.flatMap((s) => [s.focus[1], s.focus[1]]), 0.5, 0.5];
// Rango de scroll en que se ve cada ficha.
const RANGES: [number, number][] = [
  [0.16, 0.37],
  [0.39, 0.6],
  [0.62, 0.84],
];

function useFade(p: MotionValue<number>, [a, b]: [number, number]) {
  return useTransform(p, [a - 0.04, a + 0.02, b - 0.02, b + 0.04], [0, 1, 1, 0]);
}

function SpecCard({ stop, p, range }: { stop: Stop; p: MotionValue<number>; range: [number, number] }) {
  const opacity = useFade(p, range);
  const y = useTransform(opacity, [0, 1], [24, 0]);
  return (
    <motion.article
      style={{ opacity, y }}
      className="absolute inset-x-0 bottom-0 max-w-[380px] rounded-[18px] bg-[#f3f0ea]/85 p-5 backdrop-blur-md md:bg-transparent md:p-0 md:backdrop-blur-none"
    >
      <p className="m-0 font-mono text-[11px] uppercase tracking-[0.14em] text-[#6d6a64]">
        {stop.id} — {stop.kicker}
      </p>
      <h3 className="m-0 mt-2 font-display text-[clamp(24px,2.6vw,38px)] font-semibold leading-none tracking-[-0.03em]">
        {stop.title}
      </h3>
      <dl className="m-0 mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[#161616]/15 pt-4 font-mono text-[12px] md:grid-cols-1 md:gap-y-2">
        {stop.specs.map(([k, v]) => (
          <div key={k} className="flex flex-col gap-0.5 md:flex-row md:justify-between md:gap-6">
            <dt className="uppercase tracking-[0.1em] text-[#6d6a64]">{k}</dt>
            <dd className="m-0 text-[#161616]">{v}</dd>
          </div>
        ))}
      </dl>
    </motion.article>
  );
}

function BigWord({ word, p, range }: { word: string; p: MotionValue<number>; range: [number, number] }) {
  const opacity = useFade(p, range);
  const x = useTransform(p, [range[0] - 0.05, range[1] + 0.05], ['6%', '-6%']);
  return (
    <motion.span
      aria-hidden="true"
      style={{ opacity, x }}
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display text-[clamp(90px,22vw,340px)] font-extrabold leading-none tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_rgba(22,22,22,0.16)]"
    >
      {word}
    </motion.span>
  );
}

/**
 * Capítulo 01: la figura queda fija mientras se baja; el scroll mueve los
 * cuadros (la figura gira) y una cámara recorre chaqueta, jean y zapatilla.
 */
export function FigureTour() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [frameNo, setFrameNo] = useState(0);
  const frameRef = useRef(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4, restDelta: 0.0005 });

  const zoom = useTransform(p, P, ZOOM);
  const fx = useTransform(p, P, FX);
  const fy = useTransform(p, P, FY);
  // Lleva el punto enfocado al centro del escenario.
  const tx = useTransform([fx, zoom] as MotionValue<number>[], ([f, z]: number[]) => `${(0.5 - f) * 100 * z}%`);
  const ty = useTransform([fy, zoom] as MotionValue<number>[], ([f, z]: number[]) => `${(0.5 - f) * 100 * z}%`);

  const introOpacity = useTransform(p, [0, 0.1, 0.16], [1, 1, 0]);
  const outroOpacity = useTransform(p, [0.86, 0.92], [0, 1]);
  const bar = useTransform(p, [0, 1], ['0%', '100%']);

  // Carga los cuadros cuando la sección se acerca.
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || framesRef.current.length) return;
        framesRef.current = FRAME_URLS.map((src, i) => {
          const img = new Image();
          img.decoding = 'async';
          img.src = src;
          if (i === 0) img.onload = () => draw(0);
          return img;
        });
        io.disconnect();
      },
      { rootMargin: '150% 0px' },
    );
    io.observe(sectionRef.current!);
    return () => io.disconnect();
  }, []);

  const draw = (i: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    // Si el cuadro aún no llegó, se deja el último que se pintó.
    const img = framesRef.current[i];
    if (!ctx || !img?.complete || !img.naturalWidth) return;
    ctx.clearRect(0, 0, FRAME_W, FRAME_H);
    ctx.drawImage(img, 0, 0, FRAME_W, FRAME_H);
  };

  // Dos vueltas completas del giro a lo largo del capítulo.
  useMotionValueEvent(p, 'change', (v) => {
    const n = FRAME_URLS.length;
    const i = Math.floor(Math.min(0.9999, Math.max(0, v)) * n * 2) % n;
    if (i !== frameRef.current) {
      frameRef.current = i;
      setFrameNo(i);
      draw(i);
    }
  });

  return (
    <section
      ref={sectionRef}
      id="la-pieza"
      aria-labelledby="pieza-title"
      className="relative h-[520svh] bg-[#e9e5de] text-[#161616]"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* HUD */}
        <div className="absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-4 px-5 pt-20 font-mono text-[11px] uppercase tracking-[0.14em] text-[#6d6a64] sm:px-8 md:pt-24">
          <span>01 — La pieza</span>
          <span className="hidden tabular-nums sm:inline">
            Toma {String(frameNo + 1).padStart(3, '0')} / {FRAME_URLS.length}
          </span>
          <span>Colección 2026</span>
        </div>

        {/* Palabra gigante detrás */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {STOPS.map((s, i) => (
            <BigWord key={s.id} word={s.word} p={p} range={RANGES[i]} />
          ))}
        </div>

        {/* Intro */}
        <motion.div
          style={{ opacity: introOpacity }}
          className="absolute inset-x-0 bottom-[9%] z-20 px-5 sm:px-8 md:bottom-[12%]"
        >
          <h2
            id="pieza-title"
            className="m-0 max-w-[12ch] font-display text-[clamp(34px,5.4vw,84px)] font-semibold leading-[0.95] tracking-[-0.04em]"
          >
            Un look. Tres capas.
          </h2>
          <p className="mb-0 mt-4 max-w-[34ch] text-[15px] leading-snug text-[#4d4a45]">
            Baja despacio: la cámara recorre cada prenda del look de la campaña 2026.
          </p>
        </motion.div>

        {/* Figura */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pt-10 md:pt-6">
          <div className="md:translate-x-[14vw]">
          <motion.div
            style={reduce ? undefined : { x: tx, y: ty, scale: zoom }}
            className="relative aspect-[570/710] h-[64svh] md:h-[80svh]"
          >
            <canvas
              ref={canvasRef}
              width={FRAME_W}
              height={FRAME_H}
              role="img"
              aria-label="Modelo con chaqueta acolchada arena, jean patchwork y zapatillas hueso, girando en el aire"
              className="h-full w-full drop-shadow-[0_40px_50px_rgba(40,32,20,0.22)]"
            />
          </motion.div>
          </div>
        </div>

        {/* Fichas */}
        <div className="absolute inset-x-4 bottom-4 z-20 sm:inset-x-8 md:bottom-[12%] md:left-8 md:right-auto md:w-[340px]">
          <div className="relative h-[230px] md:h-[260px]">
            {STOPS.map((s, i) => (
              <SpecCard key={s.id} stop={s} p={p} range={RANGES[i]} />
            ))}
          </div>
        </div>

        {/* Cierre */}
        <motion.div
          style={{ opacity: outroOpacity }}
          className="absolute bottom-[8%] right-5 z-20 flex flex-col items-end gap-4 text-right sm:right-8"
        >
          <p className="m-0 max-w-[16ch] font-display text-[clamp(26px,3vw,44px)] font-semibold leading-none tracking-[-0.03em]">
            Arma el tuyo.
          </p>
          <a
            href="#coleccion"
            className="inline-flex items-center gap-3 rounded-full bg-[#161616] px-6 py-4 font-mono text-[12px] uppercase tracking-[0.14em] text-[#e9e5de] no-underline transition-transform hover:scale-[1.03]"
          >
            Ver la colección <ArrowUpRight className="size-4" />
          </a>
        </motion.div>

        {/* Progreso del capítulo */}
        <div className="absolute inset-x-5 bottom-0 z-30 h-px bg-[#161616]/10 sm:inset-x-8">
          <motion.div style={{ width: bar }} className="h-full bg-[#161616]" />
        </div>
      </div>
    </section>
  );
}
