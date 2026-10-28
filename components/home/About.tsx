import Image from 'next/image';
import Link from 'next/link';
import { store } from '@/data/store';

export function About() {
  const { about } = store;
  return (
    <section id="sobre" className="container-x pt-20 lg:pt-28" aria-labelledby="sobre-title">
      <div className="relative isolate grid items-center gap-10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:p-14">
        <div aria-hidden className="absolute -right-24 top-1/2 -z-10 size-[420px] -translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />
        <div>
          <h2 id="sobre-title" className="text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            {about.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/75">{about.text}</p>
          <Link href="/#produtos" className="btn btn-outline mt-8">
            Ver produtos
          </Link>
        </div>
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[440px] overflow-hidden rounded-[1.25rem] border border-white/10 shadow-[0_0_50px_rgb(var(--accent)/0.25)]">
            <Image
              src="/images/loja-balcao.jpg"
              alt={`Balcão da loja ${store.name} com o letreiro luminoso, vitrine de consoles e jogos`}
              width={941}
              height={1024}
              sizes="(min-width: 1024px) 440px, 90vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
