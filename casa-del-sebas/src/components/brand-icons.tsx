// Marcas dibujadas en el mismo trazo de 24 px y 1,5 que Lucide (Lucide no trae logos).
import type { SVGProps } from 'react';

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export const InstagramIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const WhatsAppIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M3.5 20.5 4.8 16A8.5 8.5 0 1 1 8 19.2z" />
    <path d="M9 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c.6 1.2 1.6 2.1 2.8 2.7l.6-.6c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.6.8-.6.3-1.7.4-3.3-.4a8.4 8.4 0 0 1-3.4-3.3C8.6 10.3 8.7 9.2 9 8.6z" />
  </svg>
);

/** Monograma de la casa: una S dentro de un rombo, como un sello. */
export const Monogram = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 40 40" aria-hidden="true" {...props}>
    <rect x="7" y="7" width="26" height="26" transform="rotate(45 20 20)" fill="none" stroke="currentColor" strokeWidth="1" />
    <text x="20" y="27" textAnchor="middle" fontFamily="var(--font-display)" fontSize="20" fill="currentColor">
      S
    </text>
  </svg>
);
