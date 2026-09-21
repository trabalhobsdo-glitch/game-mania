import { products } from '@/data/products';
import type { Product } from '@/lib/types';

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const isOffer = (p: Product) => typeof p.compareAtPrice === 'number' && p.compareAtPrice > p.price;

export const discountPercent = (p: Product) =>
  isOffer(p) ? Math.round((1 - p.price / (p.compareAtPrice as number)) * 100) : 0;

export const displayName = (p: Product) => (p.variant ? `${p.name} — ${p.variant}` : p.name);

/** Disponíveis primeiro (mantém a ordem original dentro de cada grupo). */
export const sortAvailableFirst = (list: Product[]) => [
  ...list.filter((p) => p.available),
  ...list.filter((p) => !p.available),
];

export type CategorySlug = 'playstation' | 'game-stick' | 'ofertas' | 'mais-vendidos';

export interface Category {
  slug: CategorySlug;
  label: string;
  description: string;
  icon: 'gamepad' | 'joystick' | 'flame' | 'star';
  /** Produto (slug) cuja foto ilustra o card da categoria. */
  coverSlug?: string;
  match: (p: Product) => boolean;
}

export const allCategories: Category[] = [
  {
    slug: 'playstation',
    label: 'PlayStation',
    description: 'Consoles e kits PlayStation',
    icon: 'gamepad',
    coverSlug: 'ps2-opl-2-controles-sem-fio',
    match: (p) => p.category === 'playstation',
  },
  {
    slug: 'game-stick',
    label: 'Game Stick',
    description: 'Consoles compactos com controles',
    icon: 'joystick',
    coverSlug: 'game-stick-2',
    match: (p) => p.category === 'game-stick',
  },
  {
    slug: 'ofertas',
    label: 'Ofertas',
    description: 'Produtos com preço reduzido',
    icon: 'flame',
    match: isOffer,
  },
  {
    slug: 'mais-vendidos',
    label: 'Mais vendidos',
    description: 'Os preferidos dos clientes',
    icon: 'star',
    match: (p) => !!p.bestSeller,
  },
];

export const getCategoryProducts = (cat: Category) => sortAvailableFirst(products.filter(cat.match));

/** Categorias vazias (ex.: Ofertas sem nenhuma promoção) ficam escondidas. */
export const visibleCategories = () => allCategories.filter((c) => products.some(c.match));

export const getCategory = (slug: string) => allCategories.find((c) => c.slug === slug);

export const hasOffers = () => products.some(isOffer);

export function relatedProducts(product: Product, count = 3) {
  const others = products.filter((p) => p.slug !== product.slug);
  const same = others.filter((p) => p.category === product.category);
  const rest = others.filter((p) => p.category !== product.category);
  return sortAvailableFirst([...same, ...rest]).slice(0, count);
}
