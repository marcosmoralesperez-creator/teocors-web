import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';

import { productById, sizes, type CategoryId, type Size } from '@/data/products';

const STORAGE_KEY = 'teocors-cart-v1';
export const MAX_QTY = 9;

export interface CartLine {
  id: string;
  size: Size;
  qty: number;
}

type CartAction = { type: 'add'; id: string; size: Size } | { type: 'setQty'; id: string; size: Size; qty: number };

function readCart(): CartLine[] {
  try {
    const items: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(items)) return [];
    return items
      .filter(
        (i): i is CartLine =>
          productById(i?.id) !== undefined && sizes.includes(i.size) && Number.isInteger(i.qty) && i.qty > 0,
      )
      .map((i) => ({ id: i.id, size: i.size, qty: Math.min(MAX_QTY, i.qty) }));
  } catch {
    return [];
  }
}

function cartReducer(items: CartLine[], action: CartAction): CartLine[] {
  const same = (i: CartLine) => i.id === action.id && i.size === action.size;
  if (action.type === 'add') {
    return items.some(same)
      ? items.map((i) => (same(i) ? { ...i, qty: Math.min(MAX_QTY, i.qty + 1) } : i))
      : [...items, { id: action.id, size: action.size, qty: 1 }];
  }
  if (action.qty <= 0) return items.filter((i) => !same(i));
  return items.map((i) => (same(i) ? { ...i, qty: Math.min(MAX_QTY, action.qty) } : i));
}

interface ShopContextValue {
  items: CartLine[];
  count: number;
  subtotal: number;
  /** Last line added, shown as a confirmation in the cart. */
  lastAdded: { id: string; size: Size } | null;
  addToCart(id: string, size: Size): void;
  setQty(id: string, size: Size, qty: number): void;

  cartOpen: boolean;
  setCartOpen(open: boolean): void;

  quickViewId: string | null;
  openQuickView(id: string): void;
  closeQuickView(): void;

  sizeGuideOpen: boolean;
  openSizeGuide(): void;
  closeSizeGuide(): void;

  filter: CategoryId;
  setFilter(id: CategoryId): void;

  /** Element that opened a dialog, so focus can go back to it on close. */
  returnFocus: React.RefObject<{ quickView: HTMLElement | null; sizeGuide: HTMLElement | null }>;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, readCart);
  const [lastAdded, setLastAdded] = useState<ShopContextValue['lastAdded']>(null);
  const [cartOpen, setCartOpenState] = useState(false);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [filter, setFilter] = useState<CategoryId>('all');
  const returnFocus = useRef({ quickView: null as HTMLElement | null, sizeGuide: null as HTMLElement | null });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* private mode: the cart still works for this visit */
    }
  }, [items]);

  const addToCart = useCallback((id: string, size: Size) => {
    dispatch({ type: 'add', id, size });
    setLastAdded({ id, size });
  }, []);

  const setQty = useCallback((id: string, size: Size, qty: number) => {
    dispatch({ type: 'setQty', id, size, qty });
    setLastAdded(null);
  }, []);

  const setCartOpen = useCallback((open: boolean) => {
    setCartOpenState(open);
    if (!open) setLastAdded(null);
  }, []);

  const openQuickView = useCallback((id: string) => {
    returnFocus.current.quickView = document.activeElement as HTMLElement | null;
    setQuickViewId(id);
  }, []);

  const openSizeGuide = useCallback(() => {
    returnFocus.current.sizeGuide = document.activeElement as HTMLElement | null;
    setSizeGuideOpen(true);
  }, []);

  const value = useMemo<ShopContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + (productById(i.id)?.price ?? 0) * i.qty, 0),
      lastAdded,
      addToCart,
      setQty,
      cartOpen,
      setCartOpen,
      quickViewId,
      openQuickView,
      closeQuickView: () => setQuickViewId(null),
      sizeGuideOpen,
      openSizeGuide,
      closeSizeGuide: () => setSizeGuideOpen(false),
      filter,
      setFilter,
      returnFocus,
    }),
    [items, lastAdded, addToCart, setQty, cartOpen, setCartOpen, quickViewId, openQuickView, sizeGuideOpen, openSizeGuide, filter],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>');
  return ctx;
}
