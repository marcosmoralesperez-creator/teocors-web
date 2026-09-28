// Catalog. Prices in Colombian pesos. `garment` drives the 3D model that is
// rendered into src/assets/products/<id>.webp (scripts/render-products.mjs);
// pieces without `garment` use a real photo (scripts/cutout-photos.py).

export const departments = [
  { id: 'hombre', label: 'Hombre', sizes: ['S', 'M', 'L', 'XL'], lead: 'Denim lavado, cargo y siluetas amplias.' },
  { id: 'mujer', label: 'Mujer', sizes: ['XS', 'S', 'M', 'L'], lead: 'Siluetas boxy y crop, en la misma paleta neutra.' },
  // La talla 14 cubre de 13 a 15 años; `range` es lo que se muestra en la tienda.
  { id: 'ninos', label: 'Niños', sizes: ['4', '6', '8', '10', '12', '14'], range: '4–15 años', lead: 'Colegio, recreo y fin de semana, en tallas de 4 a 15 años.' },
];

export const categories = [
  { id: 'all', label: 'Todo' },
  { id: 'camisetas', label: 'Camisetas' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'buzos', label: 'Buzos' },
  { id: 'chaquetas', label: 'Chaquetas' },
  { id: 'pantalones', label: 'Pantalones' },
];

export const departmentOf = (id) => departments.find((d) => d.id === id);
export const sizesFor = (product) => departmentOf(product.department).sizes;

// Paleta de la colección 2026.
const C = {
  noir: '#1f1f1f',
  hueso: '#e6e0d5',
  arena: '#b9a488',
  grafito: '#404043',
  niebla: '#b9b7b2',
  moca: '#5b4637',
  medianoche: '#1b2132',
  borgona: '#4a1d25',
};

const tee = { camisetas: 'Algodón peinado 240 g/m²', hoodies: 'Felpa perchada 420 g/m²', buzos: 'Felpa perchada 380 g/m²' };

export const products = [
  // ------------------------------------------------------------------ Hombre
  // Fotos reales (sin `garment`): src/assets/products/<id>.webp sale de
  // assets-src/fotos/ con scripts/cutout-photos.py.
  {
    id: 'chaqueta-denim',
    department: 'hombre',
    name: 'Chaqueta Denim Tierra',
    category: 'chaquetas',
    price: 289000,
    color: 'Denim lavado tierra',
    swatch: '#6f7b80',
    badge: 'Nuevo',
    soldOut: [],
    description:
      'Chaqueta de jean clásica con lavado tierra sobre el índigo, bolsillos de pecho con solapa y botones metálicos. Se ve mejor con el uso.',
    details: ['Denim 100 % algodón', 'Lavado tierra a mano', 'Botones metálicos, puños ajustables'],
  },
  {
    id: 'polo-franja',
    department: 'hombre',
    name: 'Polo Franja Diagonal',
    category: 'camisetas',
    price: 149000,
    color: 'Blanco / azul noche',
    swatch: '#f2f2ef',
    soldOut: [],
    description: 'Polo de corte boxy en piqué blanco, cruzado por una franja diagonal azul noche de hombro a cadera.',
    details: ['Piqué de algodón', 'Corte boxy, manga corta amplia', 'Cuello con dos botones'],
  },
  {
    id: 'manga-larga-rayas',
    department: 'hombre',
    name: 'Camiseta Manga Larga Rayas',
    category: 'camisetas',
    price: 139000,
    color: 'Rayas crema y arena',
    swatch: '#f0e2bd',
    soldOut: [],
    description: 'Manga larga de rayas finas en crema y arena, hombro caído y largo corto. Logo bordado al frente.',
    details: ['Algodón jersey pesado', 'Hombro caído, largo corto', 'Logo bordado'],
  },
  {
    id: 'pantalon-barrel',
    department: 'hombre',
    name: 'Pantalón Barrel Crema',
    category: 'pantalones',
    price: 219000,
    color: 'Crema',
    swatch: '#ebe2cf',
    badge: 'Campaña 2026',
    soldOut: [],
    description: 'Pantalón de pinzas con pierna curva tipo barrel: amplio en la rodilla y recogido en el bajo.',
    details: ['Sarga de algodón', 'Pinzas frontales, pierna barrel', 'Bolsillos laterales'],
  },
  {
    id: 'bermuda-camo',
    department: 'hombre',
    name: 'Bermuda Cargo Camuflado',
    category: 'pantalones',
    price: 169000,
    color: 'Camuflado oliva',
    swatch: '#5c5e44',
    soldOut: ['XL'],
    description: 'Bermuda cargo larga en lona lavada con camuflado oliva y café. Bolsillos cargo con solapa a los lados.',
    details: ['Lona de algodón lavada', 'Largo bajo la rodilla', 'Bolsillos cargo con solapa'],
  },

  // ------------------------------------------------------------------- Mujer
  {
    id: 'crop-hueso',
    department: 'mujer',
    name: 'Camiseta Crop Hueso',
    category: 'camisetas',
    price: 99000,
    color: 'Hueso',
    swatch: C.hueso,
    badge: 'Nuevo',
    soldOut: [],
    description: 'Corte crop con hombro caído y cuello en rib. El largo justo para llevar con jean de tiro alto.',
    details: [tee.camisetas, 'Corte crop, boxy', 'Estampado negro mate'],
    garment: { type: 'crop', base: C.hueso, print: '#1b1814', sheen: '#fff6e8', printStyle: 'wordmark' },
  },
  {
    id: 'crop-noir',
    department: 'mujer',
    name: 'Camiseta Crop Noir',
    category: 'camisetas',
    price: 99000,
    color: 'Negro',
    swatch: C.noir,
    soldOut: ['XS'],
    description: 'La crop en negro, con las cinco estrellas del emblema en el pecho.',
    details: [tee.camisetas, 'Corte crop, boxy', 'Emblema de estrellas'],
    garment: { type: 'crop', base: C.noir, print: C.hueso, sheen: '#77736c', printStyle: 'mark' },
  },
  {
    id: 'boxy-arena',
    department: 'mujer',
    name: 'Camiseta Boxy Arena',
    category: 'camisetas',
    price: 115000,
    color: 'Arena',
    swatch: C.arena,
    soldOut: [],
    description: 'Silueta cuadrada que cae recta, en el tono arena de la campaña. Estampado TEO / CORS.',
    details: [tee.camisetas, 'Corte boxy', 'Estampado negro en relieve'],
    garment: { type: 'tee', base: C.arena, print: '#2a2622', sheen: '#efe2cf', printStyle: 'stack' },
  },
  {
    id: 'niebla',
    department: 'mujer',
    name: 'Hoodie Oversize Niebla',
    category: 'hoodies',
    price: 225000,
    color: 'Gris niebla',
    swatch: C.niebla,
    badge: 'Más vendido',
    soldOut: [],
    description: 'Hoodie amplio en gris claro, felpa suave por dentro y capucha de doble capa.',
    details: [tee.hoodies, 'Corte oversize', 'Cordones con puntas metálicas'],
    garment: { type: 'hoodie', base: C.niebla, trim: '#2a2622', print: '#2a2622', sheen: '#f4f2ee', printStyle: 'mark' },
  },
  {
    id: 'borgona',
    department: 'mujer',
    name: 'Hoodie Borgoña',
    category: 'hoodies',
    price: 225000,
    color: 'Borgoña',
    swatch: C.borgona,
    badge: 'Últimas unidades',
    soldOut: ['S'],
    description: 'Un borgoña profundo, casi negro con poca luz. Bolsillo canguro y puños en rib que mantienen la forma.',
    details: [tee.hoodies, 'Bolsillo canguro', 'Puños y bajo en rib'],
    garment: { type: 'hoodie', base: C.borgona, trim: '#16110f', print: C.hueso, sheen: '#b0707a', printStyle: 'wordmark' },
  },
  {
    id: 'moca',
    department: 'mujer',
    name: 'Buzo Crewneck Moca',
    category: 'buzos',
    price: 179000,
    color: 'Moca',
    swatch: C.moca,
    soldOut: [],
    description: 'Crewneck relajado en café moca, con el logo TEOCORS en hueso.',
    details: [tee.buzos, 'Cuello en rib grueso', 'Estampado hueso'],
    garment: { type: 'crew', base: C.moca, print: C.hueso, sheen: '#b39a86', printStyle: 'wordmark' },
  },

  // ------------------------------------------------------------------- Niños
  // Fotos reales, igual que Hombre (assets-src/fotos → scripts/cutout-photos.py).
  {
    id: 'ninos-puffer',
    department: 'ninos',
    name: 'Chaqueta Puffer Salvia',
    category: 'chaquetas',
    price: 229000,
    color: 'Verde salvia',
    swatch: '#8f8f80',
    badge: 'Nuevo',
    soldOut: [],
    description: 'Chaqueta acolchada amplia con capucha forrada, cierre frontal negro y puños interiores que cortan el frío.',
    details: ['Tela repelente al agua', 'Relleno térmico liviano', 'Capucha forrada, puños interiores'],
  },
  {
    id: 'ninos-medio-cierre',
    department: 'ninos',
    name: 'Buzo Medio Cierre Marino',
    category: 'buzos',
    price: 139000,
    color: 'Azul marino / gris jaspe',
    swatch: '#1f2a44',
    soldOut: [],
    description: 'Buzo de cuello alto con medio cierre, paneles en gris jaspe y crudo, y bolsillos laterales.',
    details: ['Felpa técnica suave', 'Cuello alto con medio cierre', 'Bolsillos laterales'],
  },
  {
    id: 'ninos-rugby-amarillo',
    department: 'ninos',
    name: 'Buzo Rugby Amarillo',
    category: 'buzos',
    price: 129000,
    color: 'Amarillo / crudo',
    swatch: '#ecd57a',
    badge: 'Más vendido',
    soldOut: ['4'],
    description: 'Buzo tipo rugby con cuello camisero en crudo, botones al frente y franjas azul marino en la manga.',
    details: ['Felpa perchada', 'Cuello camisero en contraste', 'Franjas en la manga'],
  },
  {
    id: 'ninos-buzo-dugout',
    department: 'ninos',
    name: 'Buzo Béisbol Verde',
    category: 'buzos',
    price: 119000,
    color: 'Verde bosque',
    swatch: '#23573a',
    soldOut: [],
    description: 'Buzo de inspiración béisbol con cuello de botones, letra cursiva al frente y puños a rayas.',
    details: ['Felpa perchada', 'Cuello con dos botones', 'Puños y bajo en rib a rayas'],
  },
  {
    id: 'ninos-bermuda-estrella',
    department: 'ninos',
    name: 'Bermuda Estrella Lavada',
    category: 'pantalones',
    price: 99000,
    color: 'Crudo lavado',
    swatch: '#dfe0dc',
    soldOut: [],
    description: 'Bermuda amplia en felpa con lavado azul, cintura elástica con cordón y una estrella cosida en la pierna.',
    details: ['Felpa de algodón lavada', 'Cintura elástica con cordón', 'Estrella aplicada con bordes crudos'],
  },
];

// Close-up shots for the "Detalles" section.
export const detailShots = [
  { id: 'detail-print', product: 'moca', focus: [512, 330], height: 1.7 },
  { id: 'detail-cords', product: 'niebla', focus: [512, 400], height: 1.6 },
  { id: 'detail-type', product: 'boxy-arena', focus: [512, 380], height: 1.75 },
];

export const formatPrice = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
