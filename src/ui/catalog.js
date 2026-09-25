import { animate, stagger } from 'motion';
import { products, categories, sizes, formatPrice } from '../data/products.js';
import { productImage } from '../data/images.js';
import { icon } from './icons.js';
import { openDialog, closeDialog } from './dialogs.js';

const byId = (id) => products.find((p) => p.id === id);
const categoryLabel = (id) => categories.find((c) => c.id === id)?.label ?? '';
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function cardHTML(p) {
  return `
    <li class="product-card" data-category="${p.category}">
      <article class="product" aria-labelledby="p-${p.id}">
        <button type="button" class="product-media" data-open="${p.id}" aria-label="Vista rápida: ${p.name}">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
          <img src="${productImage(p.id)}" alt="" width="960" height="1200" loading="lazy" decoding="async" />
          <span class="product-quick" aria-hidden="true">Vista rápida</span>
        </button>
        <div class="product-info">
          <div>
            <h3 class="product-name" id="p-${p.id}">${p.name}</h3>
            <p class="product-meta">${p.color}</p>
          </div>
          <p class="product-price">${formatPrice(p.price)}</p>
        </div>
        <button type="button" class="btn btn-outline btn-block btn-compact" data-open="${p.id}">
          Elegir talla ${icon('plus')}
        </button>
      </article>
    </li>`;
}

export function setupCatalog({ cart, cartUI }) {
  const grid = document.querySelector('[data-product-grid]');
  const filters = document.querySelector('[data-filters]');
  const status = document.querySelector('[data-filter-status]');

  filters.innerHTML = categories
    .map((c) => {
      const n = c.id === 'all' ? products.length : products.filter((p) => p.category === c.id).length;
      return `<button type="button" class="chip" data-filter="${c.id}" aria-pressed="${c.id === 'all'}">${c.label}<span class="chip-count">${n}</span></button>`;
    })
    .join('');
  grid.innerHTML = products.map(cardHTML).join('');

  // ---------------------------------------------------------------- filters
  function applyFilter(id) {
    filters.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === id)));
    const cards = [...grid.children];
    const shown = cards.filter((card) => {
      const match = id === 'all' || card.dataset.category === id;
      card.hidden = !match;
      return match;
    });
    shown.forEach((card) => (card.style.opacity = '1'));
    if (!reduced()) {
      animate(shown, { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0px)'] }, { delay: stagger(0.06), duration: 0.5, ease: [0.22, 1, 0.36, 1] });
    }
    status.textContent = `Mostrando ${shown.length} ${shown.length === 1 ? 'producto' : 'productos'}${id === 'all' ? '' : ` de ${categoryLabel(id)}`}.`;
  }
  filters.addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]');
    if (b) applyFilter(b.dataset.filter);
  });
  document.querySelectorAll('[data-filter-link]').forEach((a) =>
    a.addEventListener('click', () => applyFilter(a.dataset.filterLink)),
  );

  // -------------------------------------------------------------- quick view
  const qv = document.querySelector('[data-quickview]');
  const form = qv.querySelector('[data-qv-form]');
  const sizeRow = qv.querySelector('[data-qv-sizes]');
  const sizeError = qv.querySelector('#qv-size-error');
  const $ = (sel) => qv.querySelector(sel);

  function openQuickview(id) {
    const p = byId(id);
    qv.dataset.product = id;
    const img = $('[data-qv-img]');
    img.src = productImage(p.id);
    img.alt = `${p.name} colgada en un gancho dorado`;
    $('[data-qv-cat]').textContent = categoryLabel(p.category);
    $('[data-qv-title]').textContent = p.name;
    $('[data-qv-price]').textContent = formatPrice(p.price);
    $('[data-qv-desc]').textContent = p.description;
    $('[data-qv-color]').textContent = p.color;
    sizeRow.innerHTML = sizes
      .map((s) => {
        const out = p.soldOut.includes(s);
        return `<label class="size"><input type="radio" name="size" value="${s}" ${out ? 'disabled' : ''} aria-describedby="qv-size-error" /><span>${s}${out ? '<span class="sr-only"> (agotada)</span>' : ''}</span></label>`;
      })
      .join('');
    $('[data-qv-details]').innerHTML = p.details.map((d) => `<li>${icon('check')}${d}</li>`).join('');
    sizeError.hidden = true;
    openDialog(qv);
  }

  grid.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]');
    if (b) openQuickview(b.dataset.open);
  });

  sizeRow.addEventListener('change', () => (sizeError.hidden = true));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const size = new FormData(form).get('size');
    if (!size) {
      sizeError.hidden = false;
      sizeRow.querySelector('input:not(:disabled)')?.focus();
      return;
    }
    cart.add(qv.dataset.product, size);
    await closeDialog(qv);
    cartUI.open();
  });

  // ------------------------------------------------------------ size guide
  const guide = document.querySelector('[data-size-guide-dialog]');
  document.querySelectorAll('[data-size-guide]').forEach((b) => b.addEventListener('click', () => openDialog(guide)));
}
