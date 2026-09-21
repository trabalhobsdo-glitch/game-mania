'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, SearchX, X } from 'lucide-react';
import { products } from '@/data/products';
import { displayName, sortAvailableFirst } from '@/lib/catalog';
import { brl, normalize } from '@/lib/format';
import { useEscape, useLockBody } from '@/lib/useLockBody';

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useLockBody(open);
  useEscape(open, onClose);

  useEffect(() => {
    if (open) {
      setQuery('');
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return sortAvailableFirst(products);
    return sortAvailableFirst(
      products.filter((p) => {
        const haystack = normalize(`${displayName(p)} ${p.shortDescription} ${p.condition} ${p.category.replace('-', ' ')}`);
        return terms.every((t) => haystack.includes(t));
      }),
    );
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Buscar produtos">
      <div className="absolute inset-0 animate-fade-in bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative mx-auto mt-[8vh] w-[calc(100%-2rem)] max-w-2xl animate-pop overflow-hidden rounded-card border border-white/15 bg-black shadow-soft">
        <div className="flex items-center gap-3 border-b border-white/10 px-4">
          <Search className="size-5 shrink-0 text-accent" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por PlayStation, Game Stick, controle…"
            className="h-16 w-full bg-transparent text-base text-white placeholder:text-white/35 focus:outline-none"
            aria-label="Buscar produtos"
            type="search"
            autoFocus
            autoComplete="off"
          />
          <button onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white" aria-label="Fechar busca">
            <X className="size-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          <p className="px-3 pb-2 pt-3 text-xs text-white/45" aria-live="polite">
            {query.trim() ? `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}` : 'Todos os produtos'}
          </p>
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <SearchX className="size-8 text-white/40" aria-hidden />
              <p className="font-display text-lg font-semibold">Nenhum produto encontrado</p>
              <p className="text-sm text-white/55">Tente outra palavra, como “PS2”, “Game Stick” ou “controle”.</p>
            </div>
          ) : (
            <ul>
              {results.map((p) => (
                <li key={p.slug}>
                  <Link href={`/produto/${p.slug}`} onClick={onClose} className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-white/[0.06]">
                    <span className="relative block h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                      <Image src={p.images[0].src} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display font-semibold">{displayName(p)}</span>
                      <span className="block text-xs text-white/50">
                        {p.condition === 'novo' ? 'Novo' : 'Usado'}
                        {!p.available && ' · Indisponível'}
                      </span>
                    </span>
                    <span className={p.available ? 'font-display font-bold' : 'font-display font-bold text-white/45'}>{brl(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
