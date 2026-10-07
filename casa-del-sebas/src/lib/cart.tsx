import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { productById, productImage, sizeSurcharge } from '@/data/products';

/** Pieza armada en el configurador: no está en el catálogo, trae su propio precio. */
export interface CustomPiece {
  title: string;
  detail: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: string;
  size: string;
  engraving: string;
  qty: number;
  custom?: CustomPiece;
}

type Line = Omit<CartItem, 'qty'>;

const KEY = 'casa-del-sebas-bolsa-v1';
const MAX_QTY = 5;
const sameLine = (a: Line, b: Line) => a.id === b.id && a.size === b.size && a.engraving === b.engraving;

function read(): CartItem[] {
  try {
    const items = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(items) ? items.filter((i) => i.custom || productById(i.id)) : [];
  } catch {
    return [];
  }
}

export const unitPrice = (item: Pick<CartItem, 'id' | 'size' | 'custom'>) =>
  item.custom ? item.custom.price : (productById(item.id)?.price ?? 0) + sizeSurcharge(item.size);

/** Nombre, detalle e imagen de una línea, sea del catálogo o personalizada. */
export function lineInfo(item: CartItem) {
  if (item.custom) return { name: item.custom.title, detail: item.custom.detail, image: productImage(item.custom.image) };
  const p = productById(item.id)!;
  return {
    name: p.name,
    detail: [item.size, item.engraving && `Grabado «${item.engraving}»`].filter(Boolean).join(' · '),
    image: productImage(p.id),
  };
}

interface CartValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (line: Line) => void;
  setQty: (line: CartItem, qty: number) => void;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(read);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* modo privado: la bolsa funciona igual durante la visita */
    }
  }, [items]);

  const add = useCallback((line: Line) => {
    setItems((prev) =>
      prev.some((i) => sameLine(i, line))
        ? prev.map((i) => (sameLine(i, line) ? { ...i, qty: Math.min(MAX_QTY, i.qty + 1) } : i))
        : [...prev, { ...line, qty: 1 }],
    );
  }, []);

  const setQty = useCallback((line: CartItem, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => !sameLine(i, line)) : prev.map((i) => (sameLine(i, line) ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)),
    );
  }, []);

  const value = useMemo<CartValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + unitPrice(i) * i.qty, 0),
      open,
      setOpen,
      add,
      setQty,
    }),
    [items, open, add, setQty],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
