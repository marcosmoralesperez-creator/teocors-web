import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Menu,
  Minus,
  Play,
  Plus,
  RefreshCcw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from 'lucide';

const icons = {
  'arrow-down': ArrowDown,
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  check: Check,
  menu: Menu,
  minus: Minus,
  play: Play,
  plus: Plus,
  'refresh-ccw': RefreshCcw,
  ruler: Ruler,
  'shield-check': ShieldCheck,
  'shopping-bag': ShoppingBag,
  truck: Truck,
  x: X,
};

// Brand marks drawn in the same 24px, 1.5 stroke language as Lucide.
const brands = {
  instagram:
    '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none"/>',
  tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.9 2.3 4.7 5 4.9"/>',
  youtube:
    '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10.2 9.4 4.6 2.6-4.6 2.6z" fill="currentColor" stroke="none"/>',
};

const attrs = (o) =>
  Object.entries(o)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');

function svg(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
}

/** SVG markup for a Lucide icon name (decorative: aria-hidden). */
export function icon(name) {
  const node = icons[name];
  if (!node) return '';
  return svg(node.map(([tag, a]) => `<${tag} ${attrs(a)}/>`).join(''));
}

/** Replaces <i data-icon> and <i data-brand> placeholders inside root. */
export function renderIcons(root = document) {
  root.querySelectorAll('i[data-icon]').forEach((el) => {
    el.outerHTML = icon(el.dataset.icon);
  });
  root.querySelectorAll('i[data-brand]').forEach((el) => {
    el.outerHTML = svg(brands[el.dataset.brand] ?? '');
  });
}
