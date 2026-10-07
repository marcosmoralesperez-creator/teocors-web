// "Crea tu estilo": opciones y precios de pulsos, manillas, aretes y anillos.
// Las cadenas viven en custom-chain.ts. Todos los precios son en pesos colombianos.
import { defaultConfig as defaultChain, type ChainConfig } from '@/data/custom-chain';

export type Kind = 'cadena' | 'pulso' | 'manilla' | 'aretes' | 'anillo';

export const kinds: { id: Kind; name: string; image: string }[] = [
  { id: 'cadena', name: 'Cadena', image: 'cubana-iced-14' },
  { id: 'pulso', name: 'Pulso', image: 'pulso-esclava' },
  { id: 'manilla', name: 'Manilla tejida', image: 'manilla-placa' },
  { id: 'aretes', name: 'Aretes', image: 'topos-solitario' },
  { id: 'anillo', name: 'Anillo', image: 'anillo-sello' },
];

const round = (n: number) => Math.round(n / 10000) * 10000;

/* ---------------------------------------------------------------- pulsos */

export type PulsoType = 'cubano' | 'esclava' | 'soga' | 'tenis' | 'rigido';

interface Width {
  mm: number;
  price: number;
  grams: number;
}

export const pulsoTypes: Record<PulsoType, { name: string; image: string; icedImage?: string; note: string; canIce: boolean; engraving: boolean; widths: Width[] }> = {
  cubano: {
    name: 'Cubano',
    image: 'pulsera-cubana',
    icedImage: 'pulsera-cubana-iced',
    note: 'Eslabones planos y pesados. Se puede llevar iced.',
    canIce: true,
    engraving: false,
    widths: [
      { mm: 6, price: 3900000, grams: 14 },
      { mm: 8, price: 6200000, grams: 20 },
      { mm: 10, price: 8900000, grams: 28 },
      { mm: 12, price: 15600000, grams: 42 },
    ],
  },
  esclava: {
    name: 'Esclava',
    image: 'pulso-esclava',
    note: 'Cubano con placa al centro. El grabado va incluido.',
    canIce: false,
    engraving: true,
    widths: [
      { mm: 4, price: 7200000, grams: 18 },
      { mm: 6, price: 9800000, grams: 24 },
      { mm: 8, price: 13500000, grams: 32 },
    ],
  },
  soga: {
    name: 'Soga',
    image: 'pulso-soga',
    note: 'Hilos de oro trenzados en espiral.',
    canIce: false,
    engraving: false,
    widths: [
      { mm: 3, price: 4300000, grams: 11 },
      { mm: 4, price: 5900000, grams: 15 },
      { mm: 5, price: 7600000, grams: 19 },
    ],
  },
  tenis: {
    name: 'Tenis',
    image: 'pulsera-tenis',
    note: 'Una fila de diamantes de laboratorio VS en garras.',
    canIce: false,
    engraving: false,
    widths: [
      { mm: 3, price: 9800000, grams: 8 },
      { mm: 4, price: 16800000, grams: 11 },
      { mm: 5, price: 23500000, grams: 15 },
    ],
  },
  rigido: {
    name: 'Rígido',
    image: 'pulso-rigido',
    note: 'Aro macizo con bisagra y cierre invisible.',
    canIce: false,
    engraving: false,
    widths: [
      { mm: 3, price: 8400000, grams: 19 },
      { mm: 4, price: 11200000, grams: 26 },
      { mm: 5, price: 14300000, grams: 33 },
    ],
  },
};

/** Largo de muñeca; los precios de grosor son para 19 cm. */
export const pulsoSizes = [17, 18, 19, 20, 21, 22];

export interface PulsoConfig {
  type: PulsoType;
  mm: number;
  size: number;
  iced: boolean;
  text: string;
}

export const ICED_FACTOR = 0.6;

export function pulsoWidth(c: PulsoConfig) {
  const t = pulsoTypes[c.type];
  return t.widths.find((w) => w.mm === c.mm) ?? t.widths[0];
}

export function pulsoPrice(c: PulsoConfig) {
  const t = pulsoTypes[c.type];
  const w = pulsoWidth(c);
  let price = w.price * (c.size / 19);
  if (c.iced && t.canIce) price *= 1 + ICED_FACTOR;
  return { total: round(price), grams: Math.round(w.grams * (c.size / 19)) };
}

/* ---------------------------------------------------------------- manillas */

export type ManillaPiece = 'balines' | 'placa' | 'cruz' | 'inicial';

export const manillaPieces: Record<ManillaPiece, { name: string; product: string; price: number; grams: string; weave: string; text?: { label: string; max: number; hint: string } }> = {
  balines: { name: 'Balines de oro', product: 'manilla-balines', price: 1450000, grams: '2,1 g', weave: 'Cordón trenzado' },
  placa: {
    name: 'Placa grabada',
    product: 'manilla-placa',
    price: 1950000,
    grams: '2,6 g',
    weave: 'Macramé',
    text: { label: 'Texto de la placa', max: 14, hint: 'Hasta 14 caracteres' },
  },
  cruz: { name: 'Cruz', product: 'manilla-cruz', price: 1380000, grams: '1,8 g', weave: 'Cordón trenzado' },
  inicial: {
    name: 'Inicial',
    product: 'manilla-inicial',
    price: 1690000,
    grams: '2 g',
    weave: 'Macramé',
    text: { label: 'Letra', max: 1, hint: 'Una letra' },
  },
};

/** Mismos colores que las manillas del catálogo (products.ts). */
export const threads: { name: string; slug: string; color: string }[] = [
  { name: 'Negro', slug: 'negro', color: '#0b0b0b' },
  { name: 'Café', slug: 'cafe', color: '#4a2c19' },
  { name: 'Rojo', slug: 'rojo', color: '#7a1010' },
  { name: 'Azul noche', slug: 'azul-noche', color: '#121c33' },
  { name: 'Verde oliva', slug: 'verde-oliva', color: '#3d4426' },
  { name: 'Beige', slug: 'beige', color: '#b39a72' },
];

/** Un segundo hilo tejido junto al primero. */
export const DOUBLE_WRAP = 350000;

export interface ManillaConfig {
  piece: ManillaPiece;
  thread: string;
  double: boolean;
  text: string;
}

export const manillaPrice = (c: ManillaConfig) => manillaPieces[c.piece].price + (c.double ? DOUBLE_WRAP : 0);

/* ---------------------------------------------------------------- aretes */

export type AretesStyle = 'topos' | 'argollas';

export const aretesStyles: Record<AretesStyle, { name: string; image: string; sizeLabel: string; note: string; sizes: { name: string; price: number }[] }> = {
  topos: {
    name: 'Topos de diamante',
    image: 'topos-solitario',
    sizeLabel: 'Diamante por arete',
    note: 'Diamante redondo de laboratorio VS en canasta de cuatro garras, cierre de rosca.',
    sizes: [
      { name: '0,25 ct', price: 3400000 },
      { name: '0,5 ct', price: 5900000 },
      { name: '1 ct', price: 10100000 },
    ],
  },
  argollas: {
    name: 'Argollas cubanas',
    image: 'argollas-cubanas',
    sizeLabel: 'Diámetro',
    note: 'Eslabón cubano cerrado en argolla, con bisagra invisible.',
    sizes: [
      { name: '1,5 cm', price: 5600000 },
      { name: '2 cm', price: 7300000 },
      { name: '3 cm', price: 9200000 },
    ],
  },
};

/** Precio de un solo arete frente al par. */
export const SINGLE_FACTOR = 0.55;

export interface AretesConfig {
  style: AretesStyle;
  size: string;
  single: boolean;
}

export function aretesPrice(c: AretesConfig) {
  const s = aretesStyles[c.style];
  const pair = (s.sizes.find((x) => x.name === c.size) ?? s.sizes[0]).price;
  return round(c.single ? pair * SINGLE_FACTOR : pair);
}

/* ---------------------------------------------------------------- anillos */

export type AnilloStyle = 'sello' | 'cubano';

export const anilloStyles: Record<AnilloStyle, { name: string; image: string; price: number; grams: string; note: string; text?: { label: string; max: number; hint: string } }> = {
  sello: {
    name: 'Sello',
    image: 'anillo-sello',
    price: 8400000,
    grams: '16 g',
    note: 'Cara ovalada satinada. Grabamos tus iniciales en relieve.',
    text: { label: 'Iniciales', max: 3, hint: 'Hasta 3 letras' },
  },
  cubano: {
    name: 'Cubano iced',
    image: 'anillo-cubano-iced',
    price: 11700000,
    grams: '12 g',
    note: 'Eslabones cubanos con pavé de diamantes de laboratorio VS.',
  },
};

export const anilloSizes = [6, 7, 8, 9, 10, 11, 12, 13];

export interface AnilloConfig {
  style: AnilloStyle;
  size: number;
  text: string;
}

/* ---------------------------------------------------------------- everything */

export interface StyleConfig {
  kind: Kind;
  cadena: ChainConfig;
  pulso: PulsoConfig;
  manilla: ManillaConfig;
  aretes: AretesConfig;
  anillo: AnilloConfig;
}

export const defaultStyle: StyleConfig = {
  kind: 'cadena',
  cadena: defaultChain,
  pulso: { type: 'esclava', mm: 6, size: 19, iced: false, text: 'Sebas' },
  manilla: { piece: 'placa', thread: 'Negro', double: false, text: 'Sofía' },
  aretes: { style: 'topos', size: '0,5 ct', single: false },
  anillo: { style: 'sello', size: 9, text: 'CDS' },
};

/** Combinaciones listas para empezar, de todas las piezas. */
export const stylePresets: { id: string; name: string; text: string; apply: (s: StyleConfig) => StyleConfig }[] = [
  {
    id: 'cadena-nombre',
    name: 'Cadena con nombre',
    text: 'Tu nombre en oro sobre una franco de 3 mm.',
    apply: (s) => ({ ...s, kind: 'cadena', cadena: { type: 'franco', mm: 3, length: 55, iced: false, pendant: 'nombre', text: 'Sebas', pendantIced: true } }),
  },
  {
    id: 'cubana-iced',
    name: 'Cubana a tu medida',
    text: 'Cubana iced de 12 mm, al largo que quieras.',
    apply: (s) => ({ ...s, kind: 'cadena', cadena: { type: 'cubana', mm: 12, length: 60, iced: true, pendant: 'ninguno', text: '', pendantIced: false } }),
  },
  {
    id: 'pulso-esclava',
    name: 'Pulso esclava grabado',
    text: 'Placa con un nombre o una fecha que importa.',
    apply: (s) => ({ ...s, kind: 'pulso', pulso: { type: 'esclava', mm: 6, size: 19, iced: false, text: '07·10·2026' } }),
  },
  {
    id: 'manilla-inicial',
    name: 'Manilla con tu inicial',
    text: 'Macramé tejido a mano en el color que elijas.',
    apply: (s) => ({ ...s, kind: 'manilla', manilla: { piece: 'inicial', thread: 'Azul noche', double: false, text: 'S' } }),
  },
  {
    id: 'arete-solo',
    name: 'Un solo topo',
    text: 'Un diamante de 0,5 ct para una sola oreja.',
    apply: (s) => ({ ...s, kind: 'aretes', aretes: { style: 'topos', size: '0,5 ct', single: true } }),
  },
  {
    id: 'sello',
    name: 'Sello con iniciales',
    text: 'El anillo de la casa con tus letras.',
    apply: (s) => ({ ...s, kind: 'anillo', anillo: { style: 'sello', size: 9, text: 'CDS' } }),
  },
];
