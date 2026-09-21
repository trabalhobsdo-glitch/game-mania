import { brl } from '@/lib/format';
import { cn } from '@/lib/cn';
import { isOffer } from '@/lib/catalog';
import type { Product } from '@/lib/types';

export function Price({
  product,
  size = 'md',
  className,
}: {
  product: Product;
  size?: 'md' | 'lg';
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-3 gap-y-1', className)}>
      <span
        className={cn(
          'font-display font-bold tracking-tight',
          size === 'lg' ? 'text-4xl sm:text-[2.6rem]' : 'text-2xl',
          !product.available && 'text-white/55',
        )}
      >
        {brl(product.price)}
      </span>
      {isOffer(product) && (
        <span className={cn('text-white/45 line-through', size === 'lg' ? 'text-lg' : 'text-sm')}>
          {brl(product.compareAtPrice as number)}
        </span>
      )}
    </div>
  );
}
