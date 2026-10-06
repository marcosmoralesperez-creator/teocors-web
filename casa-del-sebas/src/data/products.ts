// Catálogo de Casa del Sebas. Todo es oro de 18 quilates (750 milésimas).
// Precios en pesos colombianos. `sizes`: largos o tallas que se pueden pedir.

export type CategoryId = 'cadenas' | 'pulseras' | 'dijes' | 'anillos' | 'aretes';

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
}

export const categories: { id: CategoryId; name: string }[] = [
  { id: 'cadenas', name: 'Cadenas' },
  { id: 'pulseras', name: 'Pulseras' },
  { id: 'dijes', name: 'Dijes' },
  { id: 'anillos', name: 'Anillos' },
  { id: 'aretes', name: 'Aretes' },
];

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
    name: 'Pulsera Cubana Iced',
    category: 'pulseras',
    price: 28900000,
    badge: 'Más pedida',
    weight: '58 g',
    stones: '298 diamantes de laboratorio VS · 4,2 ct',
    description: 'La misma cubana iced de la casa, en pulsera de 12 mm. Pesa en la muñeca como debe pesar.',
    sizes: ['19 cm', '20 cm', '21 cm', '22 cm'],
  },
  {
    id: 'pulsera-cubana',
    name: 'Pulsera Cubana 12 mm',
    category: 'pulseras',
    price: 15600000,
    weight: '42 g',
    description: 'Oro macizo pulido a espejo. Para llevar sola o junto a la cubana iced.',
    sizes: ['19 cm', '20 cm', '21 cm', '22 cm'],
  },
  {
    id: 'pulsera-tenis',
    name: 'Pulsera Tenis 4 mm',
    category: 'pulseras',
    price: 16800000,
    weight: '11 g',
    stones: '48 diamantes de laboratorio VS · 4,8 ct',
    description: 'Clásica, fina y sin fallas. Broche oculto con lengüeta y seguro lateral.',
    sizes: ['17 cm', '18 cm', '19 cm'],
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

// Fotos generadas con `npm run render:products` (ver render/).
const images = import.meta.glob<string>('../assets/products/*.webp', { eager: true, query: '?url', import: 'default' });
export const productImage = (id: string) => images[`../assets/products/${id}.webp`];
