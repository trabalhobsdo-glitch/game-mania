import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ProductGrid } from '@/components/home/ProductGrid';
import { ProductDetails } from '@/components/product/ProductDetails';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductPurchase } from '@/components/product/ProductPurchase';
import { store } from '@/data/store';
import { displayName, relatedProducts } from '@/lib/catalog';
import { absoluteUrl } from '@/lib/format';
import type { Product } from '@/lib/types';

function jsonLd(product: Product) {
  const url = absoluteUrl(`/produto/${product.slug}`);
  const reviews = product.reviews ?? [];
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: displayName(product),
    description: product.shortDescription,
    image: product.images.map((i) => absoluteUrl(i.src)),
    sku: product.id,
    itemCondition: product.condition === 'novo' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'BRL',
      price: product.price.toFixed(2),
      itemCondition: product.condition === 'novo' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
      availability: product.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: store.name },
    },
    // Só publica nota se existirem avaliações reais.
    ...(reviews.length > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1),
            reviewCount: reviews.length,
          },
        }
      : {}),
  };
}

export function ProductPageView({ product }: { product: Product }) {
  const related = relatedProducts(product, 3);
  return (
    <div className="container-x pb-24 pt-6 lg:pb-8 lg:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(product)).replace(/</g, '\\u003c') }} />

      <nav aria-label="Você está em" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-white/50">
        <Link href="/" className="transition hover:text-white">Início</Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <Link href="/#produtos" className="transition hover:text-white">Produtos</Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <span className="text-white/80" aria-current="page">{displayName(product)}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.02fr_1fr] lg:gap-14">
        <ProductGallery product={product} />
        <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
          <ProductPurchase product={product} />
        </div>
      </div>

      <ProductDetails product={product} />

      <section className="mt-20 lg:mt-28" aria-labelledby="relacionados-title">
        <h2 id="relacionados-title" className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
          Você também pode gostar
        </h2>
        <ProductGrid products={related} />
      </section>
    </div>
  );
}
