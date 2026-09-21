export type Condition = 'novo' | 'usado';
export type CategoryId = 'playstation' | 'game-stick';

export interface ProductImage {
  /** Caminho a partir de /public, ex.: /images/produtos/playstation-5/1.jpg */
  src: string;
  alt: string;
  /**
   * Como a foto se encaixa na galeria.
   * 'cover' (padrão) preenche todo o espaço e pode cortar as bordas.
   * 'contain' mostra a imagem inteira, sem cortar — use em prints de tela.
   */
  fit?: 'cover' | 'contain';
}

export interface Review {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Product {
  id: string;
  /** Vira a URL: /produto/<slug> */
  slug: string;
  name: string;
  /** Complemento do nome (ex.: "2 controles sem fio") */
  variant?: string;
  category: CategoryId;
  condition: Condition;
  /** false = aparece na loja, mas não pode ser comprado */
  available: boolean;
  price: number;
  /** Preço "de". Preencha só em promoção real — ativa o selo OFERTA e a página Ofertas. */
  compareAtPrice?: number;
  /** Marque true só quando for realmente um dos mais vendidos. */
  bestSeller?: boolean;
  shortDescription: string;
  description: string[];
  features: string[];
  includes: string[];
  /** Somente usados: o que foi verificado, marcas de uso etc. */
  conditionNotes?: string[];
  importantInfo?: string[];
  images: ProductImage[];
  /** Somente avaliações REAIS. Vazio = a loja mostra "Seja o primeiro a avaliar". */
  reviews?: Review[];
  faq?: FaqItem[];
}

export interface CartItem {
  slug: string;
  quantity: number;
}
