import { useEffect, useRef } from 'react';
import { animate, inView } from 'motion';

import { Eyebrow, sectionY } from '@/components/common/section-heading';
import { Reveal } from '@/components/common/reveal';
import { prefersReducedMotion } from '@/lib/scroll';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Algodón por metro', value: 280, suffix: ' g' },
  { label: 'Unidades por diseño', value: 150, suffix: '' },
  { label: 'Diseñado en Colombia', value: 100, suffix: '%' },
];

/** Shows the final number at rest; counts up once when scrolled into view. */
function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    return inView(el, () => {
      animate(0, value, {
        duration: 1.6,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) => (el.textContent = String(Math.round(v))),
      });
    });
  }, [value]);
  return <span ref={ref}>{value}</span>;
}

export function Manifesto() {
  return (
    <section id="marca" aria-labelledby="marca-title" className={cn('relative', sectionY)}>
      <div className="shell grid items-end gap-[clamp(40px,6vw,96px)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <Reveal>
          <Eyebrow>La marca</Eyebrow>
          <h2
            id="marca-title"
            className="font-serif text-[clamp(50px,7.2vw,116px)] leading-[0.95] font-medium tracking-[-0.015em] [&_em]:text-gold-bright"
          >
            No seguimos tendencias. <em>Las cosemos.</em>
          </h2>
        </Reveal>
        <Reveal>
          <p className="mb-10 text-[17px] text-muted-foreground">
            TEOCORS nace de una idea simple: ropa que se sienta tan bien como se ve. Diseñamos pocas piezas, en tirajes
            cortos, con telas pesadas y acabados que normalmente solo ves en marcas de lujo.
          </p>
          <dl className="grid grid-cols-3 gap-3 border-t pt-7 sm:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-2">
                <dt className="text-xs leading-snug tracking-[0.06em] text-muted-foreground uppercase sm:tracking-[0.12em]">
                  {s.label}
                </dt>
                <dd className="font-serif text-[clamp(40px,4vw,58px)] leading-none text-gold-bright tabular-nums">
                  <CountUp value={s.value} />
                  {s.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
