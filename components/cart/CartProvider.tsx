'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { buildOrder, clampQuantity, type Order } from '@/lib/order';
import type { CartItem } from '@/lib/types';

const STORAGE_KEY = 'gamemania:cart:v1';

interface CartContextValue {
  items: CartItem[];
  order: Order;
  count: number;
  hydrated: boolean;
  isOpen: boolean;
  /** Muda a cada item adicionado — usado para animar o ícone do carrinho. */
  bumpKey: number;
  addItem: (slug: string, quantity?: number, options?: { openDrawer?: boolean }) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Remove itens que não existem mais ou estão indisponíveis e corrige quantidades. */
function sanitize(items: CartItem[]): CartItem[] {
  const valid = buildOrder(items).lines;
  return valid.map((l) => ({ slug: l.product.slug, quantity: l.quantity }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [bumpKey, setBumpKey] = useState(0);

  // Carrega o carrinho salvo no navegador
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(sanitize(JSON.parse(raw)));
    } catch {
      /* armazenamento indisponível: segue com carrinho vazio */
    }
    setHydrated(true);
  }, []);

  // Salva a cada mudança
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignora */
    }
  }, [items, hydrated]);

  const addItem = useCallback<CartContextValue['addItem']>((slug, quantity = 1, options) => {
    setItems((current) => {
      const existing = current.find((i) => i.slug === slug);
      if (existing) {
        return sanitize(current.map((i) => (i.slug === slug ? { ...i, quantity: clampQuantity(i.quantity + quantity) } : i)));
      }
      return sanitize([...current, { slug, quantity: clampQuantity(quantity) }]);
    });
    setBumpKey((k) => k + 1);
    if (options?.openDrawer !== false) setIsOpen(true);
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setItems((current) => {
      if (!current.some((i) => i.slug === slug)) return sanitize([...current, { slug, quantity: clampQuantity(quantity) }]);
      return sanitize(current.map((i) => (i.slug === slug ? { ...i, quantity: clampQuantity(quantity) } : i)));
    });
  }, []);

  const removeItem = useCallback((slug: string) => setItems((c) => c.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const order = useMemo(() => buildOrder(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({ items, order, count: order.count, hydrated, isOpen, bumpKey, addItem, setQuantity, removeItem, clear, open, close }),
    [items, order, hydrated, isOpen, bumpKey, addItem, setQuantity, removeItem, clear, open, close],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart precisa estar dentro de <CartProvider>');
  return ctx;
}
