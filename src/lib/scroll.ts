const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Scrolls to a section and moves focus there, so keyboard and screen-reader
 * users land where the page scrolled. Used after closing a menu or drawer,
 * where a plain anchor jump would be swallowed by the scroll lock.
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  history.pushState(null, '', `#${id}`);
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

export { prefersReducedMotion };
