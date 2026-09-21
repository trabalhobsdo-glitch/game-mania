import { ProductGridSkeleton } from '@/components/ui/Skeletons';

/** Exibido durante transições de rota. */
export default function Loading() {
  return (
    <div className="container-x py-12">
      <div className="skeleton mb-8 h-9 w-56 rounded" />
      <ProductGridSkeleton />
    </div>
  );
}
