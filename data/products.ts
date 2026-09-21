import type { Product } from '@/lib/types';

/**
 * ============================================================
 * CATÁLOGO DE PRODUTOS  —  o único lugar onde produtos são editados
 * ------------------------------------------------------------
 * • Editar preço:        mude o campo `price`
 * • Promoção:            preencha `compareAtPrice` (preço antigo) → aparece OFERTA
 * • Indisponível:        `available: false`
 * • Trocar fotos:        substitua os arquivos em public/images/produtos/<slug>/
 * • Novo produto:        copie um item abaixo, mude id/slug e crie a pasta de fotos.
 *                        A página /produto/<slug> é criada automaticamente.
 * • Mais vendidos:       `bestSeller: true` (só se for verdade)
 * • Avaliações:          `reviews` — só avaliações reais
 * ============================================================
 */

const img = (slug: string, n: number, alt: string) => ({
  src: `/images/produtos/${slug}/${n}.jpg`,
  alt,
});

/**
 * Print do menu OPL (lista de jogos) — mesma imagem usada em todos os PS2 OPL.
 * Fica sempre por ÚLTIMO na galeria, porque a primeira foto é a capa do produto
 * nos cards da loja, nas categorias e na vitrine da Home.
 * Para trocar: substitua public/images/ps2-opl-menu.jpg
 */
const oplMenu = {
  src: '/images/ps2-opl-menu.jpg',
  alt: 'Menu OPL do PlayStation 2 com a lista de jogos dublados em português',
  fit: 'contain' as const,
};

export const products: Product[] = [
  // ---------------------------------------------------------------- 1
  {
    id: 'ps5',
    slug: 'playstation-5',
    name: 'PlayStation 5',
    category: 'playstation',
    condition: 'novo',
    available: false, // sem estoque
    price: 5499, // TODO: EDITAR
    shortDescription: 'Console PlayStation 5 para uma experiência de nova geração.',
    description: [
      'Console PlayStation 5 novo, para jogar a nova geração com gráficos em alta resolução e carregamento rápido.',
      'Acompanha o controle sem fio DualSense, com gatilhos adaptáveis e resposta tátil.',
    ],
    features: [
      'Console PlayStation 5 novo',
      'Armazenamento de 825 GB conforme a embalagem', // TODO: EDITAR — confirme o modelo exato
      'Controle sem fio DualSense',
      'Jogos em 4K com HDR (conforme a embalagem)',
    ],
    includes: [
      'Console PlayStation 5',
      'Controle sem fio DualSense',
      'Manual de instruções',
      // TODO: EDITAR — se os cartões de jogo (Astro Bot / Gran Turismo 7) das fotos vão junto, liste aqui.
    ],
    images: [
      img('playstation-5', 1, 'Console PlayStation 5 branco em pé, com controle DualSense, caixa e manual'),
      img('playstation-5', 2, 'Console PlayStation 5 com controle DualSense à frente da caixa'),
      img('playstation-5', 3, 'Controle DualSense branco e preto segurado com o console ao fundo'),
    ],
  },

  // ---------------------------------------------------------------- 2
  {
    id: 'ps2-sem-fio',
    slug: 'ps2-opl-2-controles-sem-fio',
    name: 'PlayStation 2 OPL',
    variant: '2 controles sem fio',
    category: 'playstation',
    condition: 'usado',
    available: true,
    price: 178, // TODO: EDITAR
    shortDescription: 'PlayStation 2 com OPL e 2 controles sem fio para jogar seus clássicos favoritos.',
    description: [
      'PlayStation 2 modelo slim com OPL instalado e 2 controles sem fio, pronto para reviver os clássicos com um amigo.',
      'Aparelho usado: veja todas as fotos da galeria para conferir o estado real do console e dos acessórios.',
    ],
    features: ['PlayStation 2 modelo slim (fino)', 'OPL instalado', '2 controles sem fio', 'Produto usado'],
    includes: [
      'Console PlayStation 2 slim com OPL',
      '2 controles sem fio',
      'Fonte de energia, cabo de vídeo e adaptador HDMI (conforme fotos)', // TODO: EDITAR — confirme item a item
    ],
    conditionNotes: [
      'Produto usado, com marcas normais de uso.',
      'As fotos da galeria mostram o aparelho e os acessórios.',
      // TODO: EDITAR — descreva o que foi testado (leitura, controles, saídas) e qualquer detalhe de desgaste.
    ],
    images: [
      img('ps2-opl-2-controles-sem-fio', 1, 'PlayStation 2 slim preto com dois controles sem fio ao lado'),
      img('ps2-opl-2-controles-sem-fio', 2, 'Frente do PlayStation 2 slim com cartão de memória inserido'),
      img('ps2-opl-2-controles-sem-fio', 3, 'PlayStation 2 slim com a tampa do leitor aberta'),
      img('ps2-opl-2-controles-sem-fio', 4, 'Fonte, cabos, cabo de vídeo e adaptador PS2 para HDMI sobre a mesa'),
      oplMenu,
    ],
  },

  // ---------------------------------------------------------------- 3
  {
    id: 'gamestick-1',
    slug: 'game-stick-1',
    name: 'Game Stick 1',
    category: 'game-stick',
    condition: 'novo',
    available: false, // sem estoque
    price: 198.9, // TODO: EDITAR
    shortDescription: 'Game Stick compacto para levar seus jogos clássicos para qualquer lugar.',
    description: [
      'Game Stick compacto que liga direto na entrada HDMI da TV, com 2 controles sem fio para jogar em dupla.',
    ],
    // TODO: EDITAR — confirme se as fotos (modelo X2) são mesmo do "Game Stick 1"
    features: ['Modelo X2', 'Conexão HDMI', '2 controles sem fio', 'Produto novo'],
    includes: ['Game Stick X2', '2 controles sem fio', 'Manual do usuário'],
    images: [img('game-stick-1', 1, 'Game Stick X2 com dois controles sem fio, manual e caixa')],
  },

  // ---------------------------------------------------------------- 4
  {
    id: 'gamestick-2',
    slug: 'game-stick-2',
    name: 'Game Stick 2',
    category: 'game-stick',
    condition: 'novo',
    available: true,
    price: 124, // TODO: EDITAR
    shortDescription: 'Game Stick com experiência completa para quem gosta de jogos clássicos.',
    description: [
      'Game Stick Lite que liga direto na entrada HDMI da TV, com 2 controles sem fio para jogar em dupla.',
    ],
    // TODO: EDITAR — confirme se as fotos (modelo Lite) são mesmo do "Game Stick 2"
    features: ['Modelo Lite', 'Conexão HDMI', '2 controles sem fio 2.4G', 'Produto novo'],
    includes: ['Game Stick Lite', '2 controles sem fio', 'Cabos e receptor (conforme fotos)'],
    images: [
      img('game-stick-2', 1, 'Caixa do Game Stick Lite com os dois controles, o stick e os cabos'),
      img('game-stick-2', 2, 'Pilha de caixas do Game Stick Lite'),
    ],
  },

  // ---------------------------------------------------------------- 5
  {
    id: 'ps2-original',
    slug: 'ps2-opl-controle-original',
    name: 'PlayStation 2 OPL',
    variant: '1 controle com fio original',
    category: 'playstation',
    condition: 'usado',
    available: false, // sem estoque
    price: 169.9, // TODO: EDITAR
    shortDescription: 'PlayStation 2 com OPL e controle com fio original.',
    description: [
      'PlayStation 2 modelo slim com OPL instalado e 1 controle com fio original Sony.',
      'Aparelho usado: veja as fotos da galeria para conferir o estado real do console e do controle.',
    ],
    features: ['PlayStation 2 modelo slim (fino)', 'OPL instalado', '1 controle com fio original', 'Produto usado'],
    includes: ['Console PlayStation 2 slim com OPL', '1 controle com fio original'], // TODO: EDITAR
    conditionNotes: [
      'Produto usado, com marcas normais de uso.',
      'As fotos da galeria mostram o aparelho e o controle.',
      // TODO: EDITAR — descreva o que foi testado e qualquer detalhe de desgaste.
    ],
    images: [
      img('ps2-opl-controle-original', 1, 'PlayStation 2 slim em pé com controle com fio original Sony à frente'),
      img('ps2-opl-controle-original', 2, 'Frente do PlayStation 2 slim preto'),
      img('ps2-opl-controle-original', 3, 'Controle com fio original Sony visto de cima'),
      img('ps2-opl-controle-original', 4, 'Lateral do PlayStation 2 slim com entradas USB e de controle'),
      oplMenu,
    ],
  },

  // ---------------------------------------------------------------- 6
  {
    id: 'ps2-com-fio',
    slug: 'ps2-opl-2-controles-com-fio',
    name: 'PlayStation 2 OPL',
    variant: '2 controles com fio',
    category: 'playstation',
    condition: 'usado',
    available: true,
    price: 147.9, // TODO: EDITAR
    shortDescription: 'PlayStation 2 com OPL e 2 controles com fio para jogar com amigos.',
    description: [
      'PlayStation 2 modelo slim com OPL instalado e 2 controles com fio, ideal para jogar com amigos.',
      'Aparelho usado: veja as fotos da galeria para conferir o estado real do console e dos controles.',
    ],
    features: ['PlayStation 2 modelo slim (fino)', 'OPL instalado', '2 controles com fio', 'Produto usado'],
    includes: ['Console PlayStation 2 slim com OPL', '2 controles com fio'], // TODO: EDITAR — confirme (as fotos mostram 1 controle)
    conditionNotes: [
      'Produto usado, com marcas normais de uso.',
      'As fotos da galeria mostram o aparelho.',
      // TODO: EDITAR — descreva o que foi testado e qualquer detalhe de desgaste.
    ],
    images: [
      img('ps2-opl-2-controles-com-fio', 1, 'PlayStation 2 slim protegido por plástico, com controle com fio à frente'),
      img('ps2-opl-2-controles-com-fio', 2, 'PlayStation 2 slim em pé, protegido por plástico, com controle com fio ao lado'),
      img('ps2-opl-2-controles-com-fio', 3, 'PlayStation 2 slim em pé com controle e cartão de memória'),
      img('ps2-opl-2-controles-com-fio', 4, 'PlayStation 2 slim deitado com controle sobre o console'),
      oplMenu,
    ],
  },
];
