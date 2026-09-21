'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Check, CreditCard, RotateCcw, ShieldCheck, ShoppingBag, Star, Truck } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { ConditionBadge } from '@/components/ui/ConditionBadge';
import { Price } from '@/components/ui/Price';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { checkoutConfig, enabledPaymentMethods } from '@/config/checkout';
import { store } from '@/data/store';
import { discountPercent, isOffer } from '@/lib/catalog';
import { brl } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { Product } from '@/lib/types';

function Rating({ product }: { product: Product }) {
  const reviews = product.reviews ?? [];
  if (reviews.length === 0) {
    return (
      <p className="flex items-center gap-2 text-sm text-white/50">
        <Star className="size-4" aria-hidden />
        Seja o primeiro a avaliar
      </p>
    );
  }
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return (
    <a href="#avaliacoes" className="flex items-center gap-2 text-sm text-white/70 hover:text-white">
      <span className="flex" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={cn('size-4', n <= Math.round(avg) ? 'fill-accent text-accent' : 'text-white/25')} />
        ))}
      </span>
      {avg.toFixed(1)} · {reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}
    </a>
  );
}

export function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem, setQuantity } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const max = checkoutConfig.maxQuantityPerOrder;
  const warranty = store.warranty[product.condition];
  const { installments } = checkoutConfig;

  // Barra fixa de compra no celular: aparece quando os botões principais saem da tela
  useEffect(() => {
    const el = actionsRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(t);
  }, [added]);

  const handleAdd = () => {
    addItem(product.slug, qty);
    setAdded(true);
  };
  const handleBuyNow = () => {
    setQuantity(product.slug, qty);
    router.push('/checkout');
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <ConditionBadge condition={product.condition} className="!text-xs" />
          <span className={cn('flex items-center gap-2 text-sm', product.available ? 'text-white/70' : 'text-white/50')}>
            <span className={cn('size-2 rounded-full', product.available ? 'bg-accent shadow-[0_0_10px_rgb(var(--accent))]' : 'bg-white/35')} aria-hidden />
            {product.available ? 'Disponível' : 'Indisponível no momento'}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {product.name}
          {product.variant && <span className="mt-1 block text-xl font-medium text-white/65 sm:text-2xl">{product.variant}</span>}
        </h1>
        <div className="mt-3">
          <Rating product={product} />
        </div>
      </div>

      <div>
        <Price product={product} size="lg" />
        {isOffer(product) && <p className="mt-1 text-sm font-medium text-accent">Você economiza {discountPercent(product)}%</p>}
        {installments.enabled && (
          <p className="mt-2 text-sm text-white/65">
            {installments.interestFree
              ? `ou ${installments.max}x de ${brl(product.price / installments.max)} sem juros no cartão`
              : `ou em até ${installments.max}x no cartão`}
          </p>
        )}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        <li className="card flex items-start gap-3 p-4">
          <CreditCard className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
          <div>
            <p className="text-sm font-semibold">Pagamento</p>
            <p className="text-sm text-white/60">{enabledPaymentMethods().map((m) => m.label).join(', ')}</p>
          </div>
        </li>
        <li className="card flex items-start gap-3 p-4">
          <Truck className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
          <div>
            <p className="text-sm font-semibold">{store.shipping.headline}</p>
            <p className="text-sm text-white/60">{store.shipping.detail}</p>
          </div>
        </li>
      </ul>

      <div ref={actionsRef} className="space-y-3">
        {product.available ? (
          <>
            <div className="flex items-center gap-4">
              <QuantityStepper value={qty} onChange={setQty} max={max} />
              <span className="text-sm text-white/50">Máx. {max} por pedido</span>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className={cn('btn btn-outline w-full', added && '!border-accent !text-accent')}
              aria-live="polite"
            >
              {added ? <Check className="size-5" aria-hidden /> : <ShoppingBag className="size-5" aria-hidden />}
              {added ? 'Adicionado ao carrinho' : 'Adicionar ao carrinho'}
            </button>
            <button type="button" onClick={handleBuyNow} className="btn btn-primary h-14 w-full text-base">
              Comprar agora
            </button>
          </>
        ) : (
          <>
            <p className="rounded-control border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
              Este produto está indisponível no momento e não pode ser adicionado ao carrinho.
            </p>
            <button type="button" disabled className="btn btn-muted h-14 w-full text-base">
              Produto indisponível
            </button>
            <Link href="/#produtos" className="btn btn-outline w-full">
              Ver produtos disponíveis
            </Link>
          </>
        )}
      </div>

      <ul className="space-y-2.5 border-t border-white/10 pt-5 text-sm text-white/65">
        <li className="flex items-center gap-2.5">
          <ShieldCheck className="size-4 shrink-0 text-accent" aria-hidden /> Compra segura
        </li>
        <li className="flex items-center gap-2.5">
          <RotateCcw className="size-4 shrink-0 text-accent" aria-hidden /> 7 dias para desistir da compra após o recebimento
        </li>
        {warranty && (
          <li className="flex items-center gap-2.5">
            <Check className="size-4 shrink-0 text-accent" aria-hidden /> Garantia: {warranty}
          </li>
        )}
      </ul>

      {/* Barra de compra fixa (celular) */}
      {product.available && (
        <div
          className={cn(
            'fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/90 px-4 py-3 backdrop-blur-xl transition-transform duration-300 lg:hidden',
            showBar ? 'translate-y-0' : 'translate-y-full',
          )}
          aria-hidden={!showBar}
        >
          <div className="mx-auto flex max-w-lg items-center gap-4">
            <div className="min-w-0">
              <p className="truncate text-xs text-white/55">{product.name}</p>
              <p className="font-display text-xl font-bold leading-tight">{brl(product.price)}</p>
            </div>
            <button type="button" onClick={handleBuyNow} tabIndex={showBar ? 0 : -1} className="btn btn-primary ml-auto h-12 flex-1">
              Comprar agora
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
