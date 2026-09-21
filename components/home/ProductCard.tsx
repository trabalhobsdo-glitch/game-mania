import Link from 'next/link';
import { SmartImage } from '@/components/ui/SmartImage';
import { ConditionBadge } from '@/components/ui/ConditionBadge';
import { Price } from '@/components/ui/Price';
import { displayName, isOffer } from '@/lib/catalog';
import { cn } from '@/lib/cn';
import type { Product } from '@/lib/types';

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const cover = product.images[0];
  const offer = isOffer(product);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-white/10 bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:border-accent/45 hover:shadow-card focus-within:border-accent/45">
      <div className="relative aspect-[4/5] overflow-hidden bg-white/[0.04]">
        <SmartImage
          src={cover.src}
          alt={cover.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        {!product.available && <div className="absolute inset-0 bg-black/55" aria-hidden />}

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <ConditionBadge condition={product.condition} />
        </div>
        {offer && (
          <span className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 font-display text-[0.7rem] font-bold uppercase leading-none tracking-wider text-black">
            Oferta
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <h3 className="font-display text-[1.02rem] font-semibold leading-snug sm:text-lg">{product.name}</h3>
        {product.variant && <p className="text-[0.8rem] text-white/55 sm:text-sm">{product.variant}</p>}
        <p className="mt-2 hidden line-clamp-2 text-sm leading-relaxed text-white/60 sm:block">{product.shortDescription}</p>

        <div className="mt-auto pt-4">
          <Price product={product} />
          <span
            className={cn(
              'btn mt-3 h-11 w-full px-3 text-[0.78rem] sm:text-sm',
              product.available ? 'btn-primary group-hover:brightness-110' : 'btn-muted',
            )}
          >
            {product.available ? 'Comprar agora' : 'Indisponível'}
          </span>
        </div>
      </div>

      <Link href={`/produto/${product.slug}`} className="absolute inset-0 z-10 rounded-card" aria-label={`Ver ${displayName(product)}`} />
    </article>
  );
}
