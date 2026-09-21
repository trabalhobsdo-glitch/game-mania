import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { store } from '@/data/store';
import { displayName, getProduct } from '@/lib/catalog';
import { brl } from '@/lib/format';
import { cn } from '@/lib/cn';

const layout = [
  { pos: 'right-0 top-0 w-[52%]', rot: 'rotate-[3deg]', delay: 260, z: 'z-20', glow: true },
  { pos: 'left-0 top-[21%] w-[44%]', rot: '-rotate-[4deg]', delay: 400, z: 'z-10', glow: false },
  { pos: 'bottom-0 right-[6%] w-[40%]', rot: '-rotate-[1.5deg]', delay: 540, z: 'z-30', glow: false },
];

export function Hero() {
  const { hero } = store;
  const showcase = hero.showcase
    .map((slug) => getProduct(slug))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .slice(0, 3);

  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      {/* Iluminação de fundo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(55%_55%_at_78%_28%,rgb(var(--accent)/0.20),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_8%_90%,rgb(var(--accent)/0.08),transparent_70%)]" />
        <div className="hero-grid absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black" />
      </div>

      <div className="container-x grid items-center gap-12 pb-16 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:pb-24 lg:pt-14">
        <div>
          <h1
            id="hero-title"
            className="text-[clamp(1.85rem,8.4vw,3.4rem)] font-bold uppercase leading-[1.02] tracking-tight lg:text-[3.5rem] xl:text-[3.9rem]"
          >
            {hero.titleLines.map((line, i) => (
              <span key={line} className="block animate-rise" style={{ animationDelay: `${i * 130}ms` }}>
                {line}
              </span>
            ))}
          </h1>
          <span aria-hidden className="mt-6 block h-1 w-24 animate-rise rounded-full bg-accent shadow-[0_0_24px_rgb(var(--accent)/0.8)]" style={{ animationDelay: '260ms' }} />

          <p className="mt-6 max-w-md animate-rise text-lg leading-relaxed text-white/70" style={{ animationDelay: '320ms' }}>
            {hero.text}
          </p>

          <div className="mt-8 flex animate-rise flex-col gap-3 sm:flex-row" style={{ animationDelay: '420ms' }}>
            <Link href="/#produtos" className="btn btn-primary sm:min-w-[200px]">
              {hero.primaryCta}
            </Link>
            <Link href="/#sobre" className="btn btn-outline">
              {hero.secondaryCta}
            </Link>
          </div>

          <ul className="mt-9 flex animate-rise flex-wrap gap-x-6 gap-y-2 text-sm text-white/60" style={{ animationDelay: '520ms' }}>
            {hero.chips.map((chip) => (
              <li key={chip} className="flex items-center gap-2">
                <Check className="size-4 text-accent" aria-hidden />
                {chip}
              </li>
            ))}
          </ul>
        </div>

        {/* Vitrine com fotos reais dos produtos */}
        <div className="relative mx-auto aspect-[500/620] w-full max-w-[440px] lg:mx-0 lg:ml-auto lg:max-w-[500px]">
          <div aria-hidden className="absolute -inset-8 -z-10 rounded-full bg-accent/15 blur-3xl" />
          {showcase.map((product, i) => {
            const slot = layout[i];
            const cover = product.images[0];
            return (
              <Link
                key={product.slug}
                href={`/produto/${product.slug}`}
                className={cn('group absolute animate-rise hover:z-40', slot.pos, slot.z)}
                style={{ animationDelay: `${slot.delay}ms` }}
                aria-label={`Ver ${displayName(product)}`}
              >
                <span className={cn('block transition-transform duration-500 ease-out group-hover:rotate-0 group-hover:scale-[1.03]', slot.rot)}>
                  <span
                    className={cn(
                      'relative block aspect-[3/4] overflow-hidden rounded-2xl border bg-neutral-900',
                      slot.glow ? 'border-accent/50 shadow-glow' : 'border-white/15 shadow-soft',
                    )}
                  >
                    <Image src={cover.src} alt={cover.alt} fill priority={i === 0} sizes="(min-width: 1024px) 260px, 45vw" className="object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 pb-2.5 pt-8">
                      <span className="block truncate font-display text-[0.72rem] font-semibold leading-tight sm:text-sm">{product.name}</span>
                      <span className="block text-[0.68rem] text-white/70 sm:text-xs">{brl(product.price)}</span>
                    </span>
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
