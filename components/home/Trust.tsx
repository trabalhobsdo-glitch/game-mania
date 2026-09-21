import { TrustIcon } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';
import { store } from '@/data/store';

export function Trust() {
  const { trust } = store;
  return (
    <section className="container-x pt-20 lg:pt-28" aria-labelledby="confianca-title">
      <h2 id="confianca-title" className="mb-8 text-3xl font-bold uppercase tracking-tight sm:text-4xl lg:mb-10">
        {trust.title}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {trust.items.map((item, i) => (
          <li key={item.title}>
            <Reveal delay={i * 70} className="h-full">
              <div className="card h-full p-5 transition duration-300 hover:border-accent/40 hover:bg-white/[0.055]">
                <span className="grid size-12 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/25">
                  <TrustIcon name={item.icon} className="size-6" />
                </span>
                <h3 className="mt-4 text-[1.05rem] font-semibold leading-snug">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">{item.text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
