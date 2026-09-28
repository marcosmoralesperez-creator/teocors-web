import { animate, stagger } from 'motion';
import { products, categories, departments, departmentOf, sizesFor, formatPrice } from '../data/products.js';
import { productImage } from '../data/images.js';
import { icon } from './icons.js';
import { openDialog, closeDialog } from './dialogs.js';
import { searchProducts } from './search.js';

const byId = (id) => products.find((p) => p.id === id);
const categoryLabel = (id) => categories.find((c) => c.id === id)?.label ?? '';
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease = [0.22, 1, 0.36, 1];

const sizeRange = (d) => d.range ?? `${d.sizes[0]}–${d.sizes[d.sizes.length - 1]}`;
const inDept = (dept) => (dept === 'all' ? products : products.filter((p) => p.department === dept));

const SORTS = {
  featured: () => 0,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
};

// Two pieces per section for the tiles, front one first.
const TILE_PIECES = { hombre: ['chaqueta-denim', 'bermuda-camo'], mujer: ['mujer-bomber-cuadros', 'mujer-falda-pana'], ninos: ['ninos-puffer', 'ninos-rugby-amarillo'] };

function tileHTML(d) {
  const n = inDept(d.id).length;
  const [front, back] = TILE_PIECES[d.id];
  return `
    <li>
      <a class="dept-tile dept-tile--${d.id}" href="#coleccion" data-dept-link="${d.id}">
        <span class="dept-media" aria-hidden="true">
          <img class="dept-img dept-img--back" src="${productImage(back)}" alt="" width="960" height="1200" loading="lazy" />
          <img class="dept-img dept-img--front" src="${productImage(front)}" alt="" width="960" height="1200" loading="lazy" />
        </span>
        <span class="dept-copy">
          <span class="dept-meta">${n} piezas · Tallas ${sizeRange(d)}</span>
          <span class="dept-name">${d.label}</span>
          <span class="dept-lead">${d.lead}</span>
          <span class="dept-cta">Ver ${d.label} ${icon('arrow-up-right')}</span>
        </span>
      </a>
    </li>`;
}

function cardHTML(p) {
  const d = departmentOf(p.department);
  return `
    <li class="product-card">
      <article class="product" aria-labelledby="p-${p.id}">
        <button type="button" class="product-media" data-open="${p.id}" aria-label="Vista rápida: ${p.name}">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
          <img src="${productImage(p.id)}" alt="" width="960" height="1200" loading="lazy" decoding="async" />
          ${productImage(`${p.id}-b`) ? `<img class="product-alt" src="${productImage(`${p.id}-b`)}" alt="" width="960" height="1200" loading="lazy" decoding="async" />` : ''}
          <span class="product-quick" aria-hidden="true">Vista rápida</span>
        </button>
        <div class="product-info">
          <div>
            <p class="product-dept">${d.label} · ${categoryLabel(p.category)}</p>
            <h3 class="product-name" id="p-${p.id}">${p.name}</h3>
            <p class="product-meta"><span class="swatch" style="background:${p.swatch}" aria-hidden="true"></span>${p.color} · ${sizeRange(d)}</p>
          </div>
          <p class="product-price">${formatPrice(p.price)}</p>
        </div>
        <button type="button" class="btn btn-outline btn-block btn-compact" data-open="${p.id}">
          Elegir talla ${icon('plus')}
        </button>
      </article>
    </li>`;
}

const SIZE_TABLES = {
  hombre: {
    note: 'Corte amplio: si prefieres un fit regular, pide una talla menos.',
    head: ['Talla', 'Ancho de pecho', 'Largo total', 'Manga'],
    rows: [
      ['S', 56, 70, 22],
      ['M', 59, 72, 23],
      ['L', 62, 74, 24],
      ['XL', 65, 76, 25],
    ],
  },
  mujer: {
    note: 'Medidas de camisetas, tops y chaquetas. En jean y falda la talla va por cintura: XS 64, S 68, M 72 y L 76 cm.',
    head: ['Talla', 'Ancho de pecho', 'Largo total', 'Manga'],
    rows: [
      ['XS', 50, 60, 19],
      ['S', 53, 62, 20],
      ['M', 56, 64, 21],
      ['L', 59, 66, 22],
    ],
  },
  ninos: {
    note: 'Hasta la 12, la talla es la edad; la 14 va de 13 a 15 años. Si está entre dos, elige la mayor.',
    head: ['Talla', 'Edad', 'Ancho de pecho', 'Largo total'],
    rows: [
      ['4', '3–4 años', 36, 44],
      ['6', '5–6 años', 38, 48],
      ['8', '7–8 años', 41, 52],
      ['10', '9–10 años', 44, 56],
      ['12', '11–12 años', 47, 60],
      ['14', '13–15 años', 51, 65],
    ],
  },
};

export function setupCatalog({ cart, cartUI }) {
  const grid = document.querySelector('[data-product-grid]');
  const tabs = document.querySelector('[data-dept-tabs]');
  const filters = document.querySelector('[data-filters]');
  const sortSel = document.querySelector('[data-sort]');
  const status = document.querySelector('[data-filter-status]');
  const title = document.querySelector('[data-shop-title]');
  const lead = document.querySelector('[data-shop-lead]');
  const tiles = document.querySelector('[data-dept-tiles]');

  const state = { dept: 'all', cat: 'all', sort: 'featured', q: '' };

  tiles.innerHTML = departments.map(tileHTML).join('');
  tabs.innerHTML = [{ id: 'all', label: 'Todo' }, ...departments]
    .map(
      (d) =>
        `<button type="button" class="dept-tab" data-dept="${d.id}" aria-pressed="${d.id === 'all'}">${d.label}<span class="chip-count">${inDept(d.id).length}</span></button>`,
    )
    .join('');

  function render({ animateIn = true } = {}) {
    const found = state.q ? new Set(searchProducts(state.q)) : null;
    const pool = inDept(state.dept).filter((p) => !found || found.has(p));
    const list = pool
      .filter((p) => state.cat === 'all' || p.category === state.cat)
      .map((p, i) => [p, i])
      .sort(([a, ia], [b, ib]) => SORTS[state.sort](a, b) || ia - ib)
      .map(([p]) => p);

    tabs.querySelectorAll('[data-dept]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.dept === state.dept));
      // Counts follow the active search.
      b.querySelector('.chip-count').textContent = inDept(b.dataset.dept).filter((p) => !found || found.has(p)).length;
    });
    // Only garment types the catalog actually carries.
    filters.innerHTML = categories
      .filter((c) => c.id === 'all' || products.some((p) => p.category === c.id))
      .map((c) => {
        const n = c.id === 'all' ? pool.length : pool.filter((p) => p.category === c.id).length;
        return `<button type="button" class="chip" data-filter="${c.id}" aria-pressed="${c.id === state.cat}" ${n ? '' : 'disabled'}>${c.label}<span class="chip-count">${n}</span></button>`;
      })
      .join('');

    const d = departmentOf(state.dept);
    title.textContent = state.q ? `Resultados para “${state.q}”` : d ? d.label : 'Toda la colección';
    lead.textContent = d ? d.lead : 'Hombre, mujer y niños. Pocas piezas, en tirajes cortos.';

    grid.innerHTML = list.map(cardHTML).join('');
    const scope = [d?.label, state.cat === 'all' ? '' : categoryLabel(state.cat).toLowerCase()].filter(Boolean).join(' · ');
    status.innerHTML = `${list.length} ${list.length === 1 ? 'pieza' : 'piezas'}${scope ? ` · ${scope}` : ''}${
      state.q ? ` <button type="button" class="clear-search" data-clear-search>Quitar búsqueda ${icon('x')}</button>` : ''
    }`;
    if (state.q && !list.length) {
      grid.innerHTML = `<li class="shop-empty">No hay piezas para “${state.q}”${d ? ` en ${d.label}` : ''}. <button type="button" class="link-btn" data-clear-search>Ver toda la colección</button></li>`;
    }

    if (animateIn && !reduced()) {
      animate(grid.children, { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0px)'] }, { delay: stagger(0.05), duration: 0.5, ease });
    }
  }

  // Menu links start a fresh view; the shop tabs keep an active search.
  function setDept(id, { scroll = false, keepSearch = false } = {}) {
    state.dept = id;
    state.cat = 'all';
    if (!keepSearch) state.q = '';
    render();
    if (scroll) document.querySelector('#coleccion').scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
  }

  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-dept]');
    if (b) setDept(b.dataset.dept, { keepSearch: true });
  });
  filters.addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    state.cat = b.dataset.filter;
    render();
  });
  sortSel.addEventListener('change', () => {
    state.sort = sortSel.value;
    render();
  });

  // Section links anywhere on the page (menus, tiles, footer): the anchor
  // scrolls to the shop and this picks the section.
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-clear-search]')) {
      state.q = '';
      render();
      return;
    }
    const a = e.target.closest('[data-dept-link]');
    if (a) setDept(a.dataset.deptLink);
    const f = e.target.closest('[data-filter-link]');
    if (f) {
      state.cat = f.dataset.filterLink;
      render();
    }
  });

  // Deep links: /#hombre, /#mujer, /#ninos.
  const fromHash = () => {
    const id = location.hash.slice(1);
    if (departmentOf(id)) setDept(id, { scroll: true });
  };
  window.addEventListener('hashchange', fromHash);
  render({ animateIn: false });
  if (departmentOf(location.hash.slice(1))) requestAnimationFrame(fromHash);

  // -------------------------------------------------------------- quick view
  const qv = document.querySelector('[data-quickview]');
  const form = qv.querySelector('[data-qv-form]');
  const sizeRow = qv.querySelector('[data-qv-sizes]');
  const sizeError = qv.querySelector('#qv-size-error');
  const $ = (sel) => qv.querySelector(sel);

  function openQuickview(id) {
    const p = byId(id);
    qv.dataset.product = id;
    qv.dataset.dept = p.department;
    const img = $('[data-qv-img]');
    img.src = productImage(p.id);
    img.alt = p.garment ? `${p.name} colgada en un gancho` : `${p.name}, foto de producto`;
    $('[data-qv-cat]').textContent = `${departmentOf(p.department).label} · ${categoryLabel(p.category)}`;
    $('[data-qv-title]').textContent = p.name;
    $('[data-qv-price]').textContent = formatPrice(p.price);
    $('[data-qv-desc]').textContent = p.description;
    $('[data-qv-color]').textContent = p.color;
    sizeRow.innerHTML = sizesFor(p)
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
  const guideTabs = guide.querySelector('[data-sg-tabs]');
  const guideBody = guide.querySelector('[data-sg-body]');
  guideTabs.innerHTML = departments
    .map((d) => `<button type="button" class="dept-tab" data-sg="${d.id}" aria-pressed="false">${d.label}</button>`)
    .join('');

  function showGuide(id) {
    const t = SIZE_TABLES[id];
    guideTabs.querySelectorAll('[data-sg]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sg === id)));
    guideBody.innerHTML = `
      <p class="quickview-desc">Medidas de la prenda en centímetros. ${t.note}</p>
      <table>
        <thead><tr>${t.head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
        <tbody>${t.rows.map(([s, ...r]) => `<tr><th scope="row">${s}</th>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>`;
  }
  guideTabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-sg]');
    if (b) showGuide(b.dataset.sg);
  });
  document.querySelectorAll('[data-size-guide]').forEach((b) =>
    b.addEventListener('click', () => {
      // From the quick view, open on that product's section.
      const fromQv = b.closest('[data-quickview]');
      showGuide(fromQv?.dataset.dept || (state.dept === 'all' ? 'hombre' : state.dept));
      openDialog(guide);
    }),
  );

  return {
    openQuickview,
    /** Filters the shop with a search and scrolls to it. */
    showInShop(q) {
      state.q = q;
      state.dept = 'all';
      state.cat = 'all';
      render();
      document.querySelector('#coleccion').scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
    },
  };
}
