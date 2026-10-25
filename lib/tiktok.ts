/**
 * Eventos do TikTok Pixel.
 * O código base do pixel é carregado em components/analytics/TikTokPixel.tsx (layout.tsx).
 * Todas as funções abaixo são seguras: se o pixel não carregou (ex.: bloqueador de anúncios), não fazem nada.
 */
import { displayName } from '@/lib/catalog';
import type { Order } from '@/lib/order';
import type { Product } from '@/lib/types';

type TtqEventName = 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'CompletePayment';

interface TtqContent {
  content_id: string;
  content_type: 'product';
  content_name: string;
  quantity: number;
  price: number;
}

interface TtqParams {
  contents: TtqContent[];
  value: number;
  currency: 'BRL';
}

declare global {
  interface Window {
    ttq?: {
      page: () => void;
      track: (event: string, params?: Record<string, unknown>, options?: { event_id?: string }) => void;
    };
  }
}

function send(event: TtqEventName, params: TtqParams, eventId?: string) {
  try {
    if (typeof window === 'undefined' || !window.ttq) return;
    window.ttq.track(event, params as unknown as Record<string, unknown>, eventId ? { event_id: eventId } : undefined);
  } catch {
    /* o pixel nunca pode quebrar a loja */
  }
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

function productContent(product: Product, quantity: number): TtqContent {
  return { content_id: product.id, content_type: 'product', content_name: displayName(product), quantity, price: product.price };
}

export function pageView() {
  try {
    window.ttq?.page();
  } catch {
    /* ignora */
  }
}

export function trackViewContent(product: Product) {
  send('ViewContent', { contents: [productContent(product, 1)], value: round(product.price), currency: 'BRL' });
}

export function trackAddToCart(product: Product, quantity: number) {
  send('AddToCart', { contents: [productContent(product, quantity)], value: round(product.price * quantity), currency: 'BRL' });
}

export function trackInitiateCheckout(order: Order) {
  if (order.lines.length === 0) return;
  send('InitiateCheckout', {
    contents: order.lines.map((l) => productContent(l.product, l.quantity)),
    value: round(order.subtotal),
    currency: 'BRL',
  });
}

/** Compra concluída. Só dispara uma vez por transação (mesmo se a tela recarregar). */
export function trackCompletePayment(transactionId: number | string, order: Order, total?: number) {
  const key = `gamemania:tt-paid:${transactionId}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
  } catch {
    /* sem sessionStorage: segue mesmo assim */
  }
  send(
    'CompletePayment',
    {
      contents: order.lines.map((l) => productContent(l.product, l.quantity)),
      value: round(total ?? order.total),
      currency: 'BRL',
    },
    String(transactionId),
  );
}
