// Catalog. Prices in Colombian pesos. `garment` drives the 3D model that is
// rendered into public/products/<id>.webp (see scripts/render-products.mjs).

export const categories = [
  { id: 'all', label: 'Todo' },
  { id: 'camisetas', label: 'Camisetas' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'buzos', label: 'Buzos' },
];

export const sizes = ['S', 'M', 'L', 'XL'];

export const products = [
  {
    id: 'noir',
    name: 'Camiseta Oversize Noir',
    category: 'camisetas',
    price: 119000,
    color: 'Negro',
    badge: 'Nuevo',
    soldOut: [],
    description:
      'Nuestra camiseta insignia. Algodón pesado que cae con peso propio, hombro caído y el logo TEOCORS estampado en dorado con relieve.',
    details: ['Algodón peinado 280 g/m²', 'Corte oversize, hombro caído', 'Estampado dorado en relieve'],
    garment: { type: 'tee', base: '#252422', print: '#c9a45c', sheen: '#8a806f' },
  },
  {
    id: 'hueso',
    name: 'Camiseta Oversize Hueso',
    category: 'camisetas',
    price: 119000,
    color: 'Hueso',
    soldOut: [],
    description:
      'La misma silueta amplia en un tono hueso cálido, con estampado negro mate. Combina con todo lo oscuro de tu clóset.',
    details: ['Algodón peinado 280 g/m²', 'Corte oversize, hombro caído', 'Estampado negro mate'],
    garment: { type: 'tee', base: '#e4dccf', print: '#1b1814', sheen: '#fff6e8' },
  },
  {
    id: 'eclipse',
    name: 'Hoodie Eclipse',
    category: 'hoodies',
    price: 229000,
    color: 'Negro carbón',
    badge: 'Más vendido',
    soldOut: [],
    description:
      'Hoodie de felpa perchada por dentro, capucha de doble capa y cordones con puntas metálicas doradas. Hecho para las noches frías.',
    details: ['Felpa perchada 420 g/m²', 'Capucha de doble capa', 'Puntas metálicas doradas'],
    garment: { type: 'hoodie', base: '#28282b', trim: '#e9e2d6', print: '#c9a45c', sheen: '#8a8690' },
  },
  {
    id: 'borgona',
    name: 'Hoodie Borgoña',
    category: 'hoodies',
    price: 229000,
    color: 'Borgoña',
    badge: 'Últimas unidades',
    soldOut: ['S'],
    description:
      'El Eclipse en un borgoña profundo, casi negro con poca luz. Bolsillo canguro y puños en rib que mantienen la forma.',
    details: ['Felpa perchada 420 g/m²', 'Bolsillo canguro', 'Puños y bajo en rib'],
    garment: { type: 'hoodie', base: '#4b1b24', trim: '#16110f', print: '#e9e2d6', sheen: '#b0707a' },
  },
  {
    id: 'grafito',
    name: 'Buzo Crewneck Grafito',
    category: 'buzos',
    price: 189000,
    color: 'Grafito',
    soldOut: [],
    description:
      'Crewneck de corte relajado con tipografía editorial al frente. Cuello, puños y bajo en rib grueso.',
    details: ['Felpa perchada 380 g/m²', 'Cuello en rib grueso', 'Estampado hueso'],
    garment: { type: 'crew', base: '#3b3b3e', print: '#e9e2d6', sheen: '#9a9aa2' },
  },
  {
    id: 'medianoche',
    name: 'Buzo Crewneck Medianoche',
    category: 'buzos',
    price: 189000,
    color: 'Azul medianoche',
    soldOut: ['XL'],
    description:
      'Azul tan oscuro que parece negro hasta que le da la luz. Tipografía dorada y rib grueso en cuello, puños y bajo.',
    details: ['Felpa perchada 380 g/m²', 'Cuello en rib grueso', 'Estampado dorado'],
    garment: { type: 'crew', base: '#1a2135', print: '#c9a45c', sheen: '#6d7aa8' },
  },
];

// Close-up shots for the "Detalles" section.
export const detailShots = [
  { id: 'detail-print', product: 'noir', focus: [512, 350], height: 1.7 },
  { id: 'detail-cords', product: 'eclipse', focus: [512, 400], height: 1.6 },
  { id: 'detail-type', product: 'medianoche', focus: [512, 290], height: 1.75 },
];

export const formatPrice = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
