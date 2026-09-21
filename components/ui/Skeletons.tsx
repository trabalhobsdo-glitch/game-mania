import { cn } from '@/lib/cn';

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-white/10 bg-white/[0.035]">
      <div className="skeleton aspect-[4/5]" />
      <div className="space-y-3 p-4 sm:p-5">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton mt-4 h-7 w-2/5 rounded" />
        <div className="skeleton h-11 w-full rounded-control" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 gap-3.5 sm:gap-6 lg:grid-cols-3', className)} aria-busy="true" aria-label="Carregando produtos">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="container-x py-8 lg:py-12" aria-busy="true" aria-label="Carregando produto">
      <div className="skeleton mb-8 h-4 w-56 rounded" />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <div className="skeleton aspect-[4/5] w-full rounded-card" />
          <div className="mt-3 flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-20 w-16 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-10 w-4/5 rounded" />
          <div className="skeleton h-5 w-40 rounded" />
          <div className="skeleton h-12 w-48 rounded" />
          <div className="skeleton h-24 w-full rounded-card" />
          <div className="skeleton h-12 w-full rounded-control" />
          <div className="skeleton h-12 w-full rounded-control" />
        </div>
      </div>
    </div>
  );
}
