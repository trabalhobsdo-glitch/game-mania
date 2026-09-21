'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { checkoutConfig } from '@/config/checkout';
import { displayName } from '@/lib/catalog';
import { brl } from '@/lib/format';

export function CartSummary({ cta }: { cta?: boolean }) {
  const { order } = useCart();
  const { shipping } = order;
  return (
    <div className="card space-y-4 p-5 sm:p-6">
      <h2 className="text-lg font-bold">Resumo</h2>
      <dl className="space-y-2.5 text-sm">
        <div className="flex justify-between text-white/70">
          <dt>Subtotal ({order.count} {order.count === 1 ? 'item' : 'itens'})</dt>
          <dd>{brl(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between text-white/70">
          <dt>Frete</dt>
          <dd>{shipping.amount === null ? shipping.label : shipping.amount === 0 ? 'Grátis' : brl(shipping.amount)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
          <dt className="font-display text-base font-semibold">Total</dt>
          <dd className="font-display text-3xl font-bold">{brl(order.total)}</dd>
        </div>
      </dl>
      {shipping.estimate && shipping.days && (
        <p className="text-xs leading-relaxed text-white/40">
          Frete estimado ({shipping.label} · {shipping.days}). Escolha PAC ou SEDEX no checkout.
        </p>
      )}
      {shipping.amount === null && <p className="text-xs leading-relaxed text-white/50">{checkoutConfig.messages.shippingArrange}</p>}
      {cta && (
        <>
          <Link href="/checkout" className="btn btn-primary h-14 w-full text-base">
            Ir para o checkout
          </Link>
          <Link href="/#produtos" className="block text-center text-sm text-white/60 transition hover:text-accent">
            Continuar comprando
          </Link>
        </>
      )}
    </div>
  );
}

export function CartView() {
  const { order, hydrated, setQuantity, removeItem } = useCart();

  return (
    <div className="container-x pb-8 pt-8 lg:pt-12">
      <h1 className="mb-8 text-3xl font-bold uppercase tracking-tight sm:text-4xl">Carrinho</h1>

      {!hydrated ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]" aria-busy="true" aria-label="Carregando carrinho">
          <div className="space-y-4">
            {[0, 1].map((i) => (
              <div key={i} className="skeleton h-36 rounded-card" />
            ))}
          </div>
          <div className="skeleton h-64 rounded-card" />
        </div>
      ) : order.lines.length === 0 ? (
        <div className="card mx-auto flex max-w-xl flex-col items-center gap-5 px-6 py-16 text-center">
          <span className="grid size-20 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
            <ShoppingBag className="size-9 text-accent" aria-hidden />
          </span>
          <div>
            <p className="font-display text-2xl font-bold">Seu carrinho está vazio</p>
            <p className="mt-2 text-white/60">Escolha um produto para começar a montar seu pedido.</p>
          </div>
          <Link href="/#produtos" className="btn btn-primary">
            Ver produtos
          </Link>
        </div>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          <ul className="space-y-4">
            {order.lines.map(({ product, quantity, total }) => (
              <li key={product.slug} className="card flex gap-4 p-4 sm:gap-6 sm:p-5">
                <Link href={`/produto/${product.slug}`} className="relative block h-32 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 sm:h-40 sm:w-32">
                  <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="128px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/produto/${product.slug}`} className="font-display text-lg font-semibold leading-snug hover:text-accent">
                        {displayName(product)}
                      </Link>
                      <p className="mt-1 text-sm text-white/50">
                        {product.condition === 'novo' ? 'Novo' : 'Usado'} · {brl(product.price)} cada
                      </p>
                    </div>
                    <button onClick={() => removeItem(product.slug)} className="grid size-10 shrink-0 place-items-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-red-300" aria-label={`Remover ${product.name} do carrinho`}>
                      <Trash2 className="size-[1.1rem]" />
                    </button>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                    <QuantityStepper value={quantity} max={checkoutConfig.maxQuantityPerOrder} onChange={(q) => setQuantity(product.slug, q)} label={`Quantidade de ${product.name}`} />
                    <p className="font-display text-xl font-bold">{brl(total)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            <CartSummary cta />
          </div>
        </div>
      )}
    </div>
  );
}
