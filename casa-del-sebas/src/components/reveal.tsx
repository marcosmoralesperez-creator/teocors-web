import { motion, type HTMLMotionProps } from 'framer-motion';

/** Sube y aparece al entrar en pantalla (MotionConfig respeta "reducir movimiento"). */
export function Reveal({ delay = 0, ...props }: HTMLMotionProps<'div'> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    />
  );
}

export function SectionHeading({ eyebrow, title, intro, light = false }: { eyebrow: string; title: React.ReactNode; intro?: string; light?: boolean }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className={`eyebrow ${light ? 'text-gold-bright' : 'text-gold'}`}>{eyebrow}</p>
      <h2 className="display mt-4 text-4xl sm:text-5xl lg:text-6xl">{title}</h2>
      {intro && <p className={`mt-5 text-base leading-relaxed sm:text-lg ${light ? 'text-ivory/70' : 'text-ink-soft'}`}>{intro}</p>}
    </Reveal>
  );
}
