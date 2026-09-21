import { ProductCard } from '@/components/home/ProductCard';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';
import type { Product } from '@/lib/types';

export function ProductGrid({ products, className }: { products: Product[]; className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 gap-3.5 sm:gap-6 lg:grid-cols-3', className)}>
      {products.map((product, i) => (
        <Reveal key={product.slug} delay={(i % 3) * 90} className="h-full">
          <ProductCard product={product} priority={i < 3} />
        </Reveal>
      ))}
    </div>
  );
}
