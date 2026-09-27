import { products, categories, departmentOf, formatPrice } from '../data/products.js';
import { productImage } from '../data/images.js';
import { openDialog, closeDialog } from './dialogs.js';

const categoryLabel = (id) => categories.find((c) => c.id === id)?.label ?? '';

/** Lowercase without accents, so "ninos" finds "Niños". */
export const normalize = (s) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

// Words people use in Colombia for the same pieces.
const SYNONYMS = {
  saco: 'buzo',
  sueter: 'buzo',
  buso: 'buzo',
  crewneck: 'buzo',
  sudadera: 'hoodie',
  capucha: 'hoodie',
  capota: 'hoodie',
  polo: 'camiseta',
  playera: 'camiseta',
  camisa: 'camiseta',
  franela: 'camiseta',
  tshirt: 'camiseta',
  nina: 'ninos',
  nino: 'ninos',
  kids: 'ninos',
  infantil: 'ninos',
  dama: 'mujer',
  caballero: 'hombre',
  negra: 'negro',
  blanco: 'hueso',
  blanca: 'hueso',
  beige: 'arena',
  gris: 'grafito niebla',
  azul: 'medianoche',
  cafe: 'moca',
  vinotinto: 'borgona',
};

const haystacks = new Map(
  products.map((p) => [
    p.id,
    normalize(
      [
        p.name,
        p.color,
        departmentOf(p.department).label,
        categoryLabel(p.category),
        p.category,
        p.badge ?? '',
        // Material words, without the print colors the details mention.
        ...p.details.map((d) => d.replace(/estampado.*|emblema.*/i, '')),
      ].join(' '),
    ),
  ]),
);

// Each word must match; a word matches itself, its singular or a synonym.
function variants(word) {
  const out = new Set([word]);
  if (word.length > 3 && word.endsWith('es')) out.add(word.slice(0, -2));
  if (word.length > 3 && word.endsWith('s')) out.add(word.slice(0, -1));
  [...out].forEach((w) => SYNONYMS[w]?.split(' ').forEach((s) => out.add(s)));
  return [...out];
}

/** Products matching the query, best first (name matches before the rest). */
export function searchProducts(query) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const opts = words.map(variants);
  return products
    .filter((p) => opts.every((vs) => vs.some((v) => haystacks.get(p.id).includes(v))))
    .map((p) => {
      const name = normalize(`${p.name} ${departmentOf(p.department).label}`);
      const score = opts.filter((vs) => vs.some((v) => name.includes(v))).length;
      return [p, score];
    })
    .sort((a, b) => b[1] - a[1])
    .map(([p]) => p);
}

function resultHTML(p, i) {
  return `
    <li role="option" id="sr-${p.id}" data-result="${p.id}" aria-selected="${i === 0}">
      <span class="sr-thumb"><img src="${productImage(p.id)}" alt="" width="96" height="120" loading="lazy" /></span>
      <span class="sr-text">
        <span class="sr-meta">${departmentOf(p.department).label} · ${categoryLabel(p.category)}</span>
        <span class="sr-name">${p.name}</span>
        <span class="sr-color">${p.color}</span>
      </span>
      <span class="sr-price">${formatPrice(p.price)}</span>
    </li>`;
}

const POPULAR = ['Hoodie', 'Crop', 'Niños', 'Arena', 'Buzo', 'Negro'];

/**
 * Search panel: live results as you type, arrow keys to move, Enter to open
 * the quick view, and "Ver todos" to filter the shop with the same words.
 */
export function setupSearch({ openQuickview, showInShop }) {
  const dialog = document.querySelector('[data-search]');
  const form = dialog.querySelector('[data-search-form]');
  const input = dialog.querySelector('#search-input');
  const list = dialog.querySelector('[data-search-results]');
  const status = dialog.querySelector('[data-search-status]');
  const suggest = dialog.querySelector('[data-search-suggest]');
  const all = dialog.querySelector('[data-search-all]');
  let results = [];
  let active = 0;

  suggest.querySelector('[data-search-chips]').innerHTML = POPULAR.map(
    (w) => `<button type="button" class="chip" data-suggest="${w}">${w}</button>`,
  ).join('');

  function setActive(i) {
    active = (i + results.length) % results.length;
    list.querySelectorAll('[data-result]').forEach((li, n) => li.setAttribute('aria-selected', String(n === active)));
    input.setAttribute('aria-activedescendant', results.length ? `sr-${results[active].id}` : '');
    list.children[active]?.scrollIntoView({ block: 'nearest' });
  }

  function update() {
    const q = input.value.trim();
    results = searchProducts(q);
    suggest.hidden = !!q;
    list.innerHTML = results.map(resultHTML).join('');
    all.hidden = !results.length;
    all.querySelector('span').textContent = `Ver ${results.length === 1 ? 'el resultado' : `los ${results.length} resultados`} en la tienda`;
    if (!q) status.textContent = '';
    else if (!results.length) status.textContent = `No encontramos nada para “${q}”. Prueba con hoodie, crop, buzo o un color.`;
    else status.textContent = `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}`;
    if (results.length) setActive(0);
    else input.removeAttribute('aria-activedescendant');
  }

  async function choose(id) {
    await closeDialog(dialog);
    openQuickview(id);
  }

  async function seeAll() {
    const q = input.value.trim();
    await closeDialog(dialog);
    showInShop(q);
  }

  input.addEventListener('input', update);
  input.addEventListener('keydown', (e) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(active + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(active - 1);
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (results.length) choose(results[active].id);
  });
  list.addEventListener('click', (e) => {
    const li = e.target.closest('[data-result]');
    if (li) choose(li.dataset.result);
  });
  list.addEventListener('mousemove', (e) => {
    const li = e.target.closest('[data-result]');
    if (li) setActive([...list.children].indexOf(li));
  });
  suggest.addEventListener('click', (e) => {
    const b = e.target.closest('[data-suggest]');
    if (!b) return;
    input.value = b.dataset.suggest;
    update();
    input.focus();
  });
  all.addEventListener('click', seeAll);

  function open() {
    openDialog(dialog);
    input.select();
    update();
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-search-open]')) open();
  });
  // "/" or Ctrl/⌘+K opens the search from anywhere except text fields.
  document.addEventListener('keydown', (e) => {
    const typing = e.target.closest?.('input, textarea, select, [contenteditable]');
    if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) {
      if (document.querySelector('dialog[open]')) return;
      e.preventDefault();
      open();
    }
  });

  return { open };
}
