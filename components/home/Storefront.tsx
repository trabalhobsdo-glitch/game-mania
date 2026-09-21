import { ProductGrid } from '@/components/home/ProductGrid';
import { products } from '@/data/products';
import { sortAvailableFirst } from '@/lib/catalog';

export function Storefront() {
  return (
    <section id="produtos" className="container-x pt-16 lg:pt-24" aria-labelledby="produtos-title">
      <div className="mb-8 max-w-2xl lg:mb-10">
        <h2 id="produtos-title" className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          Produtos
        </h2>
        <p className="mt-2 text-white/60">Consoles e acessórios com a condição sempre informada: novo ou usado.</p>
      </div>
      <ProductGrid products={sortAvailableFirst(products)} />
    </section>
  );
}
