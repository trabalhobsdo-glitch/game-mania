import type { ReactNode } from 'react';
import { Check, PackageOpen, Star, TriangleAlert } from 'lucide-react';
import { Accordion } from '@/components/ui/Accordion';
import { store } from '@/data/store';
import { productFaq } from '@/data/faq';
import { cn } from '@/lib/cn';
import type { Product } from '@/lib/types';

function Block({ id, title, children, className }: { id?: string; title: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={className} aria-labelledby={`${id ?? title}-title`}>
      <h2 id={`${id ?? title}-title`} className="mb-4 text-2xl font-bold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ProductDetails({ product }: { product: Product }) {
  const warranty = store.warranty[product.condition];
  const info = [
    product.condition === 'novo' ? 'Produto novo.' : 'Produto usado: confira as fotos e o estado descrito acima.',
    `${store.shipping.headline}. ${store.shipping.detail}`,
    'Você pode desistir da compra em até 7 dias após o recebimento (Código de Defesa do Consumidor).',
    ...(warranty ? [`Garantia: ${warranty}`] : []),
    ...(product.importantInfo ?? []),
  ];

  return (
    <div className="mt-16 space-y-14 lg:mt-24">
      <Block title="Descrição" id="descricao">
        <div className="max-w-3xl space-y-4 text-[1.02rem] leading-relaxed text-white/75">
          {product.description.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Block>

      <div className="grid gap-6 md:grid-cols-2">
        <Block title="Características" id="caracteristicas" className="card p-6">
          <ul className="space-y-3">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-white/80">
                <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </Block>
        <Block title="O que acompanha" id="acompanha" className="card p-6">
          <ul className="space-y-3">
            {product.includes.map((f) => (
              <li key={f} className="flex items-start gap-3 text-white/80">
                <PackageOpen className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </Block>
      </div>

      {product.condition === 'usado' && product.conditionNotes && (
        <section aria-labelledby="estado-title" className="rounded-card border border-accent/30 bg-accent/[0.06] p-6 sm:p-8">
          <h2 id="estado-title" className="mb-4 flex items-center gap-3 text-2xl font-bold tracking-tight">
            <TriangleAlert className="size-6 text-accent" aria-hidden />
            Estado do produto
          </h2>
          <ul className="space-y-2.5 text-white/80">
            {product.conditionNotes.map((n) => (
              <li key={n} className="flex items-start gap-3">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {n}
              </li>
            ))}
          </ul>
        </section>
      )}

      <Block title="Informações importantes" id="informacoes">
        <ul className="max-w-3xl space-y-3 text-white/75">
          {info.map((line) => (
            <li key={line} className="flex items-start gap-3">
              <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
              {line}
            </li>
          ))}
        </ul>
      </Block>

      {product.reviews && product.reviews.length > 0 && (
        <Block title="Avaliações" id="avaliacoes">
          <ul className="grid gap-4 md:grid-cols-2">
            {product.reviews.map((r) => (
              <li key={`${r.author}-${r.date}`} className="card p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{r.author}</p>
                  <span className="flex" aria-label={`${r.rating} de 5 estrelas`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className={cn('size-4', n <= r.rating ? 'fill-accent text-accent' : 'text-white/25')} />
                    ))}
                  </span>
                </div>
                <p className="mt-2 text-white/70">{r.text}</p>
                <p className="mt-3 text-xs text-white/40">{r.date}</p>
              </li>
            ))}
          </ul>
        </Block>
      )}

      <Block title="Perguntas frequentes" id="faq-produto" className="max-w-3xl">
        <Accordion items={productFaq(product)} />
      </Block>
    </div>
  );
}
