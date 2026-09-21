'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Headset, Search, X } from 'lucide-react';
import { SupportLink } from '@/components/layout/SupportLink';
import { store } from '@/data/store';
import { useEscape, useLockBody } from '@/lib/useLockBody';

export interface NavItem {
  label: string;
  href: string;
}

export function MobileMenu({
  open,
  onClose,
  items,
  onSearch,
}: {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  onSearch: () => void;
}) {
  useLockBody(open);
  useEscape(open, onClose);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[75] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="absolute inset-0 animate-fade-in bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute left-0 top-0 flex h-full w-[86%] max-w-[360px] animate-slide-left flex-col border-r border-white/10 bg-black">
        <div className="flex items-center justify-between px-5 py-3">
          <Image src="/logo.webp" alt={`${store.name} — ${store.tagline}`} width={665} height={595} className="h-16 w-auto" />
          <button onClick={onClose} className="grid size-11 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="Fechar menu">
            <X className="size-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Menu principal">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.label}>
                <Link href={item.href} onClick={onClose} className="flex h-14 items-center rounded-xl px-4 font-display text-2xl font-semibold transition hover:bg-white/[0.06] hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              onClose();
              onSearch();
            }}
            className="mt-4 flex h-14 w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-left text-white/70 transition hover:border-accent/50"
          >
            <Search className="size-5 text-accent" aria-hidden />
            Buscar produtos
          </button>
        </nav>

        <div className="border-t border-white/10 p-5">
          <SupportLink onClick={onClose} className="btn btn-outline w-full">
            <Headset className="size-5" aria-hidden />
            Falar com atendimento
          </SupportLink>
        </div>
      </aside>
    </div>
  );
}
