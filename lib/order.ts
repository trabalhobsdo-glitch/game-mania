import { products } from '@/data/products';
import { checkoutConfig } from '@/config/checkout';
import { getShipping, type ShippingQuote } from '@/lib/shipping';
import type { CartItem, Product } from '@/lib/types';

export interface OrderLine {
  product: Product;
  quantity: number;
  total: number;
}

export interface Order {
  lines: OrderLine[];
  count: number;
  subtotal: number;
  shipping: ShippingQuote;
  total: number;
}

const bySlug = new Map(products.map((p) => [p.slug, p]));

export function clampQuantity(q: number) {
  return Math.min(Math.max(Math.floor(q) || 1, 1), checkoutConfig.maxQuantityPerOrder);
}

/** Monta o pedido a partir dos itens. Ignora produtos inexistentes ou indisponíveis. */
export function buildOrder(items: CartItem[], state?: string, shippingMethodId?: string): Order {
  const lines: OrderLine[] = [];
  for (const item of items) {
    const product = bySlug.get(item.slug);
    if (!product || !product.available) continue;
    const quantity = clampQuantity(item.quantity);
    lines.push({ product, quantity, total: Math.round(product.price * quantity * 100) / 100 });
  }
  const subtotal = Math.round(lines.reduce((s, l) => s + l.total, 0) * 100) / 100;
  const shipping = getShipping(subtotal, state, shippingMethodId);
  return {
    lines,
    count: lines.reduce((s, l) => s + l.quantity, 0),
    subtotal,
    shipping,
    total: Math.round((subtotal + (shipping.amount ?? 0)) * 100) / 100,
  };
}

/** Validação usada no servidor: nunca confie em preços vindos do navegador. */
export function validateItems(raw: unknown): { ok: true; items: CartItem[] } | { ok: false; error: string } {
  if (!Array.isArray(raw) || raw.length === 0) return { ok: false, error: 'Carrinho vazio.' };
  const items: CartItem[] = [];
  for (const entry of raw) {
    const slug = typeof entry?.slug === 'string' ? entry.slug : '';
    const quantity = Number(entry?.quantity);
    const product = bySlug.get(slug);
    if (!product) return { ok: false, error: 'Produto não encontrado.' };
    if (!product.available) return { ok: false, error: `${product.name} está indisponível.` };
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > checkoutConfig.maxQuantityPerOrder) {
      return { ok: false, error: 'Quantidade inválida.' };
    }
    items.push({ slug, quantity });
  }
  return { ok: true, items };
}
