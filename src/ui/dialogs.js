import { animate } from 'motion';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease = [0.22, 1, 0.36, 1];

function frames(dialog) {
  if (dialog.classList.contains('sheet--left')) return { transform: ['translateX(-100%)', 'translateX(0%)'] };
  if (dialog.classList.contains('sheet--right')) return { transform: ['translateX(100%)', 'translateX(0%)'] };
  return { opacity: [0, 1], transform: ['translateY(18px) scale(0.98)', 'translateY(0px) scale(1)'] };
}

export function openDialog(dialog) {
  if (dialog.open) return;
  delete dialog.dataset.closing;
  dialog.showModal();
  if (!reduced()) animate(dialog, frames(dialog), { duration: 0.45, ease });
}

export async function closeDialog(dialog) {
  if (!dialog.open || dialog.dataset.closing) return;
  if (!reduced()) {
    dialog.dataset.closing = '1';
    const reversed = Object.fromEntries(Object.entries(frames(dialog)).map(([k, [a, b]]) => [k, [b, a]]));
    await animate(dialog, reversed, { duration: 0.26, ease: [0.4, 0, 1, 1] });
    // Reopened while closing: leave it open.
    if (!dialog.dataset.closing) return;
    delete dialog.dataset.closing;
  }
  dialog.close();
}

/** Escape, backdrop clicks and [data-close] buttons animate the dialog out. */
export function setupDialogs() {
  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeDialog(dialog);
    });
    dialog.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) {
        closeDialog(dialog);
        return;
      }
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) closeDialog(dialog);
    });
  });
}
