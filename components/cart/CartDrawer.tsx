'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { checkoutConfig } from '@/config/checkout';
import { displayName } from '@/lib/catalog';
import { brl } from '@/lib/format';
import { useEscape, useLockBody } from '@/lib/useLockBody';

/** Mini-carrinho lateral: abre ao adicionar um produto ou ao clicar no ícone do carrinho. */
export function CartDrawer() {
  const { isOpen, close, order, setQuantity, removeItem } = useCart();
  useLockBody(isOpen);
  useEscape(isOpen, close);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Carrinho de compras">
      <div className="absolute inset-0 animate-fade-in bg-black/75 backdrop-blur-sm" onClick={close} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[430px] animate-slide-right flex-col border-l border-white/10 bg-black shadow-soft">
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-bold uppercase tracking-wide">
            Seu carrinho
            {order.count > 0 && <span className="ml-2 text-sm font-medium normal-case text-white/50">({order.count})</span>}
          </h2>
          <button onClick={close} className="grid size-10 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="Fechar carrinho">
            <X className="size-5" />
          </button>
        </header>

        {order.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
              <ShoppingBag className="size-7 text-accent" aria-hidden />
            </span>
            <div>
              <p className="font-display text-lg font-semibold">Seu carrinho está vazio</p>
              <p className="mt-1 text-sm text-white/55">Escolha um produto para começar.</p>
            </div>
            <Link href="/#produtos" onClick={close} className="btn btn-primary mt-2">
              Ver produtos
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-white/10 overflow-y-auto px-5">
              {order.lines.map(({ product, quantity, total }) => (
                <li key={product.slug} className="flex gap-4 py-5">
                  <Link href={`/produto/${product.slug}`} onClick={close} className="relative block h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                    <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link href={`/produto/${product.slug}`} onClick={close} className="font-display text-[0.95rem] font-semibold leading-snug hover:text-accent">
                      {displayName(product)}
                    </Link>
                    <p className="mt-0.5 text-xs text-white/50">{product.condition === 'novo' ? 'Novo' : 'Usado'} · {brl(product.price)} cada</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QuantityStepper size="sm" value={quantity} max={checkoutConfig.maxQuantityPerOrder} onChange={(q) => setQuantity(product.slug, q)} label={`Quantidade de ${product.name}`} />
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold">{brl(total)}</span>
                        <button onClick={() => removeItem(product.slug)} className="grid size-8 place-items-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-red-300" aria-label={`Remover ${product.name}`}>
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="space-y-4 border-t border-white/10 bg-white/[0.02] px-5 py-5">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between text-white/65">
                  <dt>Subtotal</dt>
                  <dd>{brl(order.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-white/65">
                  <dt>Frete</dt>
                  <dd>{order.shipping.amount === null ? order.shipping.label : order.shipping.amount === 0 ? 'Grátis' : brl(order.shipping.amount)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
                  <dt className="font-display text-base font-semibold">Total</dt>
                  <dd className="font-display text-2xl font-bold">{brl(order.total)}</dd>
                </div>
              </dl>
              {order.shipping.estimate && order.shipping.days && (
                <p className="text-xs leading-relaxed text-white/40">
                  Frete estimado ({order.shipping.label} · {order.shipping.days}). Escolha PAC ou SEDEX no checkout.
                </p>
              )}
              <Link href="/checkout" onClick={close} className="btn btn-primary w-full">
                Ir para o checkout
              </Link>
              <Link href="/carrinho" onClick={close} className="btn btn-outline w-full">
                Ver carrinho
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
