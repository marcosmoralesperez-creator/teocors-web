// Cadenas de "Crea tu estilo": tipos, grosores, largos, dijes y precios.
// Los precios de cada grosor son para 55 cm; otro largo se cobra en proporción.

export type ChainType = 'cubana' | 'franco' | 'soga' | 'tenis';
export type PendantType = 'ninguno' | 'nombre' | 'placa' | 'inicial';

interface Width {
  mm: number;
  price: number;
  grams: number;
}

export const chainTypes: Record<ChainType, { name: string; image: string; icedImage?: string; note: string; widths: Width[]; canIce: boolean }> = {
  cubana: {
    name: 'Cubana',
    image: 'cubana-14',
    icedImage: 'cubana-iced-14',
    note: 'Eslabones planos que se entrelazan. La más pesada.',
    canIce: true,
    widths: [
      { mm: 6, price: 7900000, grams: 22 },
      { mm: 8, price: 12900000, grams: 36 },
      { mm: 10, price: 18500000, grams: 52 },
      { mm: 12, price: 24800000, grams: 68 },
      { mm: 14, price: 33000000, grams: 90 },
    ],
  },
  franco: {
    name: 'Franco',
    image: 'franco-4',
    note: 'Tejido firme de cuatro lados. Ideal para dijes.',
    canIce: false,
    widths: [
      { mm: 2, price: 4200000, grams: 11 },
      { mm: 3, price: 6600000, grams: 17 },
      { mm: 4, price: 9800000, grams: 26 },
    ],
  },
  soga: {
    name: 'Soga',
    image: 'soga-5',
    note: 'Hilos trenzados en espiral que atrapan la luz.',
    canIce: false,
    widths: [
      { mm: 3, price: 6400000, grams: 16 },
      { mm: 4, price: 9100000, grams: 23 },
      { mm: 5, price: 12400000, grams: 31 },
    ],
  },
  tenis: {
    name: 'Tenis',
    image: 'tenis-5',
    note: 'Una fila continua de diamantes en garras.',
    canIce: false,
    widths: [
      { mm: 3, price: 14500000, grams: 12 },
      { mm: 4, price: 21000000, grams: 18 },
      { mm: 5, price: 31000000, grams: 24 },
    ],
  },
};

export const lengths = [45, 50, 55, 60, 65];

/** Recargo por engastar la cadena completa (solo cubana). */
export const ICED_FACTOR = 0.6;

export const pendants: Record<PendantType, { name: string; price: number; icedPrice: number; maxLength: number; hint: string }> = {
  ninguno: { name: 'Sin dije', price: 0, icedPrice: 0, maxLength: 0, hint: '' },
  nombre: { name: 'Nombre', price: 4900000, icedPrice: 3500000, maxLength: 10, hint: 'Hasta 10 letras' },
  placa: { name: 'Placa grabada', price: 6200000, icedPrice: 7000000, maxLength: 14, hint: 'Hasta 14 caracteres, grabados al reverso de la placa' },
  inicial: { name: 'Inicial', price: 3900000, icedPrice: 2800000, maxLength: 1, hint: 'Una letra' },
};

export interface ChainConfig {
  type: ChainType;
  mm: number;
  length: number;
  iced: boolean;
  pendant: PendantType;
  text: string;
  pendantIced: boolean;
}

export const defaultConfig: ChainConfig = {
  type: 'cubana',
  mm: 10,
  length: 55,
  iced: false,
  pendant: 'nombre',
  text: 'Sebas',
  pendantIced: true,
};

/** Combinaciones listas para empezar. */
export const presets: { id: string; name: string; text: string; config: ChainConfig }[] = [
  {
    id: 'nombre',
    name: 'Cadena con nombre',
    text: 'Tu nombre en oro, colgando de una franco.',
    config: { type: 'franco', mm: 3, length: 55, iced: false, pendant: 'nombre', text: 'Sebas', pendantIced: true },
  },
  {
    id: 'placa',
    name: 'Placa grabada',
    text: 'Una placa pulida con la fecha o el nombre que importa.',
    config: { type: 'franco', mm: 4, length: 60, iced: false, pendant: 'placa', text: '07·10·2026', pendantIced: false },
  },
  {
    id: 'inicial',
    name: 'Inicial iced',
    text: 'Tu letra con diamantes, en soga de 3 mm.',
    config: { type: 'soga', mm: 3, length: 50, iced: false, pendant: 'inicial', text: 'S', pendantIced: true },
  },
  {
    id: 'cubana',
    name: 'Cubana a tu medida',
    text: 'Elige grosor, largo y si va con diamantes.',
    config: { type: 'cubana', mm: 12, length: 60, iced: true, pendant: 'ninguno', text: '', pendantIced: false },
  },
];

const round = (n: number) => Math.round(n / 10000) * 10000;

export function widthOf(c: ChainConfig) {
  const t = chainTypes[c.type];
  return t.widths.find((w) => w.mm === c.mm) ?? t.widths[0];
}

export function priceOf(c: ChainConfig) {
  const w = widthOf(c);
  let chain = w.price * (c.length / 55);
  if (c.iced && chainTypes[c.type].canIce) chain *= 1 + ICED_FACTOR;
  const p = pendants[c.pendant];
  const pendant = c.pendant === 'ninguno' ? 0 : p.price + (c.pendantIced ? p.icedPrice : 0);
  return { chain: round(chain), pendant, total: round(chain) + pendant, grams: Math.round(w.grams * (c.length / 55)) };
}

export function describe(c: ChainConfig) {
  const t = chainTypes[c.type];
  const parts = [`${t.name} ${widthOf(c).mm} mm`, `${c.length} cm`];
  if (c.iced && t.canIce) parts.push('iced');
  if (c.pendant !== 'ninguno') {
    parts.push(`dije ${pendants[c.pendant].name.toLowerCase()}${c.text ? ` «${c.text}»` : ''}${c.pendantIced ? ' iced' : ''}`);
  }
  return parts.join(' · ');
}

export const imageOf = (c: ChainConfig) => {
  const t = chainTypes[c.type];
  return c.iced && t.icedImage ? t.icedImage : t.image;
};
