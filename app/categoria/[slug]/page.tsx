import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryView } from '@/components/home/CategoryView';
import { getCategory, visibleCategories } from '@/lib/catalog';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return visibleCategories().map((c) => ({ slug: c.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return { title: cat.label, description: `${cat.description} na GAME MANIA.`, alternates: { canonical: `/categoria/${cat.slug}` } };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat || !visibleCategories().includes(cat)) notFound();
  return <CategoryView category={cat} />;
}
