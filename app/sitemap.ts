import type { MetadataRoute } from 'next';
import { products } from '@/data/products';
import { visibleCategories } from '@/lib/catalog';
import { absoluteUrl } from '@/lib/format';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absoluteUrl('/'), lastModified: now, priority: 1 },
    ...visibleCategories().map((c) => ({ url: absoluteUrl(`/categoria/${c.slug}`), lastModified: now, priority: 0.7 })),
    ...products.map((p) => ({ url: absoluteUrl(`/produto/${p.slug}`), lastModified: now, priority: 0.9 })),
    ...['politica-de-privacidade', 'termos-de-uso', 'politica-de-troca'].map((s) => ({ url: absoluteUrl(`/${s}`), lastModified: now, priority: 0.3 })),
  ];
}
