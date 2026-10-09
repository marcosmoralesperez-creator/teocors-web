// Catálogo de Casa del Sebas. Todo es oro de 18 quilates (750 milésimas).
// Precios en pesos colombianos. `sizes`: largos o tallas que se pueden pedir.

export type CategoryId = 'cadenas' | 'pulseras' | 'manillas' | 'dijes' | 'anillos' | 'aretes';

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  badge?: string;
  weight: string;
  stones?: string;
  description: string;
  sizes: string[];
  engraving?: boolean;
  /** Nombre del selector de opciones cuando no es talla ni largo (p. ej. "Color del hilo"). */
  optionLabel?: string;
  /** Color de muestra para cada opción, cuando las opciones son colores. */
  swatches?: Record<string, string>;
  /** Línea extra en la ficha (material, ajuste…). */
  note?: string;
}

export const categories: { id: CategoryId; name: string }[] = [
  { id: 'cadenas', name: 'Cadenas' },
  { id: 'pulseras', name: 'Pulsos' },
  { id: 'manillas', name: 'Manillas tejidas' },
  { id: 'dijes', name: 'Dijes' },
  { id: 'anillos', name: 'Anillos' },
  { id: 'aretes', name: 'Aretes' },
];

const threadColors = {
  Negro: '#0b0b0b',
  Café: '#4a2c19',
  Rojo: '#7a1010',
  'Azul noche': '#121c33',
  'Verde oliva': '#3d4426',
  Beige: '#b39a72',
};
const threadOptions = Object.keys(threadColors);
const threadNote = 'Hilo encerado tejido a mano, resiste el agua. Nudo corredizo: se ajusta de 15 a 22 cm.';

export const products: Product[] = [
  {
    id: 'cubana-iced-14',
    name: 'Cubana Iced 14 mm',
    category: 'cadenas',
    price: 46500000,
    badge: 'Firma de la casa',
    weight: '96 g',
    stones: '612 diamantes de laboratorio VS · 7,4 ct',
    description:
      'La pieza que define la casa. Eslabones cubanos de 14 mm, pulidos a espejo y engastados uno por uno a mano. Broche de caja con doble seguro.',
    sizes: ['50 cm', '55 cm', '60 cm', '65 cm'],
  },
  {
    id: 'cubana-14',
    name: 'Cubana Clásica 12 mm',
    category: 'cadenas',
    price: 24800000,
    weight: '68 g',
    description:
      'Oro macizo, sin rellenos. Eslabones apretados que caen planos sobre el pecho y suenan a oro de verdad.',
    sizes: ['50 cm', '55 cm', '60 cm', '65 cm'],
  },
  {
    id: 'cubana-8',
    name: 'Cubana Clásica 8 mm',
    category: 'cadenas',
    price: 12900000,
    weight: '36 g',
    description: 'La cubana para todos los días: se nota sin pesar demasiado. Oro macizo pulido a espejo y broche de caja.',
    sizes: ['45 cm', '50 cm', '55 cm', '60 cm'],
  },
  {
    id: 'franco-4',
    name: 'Cadena Franco 4 mm',
    category: 'cadenas',
    price: 9800000,
    weight: '26 g',
    description: 'Tejido franco de cuatro lados, firme y flexible. La cadena ideal para colgar un dije pesado.',
    sizes: ['50 cm', '55 cm', '60 cm', '65 cm'],
  },
  {
    id: 'tenis-5',
    name: 'Cadena Tenis 5 mm',
    category: 'cadenas',
    price: 31000000,
    weight: '24 g',
    stones: '118 diamantes de laboratorio VS · 11,8 ct',
    description: 'Una línea continua de diamantes de 5 mm en garras de cuatro puntas. Brilla con cualquier luz.',
    sizes: ['45 cm', '50 cm', '55 cm'],
  },
  {
    id: 'soga-5',
    name: 'Cadena Soga 5 mm',
    category: 'cadenas',
    price: 12400000,
    weight: '31 g',
    description: 'Hilos de oro trenzados en espiral, cortados con diamante para que cada giro atrape la luz.',
    sizes: ['50 cm', '55 cm', '60 cm'],
  },
  {
    id: 'placa-iced',
    name: 'Placa Iced',
    category: 'dijes',
    price: 19500000,
    badge: 'Nuevo',
    weight: '22 g',
    stones: '204 diamantes de laboratorio VS · 3,1 ct',
    description:
      'Placa rectangular cubierta de diamantes de borde a borde. Viene montada en cadena franco de 3 mm, también en oro de 18k.',
    sizes: ['Con cadena 55 cm', 'Con cadena 60 cm', 'Solo el dije'],
  },
  {
    id: 'cruz-iced',
    name: 'Cruz Iced',
    category: 'dijes',
    price: 13200000,
    weight: '14 g',
    stones: '96 diamantes de laboratorio VS · 1,9 ct',
    description: 'Cruz latina de 4,5 cm con pavé completo en el frente y el reverso pulido para grabar.',
    sizes: ['Con cadena 55 cm', 'Con cadena 60 cm', 'Solo el dije'],
  },
  {
    id: 'inicial-s',
    name: 'Inicial Iced',
    category: 'dijes',
    price: 6900000,
    weight: '8 g',
    stones: '38 diamantes de laboratorio VS · 0,6 ct',
    description: 'Tu inicial en oro de 18k con una fila de diamantes. La hacemos con la letra que elijas.',
    sizes: ['Letra S', 'Otra letra (indícala en el grabado)'],
    engraving: true,
  },
  {
    id: 'pulsera-cubana-iced',
    name: 'Pulso Cubano Iced',
    category: 'pulseras',
    price: 28900000,
    badge: 'Más pedida',
    weight: '58 g',
    stones: '298 diamantes de laboratorio VS · 4,2 ct',
    description: 'La misma cubana iced de la casa, en pulso de 12 mm. Pesa en la muñeca como debe pesar.',
    sizes: ['19 cm', '20 cm', '21 cm', '22 cm'],
  },
  {
    id: 'pulsera-cubana',
    name: 'Pulso Cubano 12 mm',
    category: 'pulseras',
    price: 15600000,
    weight: '42 g',
    description: 'Oro macizo pulido a espejo. Para llevar sola o junto a la cubana iced.',
    sizes: ['19 cm', '20 cm', '21 cm', '22 cm'],
  },
  {
    id: 'pulsera-tenis',
    name: 'Pulso Tenis 4 mm',
    category: 'pulseras',
    price: 16800000,
    weight: '11 g',
    stones: '48 diamantes de laboratorio VS · 4,8 ct',
    description: 'Clásica, fina y sin fallas. Broche oculto con lengüeta y seguro lateral.',
    sizes: ['17 cm', '18 cm', '19 cm'],
  },
  {
    id: 'pulso-esclava',
    name: 'Pulso Esclava',
    category: 'pulseras',
    price: 9800000,
    weight: '24 g',
    description: 'Cubano de 6 mm con placa pulida al centro. Grabamos el nombre, la fecha o las iniciales que quieras.',
    sizes: ['18 cm', '19 cm', '20 cm', '21 cm'],
    engraving: true,
  },
  {
    id: 'pulso-rigido',
    name: 'Pulso Rígido',
    category: 'pulseras',
    price: 11200000,
    weight: '26 g',
    description: 'Aro macizo de 4 mm, pulido a espejo, con bisagra y cierre de presión invisible.',
    sizes: ['S · 17 cm', 'M · 18,5 cm', 'L · 20 cm'],
  },
  {
    id: 'pulso-soga',
    name: 'Pulso Soga 4 mm',
    category: 'pulseras',
    price: 5900000,
    weight: '15 g',
    description: 'La soga de la casa en pulso: hilos de oro trenzados que brillan en cada giro.',
    sizes: ['18 cm', '19 cm', '20 cm', '21 cm'],
  },
  {
    id: 'manilla-balines',
    name: 'Manilla Tejida Balines',
    category: 'manillas',
    price: 1450000,
    badge: 'Nuevo',
    weight: '2,1 g de oro',
    description: 'Cordón trenzado con cinco balines de oro de 18k de 4 mm. Para llevar todos los días o junto al pulso cubano.',
    sizes: threadOptions,
    optionLabel: 'Color del hilo',
    swatches: threadColors,
    note: threadNote,
  },
  {
    id: 'manilla-placa',
    name: 'Manilla Macramé Placa',
    category: 'manillas',
    price: 1950000,
    weight: '2,6 g de oro',
    description: 'Tejido macramé a mano con una placa de oro de 18k al centro. La grabamos con tu nombre o una fecha.',
    sizes: threadOptions,
    optionLabel: 'Color del hilo',
    swatches: threadColors,
    note: threadNote,
    engraving: true,
  },
  {
    id: 'manilla-cruz',
    name: 'Manilla Tejida Cruz',
    category: 'manillas',
    price: 1380000,
    weight: '1,8 g de oro',
    description: 'Cordón trenzado con una cruz de oro de 18k pulida, montada de lado sobre el hilo.',
    sizes: threadOptions,
    optionLabel: 'Color del hilo',
    swatches: threadColors,
    note: threadNote,
  },
  {
    id: 'manilla-inicial',
    name: 'Manilla Macramé Inicial',
    category: 'manillas',
    price: 1690000,
    weight: '2 g de oro',
    description: 'Macramé tejido a mano con tu inicial en oro de 18k. Escribe la letra en el grabado.',
    sizes: threadOptions,
    optionLabel: 'Color del hilo',
    swatches: threadColors,
    note: threadNote,
    engraving: true,
  },
  {
    id: 'anillo-sello',
    name: 'Sello de la Casa',
    category: 'anillos',
    price: 8400000,
    weight: '16 g',
    description: 'Anillo sello con la S de la casa en relieve sobre fondo satinado. También lo grabamos con tus iniciales.',
    sizes: ['Talla 7', 'Talla 8', 'Talla 9', 'Talla 10', 'Talla 11', 'Talla 12'],
    engraving: true,
  },
  {
    id: 'anillo-cubano-iced',
    name: 'Anillo Cubano Iced',
    category: 'anillos',
    price: 11700000,
    weight: '12 g',
    stones: '84 diamantes de laboratorio VS · 1,1 ct',
    description: 'Eslabones cubanos cerrados en anillo, con pavé en cada uno. Se hace a tu talla exacta.',
    sizes: ['Talla 7', 'Talla 8', 'Talla 9', 'Talla 10', 'Talla 11', 'Talla 12'],
  },
  {
    id: 'topos-solitario',
    name: 'Topos Solitario',
    category: 'aretes',
    price: 5900000,
    weight: '2 g (el par)',
    stones: '2 diamantes de laboratorio VS · 1 ct en total',
    description: 'Un diamante redondo de medio quilate por oreja, en canasta de cuatro garras y cierre de rosca.',
    sizes: ['0,5 ct cada uno', '1 ct cada uno (+ $4.200.000)'],
  },
  {
    id: 'argollas-cubanas',
    name: 'Argollas Cubanas',
    category: 'aretes',
    price: 7300000,
    weight: '9 g (el par)',
    description: 'Argollas de 2 cm hechas con eslabón cubano. Cierre de bisagra invisible.',
    sizes: ['2 cm', '3 cm (+ $1.900.000)'],
  },
];

const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
export const formatPrice = (n: number) => cop.format(n).replace(/\s/g, ' ');

/** Precio extra que trae escrito una opción ("+ $1.900.000"). */
export function sizeSurcharge(size = ''): number {
  const m = size.match(/\+\s*\$\s*([\d.]+)/);
  return m ? Number(m[1].replace(/\./g, '')) : 0;
}

export const productById = (id: string) => products.find((p) => p.id === id);

const slug = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-');

/** Foto de la pieza en la opción elegida (p. ej. el color del hilo), si existe; si no, la del catálogo. */
export const optionImage = (id: string, option?: string) =>
  (option && images[`../assets/products/${id}--${slug(option)}.webp`]) || catalogImage(id);

// Fotos generadas con `npm run render:products` (ver render/).
const images = import.meta.glob<string>('../assets/products/*.webp', { eager: true, query: '?url', import: 'default' });
export const productImage = (id: string) => images[`../assets/products/${id}.webp`];

// Fotos reales: reemplazan la foto 3D en el catálogo, la ficha y la bolsa.
// (Crea tu estilo sigue usando las 3D, que llevan el dije dibujado encima.)
const photos = import.meta.glob<string>('../assets/photos/*.webp', { eager: true, query: '?url', import: 'default' });
export const productPhoto = (id: string): string | undefined => photos[`../assets/photos/${id}.webp`];

/** Imagen de una pieza del catálogo: la foto real si existe, si no la 3D. */
export const catalogImage = (id: string) => productPhoto(id) ?? productImage(id);
