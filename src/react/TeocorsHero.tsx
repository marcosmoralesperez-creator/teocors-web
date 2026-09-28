import { useRef, useSyncExternalStore } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowUpRight, Menu, Recycle, Search, ShoppingBag } from 'lucide-react';
import { KeyedVideo } from '@/components/ui/keyed-video';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { SPLINE_HERO } from './config';
import { accountId, getAuthState, subscribeAuth } from '@/lib/auth.js';
import figuraMp4 from '@/assets/media/teocors-figura.mp4';
import figuraWebm from '@/assets/media/teocors-figura.webm';
import figuraPoster from '@/assets/media/teocors-figura-poster.webp';
import coleccion2026 from '@/assets/media/coleccion-2026.webp';

const NAV: { href: string; label: string; dept?: string }[] = [
  { href: '#inicio', label: 'inicio' },
  { href: '#coleccion', label: 'hombre', dept: 'hombre' },
  { href: '#coleccion', label: 'mujer', dept: 'mujer' },
  { href: '#coleccion', label: 'niños', dept: 'ninos' },
  { href: '#personaliza', label: 'personaliza' },
  { href: '#marca', label: 'nosotros' },
];

const ease = [0.22, 1, 0.36, 1] as const;

type HeroProps = {
  onOpenMenu: () => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
};

/** Logo: las cinco estrellas de cuatro puntas junto a TEO / CORS. */
function StarsMark({ className }: { className?: string }) {
  const star = 'M0-6 1.2-1.2 6 0 1.2 1.2 0 6-1.2 1.2-6 0-1.2-1.2Z';
  return (
    <svg viewBox="0 0 34 34" className={className} aria-hidden="true" fill="currentColor">
      {[
        [10, 7],
        [24, 7],
        [5, 18],
        [29, 18],
        [17, 27],
      ].map(([x, y]) => (
        <path key={`${x}-${y}`} d={star} transform={`translate(${x} ${y})`} />
      ))}
    </svg>
  );
}

function Word({ text, delay, className }: { text: string; delay: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={className} aria-hidden="true">
      {[...text].map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1.1, ease, delay: delay + i * 0.06 }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function TeocorsHero({ onOpenMenu, onOpenCart, onOpenSearch }: HeroProps) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { user } = useSyncExternalStore(subscribeAuth, getAuthState);

  // Inclinación 3D de la figura hacia el cursor.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 90, damping: 18, mass: 0.6 };
  const rotY = useSpring(useTransform(px, [-1, 1], [-18, 18]), spring);
  const rotX = useSpring(useTransform(py, [-1, 1], [10, -10]), spring);
  const shiftX = useSpring(useTransform(px, [-1, 1], [-14, 14]), spring);
  const wordsX = useSpring(useTransform(px, [-1, 1], [10, -10]), spring);

  // Al bajar: la figura se acerca y las palabras se separan.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const figScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const figY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const teoX = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const corsX = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  const fadeIn = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease, delay },
        };

  const figure = (
    <KeyedVideo
      className="h-full w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]"
      sources={[
        { src: figuraWebm, type: 'video/webm' },
        { src: figuraMp4, type: 'video/mp4' },
      ]}
      poster={figuraPoster}
      width={570}
      height={710}
      playing={!reduce}
      label="Modelo TEOCORS con chaqueta acolchada beige y jean ancho, suspendido en el aire y girando"
    />
  );

  return (
    <section
      ref={sectionRef}
      id="inicio"
      aria-labelledby="hero-title"
      className="relative bg-[#0c0c0c] p-3 font-display text-bone sm:p-5 lg:p-8"
    >
      <div
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="relative isolate mx-auto flex h-[calc(100svh-24px)] min-h-[640px] max-w-[1480px] flex-col overflow-hidden rounded-[22px] border border-white/30 sm:h-[calc(100svh-40px)] sm:rounded-[28px] lg:h-[calc(100svh-64px)] lg:max-h-[980px]"
      >
        {/* Fondo: viñeta, luz central y grano */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_62%_58%_at_50%_52%,#262626_0%,#151515_48%,#0c0c0c_100%)]"
        />
        <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 z-30 opacity-[0.07] mix-blend-overlay" />
        {!reduce && <Spotlight className="z-0 from-white/25 via-white/10 to-transparent" size={520} />}

        {/* Barra superior */}
        <header className="relative z-40 flex items-start justify-between gap-6 px-5 pt-5 sm:px-8 sm:pt-8">
          <a href="#inicio" className="flex items-center gap-4 no-underline" aria-label="TEOCORS, inicio">
            <span className="text-[13px] font-semibold uppercase leading-[1.15] tracking-[0.02em] sm:text-[15px]">
              Teo
              <br />
              Cors
            </span>
            <StarsMark className="size-7 sm:size-8" />
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="m-0 flex list-none gap-[clamp(14px,1.8vw,30px)] p-0">
              {NAV.map((item, i) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    data-dept-link={item.dept}
                    aria-current={i === 0 ? 'page' : undefined}
                    className={
                      'text-[clamp(15px,1.4vw,21px)] font-medium tracking-[-0.01em] no-underline transition-colors duration-300 ' +
                      (i === 0 ? 'text-bone' : 'text-[#8b8a87] hover:text-bone')
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Como en la imagen oficial: el ID de cuenta, o la invitación a entrar. */}
            <button
              type="button"
              data-account-open
              className="hidden cursor-pointer border-0 bg-transparent p-0 text-[13px] font-medium tracking-[0.01em] text-bone underline-offset-4 hover:underline sm:inline sm:text-[15px]"
            >
              {user ? `id de cuenta · ${accountId(user)}` : 'iniciar sesión'}
            </button>
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Buscar en la tienda"
              aria-keyshortcuts="/"
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-white/25 bg-transparent text-bone transition-colors hover:bg-white/10"
            >
              <Search className="size-[18px]" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={onOpenCart}
              aria-label="Abrir carrito"
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-white/25 bg-transparent text-bone transition-colors hover:bg-white/10"
            >
              <ShoppingBag className="size-[18px]" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={onOpenMenu}
              aria-label="Abrir menú"
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-white/25 bg-transparent text-bone transition-colors hover:bg-white/10 lg:hidden"
            >
              <Menu className="size-[18px]" strokeWidth={1.6} />
            </button>
          </div>
        </header>

        {/* Palabra de marca, detrás de la figura */}
        <motion.h1
          id="hero-title"
          aria-label="TEOCORS"
          style={{ x: wordsX, opacity: fade }}
          className="pointer-events-none absolute inset-x-0 bottom-[33%] top-[14%] z-0 m-0 flex select-none flex-col justify-between whitespace-nowrap px-5 text-[clamp(64px,22vw,150px)] font-extrabold leading-none tracking-[-0.03em] text-[#efebe4] sm:bottom-[34%] sm:px-8 lg:bottom-auto lg:top-[29%] lg:flex-row lg:justify-center lg:gap-[26%] lg:px-0 lg:text-[clamp(96px,9.2vw,150px)]"
        >
          <motion.span style={{ x: teoX }} className="block self-start lg:self-auto">
            <Word text="TEO" delay={0.15} />
          </motion.span>
          <motion.span style={{ x: corsX }} className="block self-end lg:self-auto">
            <Word text="CORS" delay={0.3} />
          </motion.span>
        </motion.h1>

        {/* Figura en 3D */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-[30%] top-[13%] z-10 flex justify-center sm:bottom-[24%] lg:bottom-[9%] lg:top-[12%] lg:justify-start lg:pl-[26%]"
          style={{ perspective: 1400 }}
        >
          <motion.div
            className="relative aspect-[570/710] h-full"
            style={{ rotateX: rotX, rotateY: rotY, x: shiftX, y: figY, scale: figScale, transformStyle: 'preserve-3d' }}
            initial={reduce ? false : { opacity: 0, scale: 0.92, filter: 'blur(12px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.4, ease, delay: 0.35 }}
          >
            <motion.div
              className="h-full w-full"
              animate={reduce ? undefined : { y: ['-1.5%', '1.5%', '-1.5%'] }}
              transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
            >
              {SPLINE_HERO ? (
                <ErrorBoundary fallback={figure}>
                  <SplineScene scene={SPLINE_HERO} className="pointer-events-auto h-full w-full" />
                </ErrorBoundary>
              ) : (
                figure
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Texto inferior izquierdo */}
        <motion.div
          style={{ opacity: fade }}
          className="relative z-20 mt-auto max-w-[480px] px-5 pb-4 sm:px-8 sm:pb-9 lg:pb-12"
        >
          <motion.div {...fadeIn(0.7)} className="mb-5 hidden size-[54px] place-items-center rounded-[12px] border-2 border-bone/90 sm:grid">
            <Recycle className="size-7" strokeWidth={1.8} />
          </motion.div>
          <motion.p
            {...fadeIn(0.8)}
            className="m-0 text-[clamp(22px,2.5vw,34px)] font-semibold leading-[1.18] tracking-[-0.02em]"
          >
            Ropa sin excesos.
            <br />
            Solo estilo.
          </motion.p>
          <motion.p
            {...fadeIn(0.9)}
            className="mb-0 mt-3 max-w-[330px] text-[13px] leading-[1.35] text-bone/75 sm:mt-5 sm:text-[15px]"
          >
            Siluetas modernas, telas naturales y diseño honesto. Para quienes eligen simplicidad y calidad.
          </motion.p>
        </motion.div>

        {/* Nueva colección */}
        <motion.div
          {...fadeIn(1)}
          className="relative z-20 flex flex-col items-stretch gap-3 px-5 pb-5 sm:absolute sm:bottom-9 sm:right-8 sm:w-[210px] sm:p-0 lg:bottom-14 lg:w-[256px]"
        >
          <a
            href="#coleccion"
            className="group hidden flex-col items-center rounded-[22px] border border-white/30 bg-gradient-to-b from-white/[0.07] to-transparent px-4 pb-3 pt-3 no-underline backdrop-blur-sm transition-colors hover:border-white/60 sm:flex"
          >
            <img
              src={coleccion2026}
              alt="Conjunto deportivo negro y gris de la colección 2026"
              width={175}
              height={195}
              className="h-[120px] w-auto transition-transform duration-500 group-hover:scale-105 lg:h-[178px]"
            />
            <span className="mt-1 text-[22px] font-semibold tracking-[-0.01em] text-bone lg:text-[26px]">2026</span>
          </a>
          <a
            href="#coleccion"
            className="flex items-center justify-between rounded-full border border-white/40 px-4 py-3 text-[14px] font-medium text-bone no-underline transition-colors hover:bg-bone hover:text-[#0c0c0c] sm:text-[15px]"
          >
            nueva colección
            <ArrowUpRight className="size-4" strokeWidth={2} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
