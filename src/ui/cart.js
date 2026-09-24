import { animate } from 'motion';
import { products, formatPrice } from '../data/products.js';
import { icon } from './icons.js';
import { openDialog } from './dialogs.js';

const KEY = 'teocors-cart-v1';
const FREE_SHIPPING = 250000;
const MAX_QTY = 9;

const byId = (id) => products.find((p) => p.id === id);

function read() {
  try {
    const items = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(items) ? items.filter((i) => byId(i.id)) : [];
  } catch {
    return [];
  }
}

export function createCart() {
  let items = read();
  const listeners = new Set();
  const emit = (change) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* private mode: the cart still works for this visit */
    }
    listeners.forEach((fn) => fn(items, change));
  };
  const find = (id, size) => items.find((i) => i.id === id && i.size === size);

  return {
    get items() {
      return items;
    },
    add(id, size) {
      const item = find(id, size);
      if (item) item.qty = Math.min(MAX_QTY, item.qty + 1);
      else items = [...items, { id, size, qty: 1 }];
      emit({ type: 'add', id, size });
    },
    setQty(id, size, qty) {
      if (qty <= 0) {
        items = items.filter((i) => i !== find(id, size));
      } else {
        find(id, size).qty = Math.min(MAX_QTY, qty);
      }
      emit({ type: 'qty', id, size });
    },
    count: () => items.reduce((n, i) => n + i.qty, 0),
    subtotal: () => items.reduce((n, i) => n + byId(i.id).price * i.qty, 0),
    subscribe(fn) {
      listeners.add(fn);
      fn(items, { type: 'init' });
    },
  };
}

function lineHTML({ id, size, qty }) {
  const p = byId(id);
  const key = `${id}:${size}`;
  return `
    <li class="cart-item" data-key="${key}">
      <img src="products/${id}.webp" alt="" width="80" height="100" loading="lazy" />
      <div class="cart-item-info">
        <p class="cart-item-name">${p.name}</p>
        <p class="cart-item-meta">${p.color} · Talla ${size}</p>
        <div class="qty" role="group" aria-label="Cantidad de ${p.name}, talla ${size}">
          <button type="button" data-action="dec" aria-label="Quitar una unidad">${icon('minus')}</button>
          <span>${qty}</span>
          <button type="button" data-action="inc" aria-label="Agregar una unidad" ${qty >= MAX_QTY ? 'disabled' : ''}>${icon('plus')}</button>
        </div>
      </div>
      <div class="cart-item-side">
        <p class="cart-item-price">${formatPrice(p.price * qty)}</p>
        <button type="button" class="link-btn" data-action="remove" aria-label="Eliminar ${p.name}, talla ${size}">Eliminar</button>
      </div>
    </li>`;
}

export function setupCartUI(cart) {
  const dialog = document.querySelector('[data-cart]');
  const list = dialog.querySelector('[data-cart-items]');
  const empty = dialog.querySelector('[data-cart-empty]');
  const foot = dialog.querySelector('[data-cart-foot]');
  const shipping = dialog.querySelector('[data-cart-shipping]');
  const subtotalEl = dialog.querySelector('[data-cart-subtotal]');
  const titleCount = dialog.querySelector('[data-cart-title-count]');
  const checkoutMsg = dialog.querySelector('[data-checkout-msg]');
  const added = dialog.querySelector('[data-cart-added]');
  const openBtn = document.querySelector('[data-cart-open]');
  const badge = document.querySelector('[data-cart-count]');

  cart.subscribe((items, change) => {
    // Remember which control had focus so re-rendering doesn't drop it.
    const active = document.activeElement;
    const focusKey = active?.closest('.cart-item')?.dataset.key;
    const focusAction = active?.dataset.action;

    const count = cart.count();
    const subtotal = cart.subtotal();
    list.innerHTML = items.map(lineHTML).join('');
    empty.hidden = items.length > 0;
    list.hidden = foot.hidden = shipping.hidden = items.length === 0;
    subtotalEl.textContent = formatPrice(subtotal);
    titleCount.textContent = count ? `(${count})` : '';
    checkoutMsg.textContent = '';
    added.hidden = change.type !== 'add';
    if (change.type === 'add') {
      added.innerHTML = `${icon('check')} Añadido: ${byId(change.id).name} · Talla ${change.size}`;
    }

    const missing = FREE_SHIPPING - subtotal;
    shipping.innerHTML = `
      <p>${missing > 0 ? `Te faltan <strong>${formatPrice(missing)}</strong> para el envío gratis.` : '<strong>¡Tienes envío gratis!</strong>'}</p>
      <div class="progress" aria-hidden="true"><span style="transform:scaleX(${Math.min(1, subtotal / FREE_SHIPPING)})"></span></div>`;

    badge.textContent = count;
    openBtn.setAttribute('aria-label', `Abrir carrito, ${count} ${count === 1 ? 'producto' : 'productos'}`);
    if (change.type === 'add' && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animate(badge, { transform: ['scale(1)', 'scale(1.35)', 'scale(1)'] }, { duration: 0.45 });
    }

    if (focusKey && !active.isConnected) {
      const row = list.querySelector(`[data-key="${CSS.escape(focusKey)}"]`);
      const target = row?.querySelector(`[data-action="${focusAction}"]:not([disabled])`) ?? row?.querySelector('[data-action]');
      (target ?? dialog.querySelector('[data-close]')).focus();
    }
  });

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const [id, size] = btn.closest('.cart-item').dataset.key.split(':');
    const item = cart.items.find((i) => i.id === id && i.size === size);
    const delta = { inc: 1, dec: -1, remove: -item.qty }[btn.dataset.action];
    cart.setQty(id, size, item.qty + delta);
  });

  dialog.querySelector('[data-checkout]').addEventListener('click', () => {
    checkoutMsg.textContent =
      'El pago en línea llega muy pronto. Mientras tanto, escríbenos por Instagram para apartar tus prendas.';
  });

  openBtn.addEventListener('click', () => openDialog(dialog));

  return { open: () => openDialog(dialog) };
}
