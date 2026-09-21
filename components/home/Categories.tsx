import Image from 'next/image';
import Link from 'next/link';
import { CategoryIcon } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';
import { products } from '@/data/products';
import { getProduct, visibleCategories } from '@/lib/catalog';
import { cn } from '@/lib/cn';

export function Categories() {
  const categories = visibleCategories();
  return (
    <section className="container-x pt-4 lg:pt-8" aria-labelledby="categorias-title">
      <h2 id="categorias-title" className="sr-only">
        Categorias
      </h2>
      <ul className={cn('grid gap-4', categories.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2')}>
        {categories.map((cat, i) => {
          const list = products.filter(cat.match);
          const cover = (cat.coverSlug ? getProduct(cat.coverSlug) : list[0])?.images[0];
          return (
            <li key={cat.slug}>
              <Reveal delay={i * 80}>
                <Link
                  href={`/categoria/${cat.slug}`}
                  className="group relative isolate flex min-h-[170px] overflow-hidden rounded-card border border-white/10 bg-white/[0.03] transition duration-300 hover:border-accent/50 hover:shadow-card"
                >
                  {cover && (
                    <span className="absolute inset-y-0 right-0 -z-10 w-3/5">
                      <Image src={cover.src} alt="" fill sizes="(min-width: 640px) 300px, 60vw" className="object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-95" />
                      <span className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
                    </span>
                  )}
                  <span className="flex flex-col justify-between p-5 sm:p-6">
                    <span className="grid size-11 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30">
                      <CategoryIcon name={cat.icon} className="size-5" />
                    </span>
                    <span>
                      <span className="block font-display text-2xl font-bold">{cat.label}</span>
                      <span className="mt-0.5 block text-sm text-white/55">
                        {list.length} {list.length === 1 ? 'produto' : 'produtos'}
                      </span>
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
