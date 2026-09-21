import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ProductGrid } from '@/components/home/ProductGrid';
import { CategoryIcon } from '@/components/ui/icons';
import { getCategoryProducts, type Category } from '@/lib/catalog';

export function CategoryView({ category }: { category: Category }) {
  const list = getCategoryProducts(category);
  return (
    <div className="container-x pb-8 pt-6 lg:pt-10">
      <nav aria-label="Você está em" className="mb-6 flex items-center gap-1.5 text-sm text-white/50">
        <Link href="/" className="transition hover:text-white">Início</Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <span className="text-white/80" aria-current="page">{category.label}</span>
      </nav>
      <header className="mb-10 flex items-center gap-4">
        <span className="grid size-14 place-items-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/30">
          <CategoryIcon name={category.icon} className="size-7" />
        </span>
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">{category.label}</h1>
          <p className="text-white/60">{category.description}</p>
        </div>
      </header>
      <ProductGrid products={list} />
    </div>
  );
}
