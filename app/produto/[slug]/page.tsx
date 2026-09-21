import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductPageView } from '@/components/product/ProductPageView';
import { products } from '@/data/products';
import { displayName, getProduct } from '@/lib/catalog';

type Props = { params: Promise<{ slug: string }> };

// Cada produto em data/products.ts vira uma página estática automaticamente.
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const title = `${displayName(product)} (${product.condition === 'novo' ? 'novo' : 'usado'})`;
  return {
    title,
    description: product.shortDescription,
    alternates: { canonical: `/produto/${product.slug}` },
    openGraph: {
      type: 'website',
      title,
      description: product.shortDescription,
      url: `/produto/${product.slug}`,
      images: [{ url: product.images[0].src, alt: product.images[0].alt }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductPageView product={product} />;
}
