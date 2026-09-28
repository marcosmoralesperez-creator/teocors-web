// Catalog. Prices in Colombian pesos. `garment` drives the 3D model that is
// rendered into src/assets/products/<id>.webp (scripts/render-products.mjs);
// pieces without `garment` use a real photo (scripts/cutout-photos.py).

export const departments = [
  { id: 'hombre', label: 'Hombre', sizes: ['S', 'M', 'L', 'XL'], lead: 'Denim lavado, cargo y siluetas amplias.' },
  { id: 'mujer', label: 'Mujer', sizes: ['XS', 'S', 'M', 'L'], lead: 'Pana, cuadros y denim en tonos tierra.' },
  // La talla 14 cubre de 13 a 15 años; `range` es lo que se muestra en la tienda.
  { id: 'ninos', label: 'Niños', sizes: ['4', '6', '8', '10', '12', '14'], range: '4–15 años', lead: 'Colegio, recreo y fin de semana, en tallas de 4 a 15 años.' },
];

export const categories = [
  { id: 'all', label: 'Todo' },
  { id: 'camisetas', label: 'Camisetas y tops' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'buzos', label: 'Buzos' },
  { id: 'chaquetas', label: 'Chaquetas' },
  { id: 'pantalones', label: 'Pantalones' },
  { id: 'faldas', label: 'Faldas' },
];

export const departmentOf = (id) => departments.find((d) => d.id === id);
export const sizesFor = (product) => departmentOf(product.department).sizes;

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
  // Fotos reales, igual que Hombre y Niños (assets-src/fotos → scripts/cutout-photos.py).
  {
    id: 'mujer-bomber-cuadros',
    department: 'mujer',
    name: 'Bomber Cuadros Cuello Peludo',
    category: 'chaquetas',
    price: 269000,
    color: 'Cuadros crudo y café',
    swatch: '#cfc6b3',
    badge: 'Nuevo',
    soldOut: [],
    description:
      'Bomber corta en cuadros crudo, azul y café, con cuello de pelo sintético removible, cierre frontal y puños y bajo en rib café.',
    details: ['Tejido de cuadros', 'Cuello de pelo sintético', 'Puños y bajo en rib'],
  },
  {
    id: 'mujer-top-asimetrico',
    department: 'mujer',
    name: 'Top Asimétrico Café',
    category: 'camisetas',
    price: 159000,
    color: 'Café',
    swatch: '#5d3d27',
    soldOut: [],
    description: 'Top de sastrería con escote asimétrico de un hombro, pretina con botón, pinzas laterales y puños doblados.',
    details: ['Sarga de sastrería', 'Escote a un hombro', 'Puños doblados con parche'],
  },
  {
    id: 'mujer-camiseta-doble',
    department: 'mujer',
    name: 'Camiseta Doble Capa Mostaza',
    category: 'camisetas',
    price: 99000,
    color: 'Mostaza / arena',
    swatch: '#d9ab4f',
    badge: 'Más vendido',
    soldOut: ['XS'],
    description: 'Camiseta ajustada de doble capa: mostaza por fuera y arena asomando en mangas y bajo. Estampado pequeño al pecho.',
    details: ['Algodón jersey', 'Efecto doble capa', 'Corte ajustado'],
  },
  {
    id: 'mujer-jean-dobladillo',
    department: 'mujer',
    name: 'Jean Ancho Dobladillo',
    category: 'pantalones',
    price: 229000,
    color: 'Índigo lavado',
    swatch: '#4d6178',
    soldOut: [],
    description: 'Jean de pierna ancha y largo tobillero con lavado vintage, rotos a mano y dobladillo ancho con orillo a la vista.',
    details: ['Denim con orillo', 'Rotos y lavado a mano', 'Dobladillo ancho'],
  },
  {
    id: 'mujer-falda-pana',
    department: 'mujer',
    name: 'Minifalda de Pana',
    category: 'faldas',
    price: 139000,
    color: 'Café tabaco',
    swatch: '#8a5a2b',
    soldOut: [],
    description: 'Minifalda de pana gruesa con pretina en rib, cordón al frente, bolsillos con solapa y pespunte en contraste.',
    details: ['Pana gruesa de algodón', 'Pretina elástica en rib', 'Bolsillos con solapa y botón'],
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

// Close-ups for the "Detalles" section now come from the real photos
// (scripts/detail-crops.py). Add { id, product, focus, height } entries here
// to render close-ups of 3D garments instead.
export const detailShots = [];

export const formatPrice = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
