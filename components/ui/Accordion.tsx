import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '@/lib/types';

/** Acordeão acessível baseado em <details> (funciona até sem JavaScript). */
export function Accordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-white/10 overflow-hidden rounded-card border border-white/10 bg-white/[0.03]">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-display text-[1.05rem] font-semibold transition hover:bg-white/[0.04] sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDown className="size-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-180" aria-hidden />
          </summary>
          <p className="max-w-3xl px-5 pb-5 leading-relaxed text-white/70 sm:px-6">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
