import { useEffect, useRef } from 'react';
import { animate, inView } from 'motion';

import { prefersReducedMotion } from '@/lib/scroll';

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Content is visible at rest. Blocks that start below the fold get a short
 * entrance that begins just before they scroll in, so nothing waits hidden
 * (screenshots, crawlers and reduced motion all see the final layout).
 */
export function Reveal({
  delay = 0,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (el.getBoundingClientRect().top <= window.innerHeight) return;
    return inView(
      el,
      () => {
        animate(el, { opacity: [0, 1], y: [28, 0] }, { duration: 0.9, delay, ease });
      },
      { margin: '0px 0px 15% 0px' },
    );
  }, [delay]);

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
}
