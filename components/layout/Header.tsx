'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Headset, Menu, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { MobileMenu, type NavItem } from '@/components/layout/MobileMenu';
import { SearchDialog } from '@/components/layout/SearchDialog';
import { SupportLink } from '@/components/layout/SupportLink';
import { store } from '@/data/store';
import { hasOffers } from '@/lib/catalog';
import { cn } from '@/lib/cn';

export function Header() {
  const pathname = usePathname() ?? '/';
  const { count, open: openCart, bumpKey, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // "/" abre a busca (atalho de teclado)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (e.key === '/' && !typing) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const items: NavItem[] = [
    { label: 'Início', href: '/' },
    { label: 'Produtos', href: '/#produtos' },
    ...(hasOffers() ? [{ label: 'Ofertas', href: '/categoria/ofertas' }] : []),
  ];

  const isActive = (item: NavItem) => {
    if (item.label === 'Início') return pathname === '/';
    if (item.label === 'Ofertas') return pathname === '/categoria/ofertas';
    return pathname.startsWith('/produto') || (pathname.startsWith('/categoria') && pathname !== '/categoria/ofertas');
  };

  const iconBtn =
    'relative grid size-11 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white';

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300',
          scrolled ? 'border-white/10 bg-black/80 backdrop-blur-xl' : 'border-transparent bg-black/30 backdrop-blur-sm',
        )}
      >
        <div className="container-x flex h-[var(--header-h)] items-center gap-4 lg:gap-8">
          <Link href="/" aria-label={`${store.name} — página inicial`} className="shrink-0">
            <Image
              src="/logo.webp"
              alt={`${store.name} — ${store.tagline}`}
              width={665}
              height={595}
              priority
              className="h-[54px] w-auto transition-transform duration-300 hover:scale-105 lg:h-[62px]"
            />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-2 lg:flex" aria-label="Menu principal">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive(item) ? 'page' : undefined}
                className={cn(
                  'group relative px-4 py-2 font-display text-[0.95rem] font-medium tracking-wide transition-colors',
                  isActive(item) ? 'text-white' : 'text-white/65 hover:text-white',
                )}
              >
                {item.label}
                <span
                  className={cn(
                    'absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300',
                    isActive(item) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1 lg:ml-0">
            <button className={iconBtn} onClick={() => setSearchOpen(true)} aria-label="Buscar produtos">
              <Search className="size-[1.2rem]" />
            </button>
            <SupportLink className={cn(iconBtn, 'hidden sm:grid')} label="Atendimento">
              <Headset className="size-[1.2rem]" />
            </SupportLink>
            <button className={iconBtn} onClick={openCart} aria-label={`Abrir carrinho${hydrated && count ? `, ${count} ${count === 1 ? 'item' : 'itens'}` : ''}`}>
              <ShoppingBag className="size-[1.2rem]" />
              {hydrated && count > 0 && (
                <span
                  key={bumpKey}
                  className={cn(
                    'absolute right-0.5 top-0.5 grid min-w-[1.15rem] place-items-center rounded-full bg-accent px-1 text-[0.68rem] font-bold leading-[1.15rem] text-black',
                    bumpKey > 0 && 'animate-bump',
                  )}
                >
                  {count}
                </span>
              )}
            </button>
            <button className={cn(iconBtn, 'lg:hidden')} onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} items={items} onSearch={() => setSearchOpen(true)} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
