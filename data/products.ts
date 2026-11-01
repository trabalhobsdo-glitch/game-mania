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

/**
 * Banner exibido na seção "Descrição" de todos os PlayStation 2.
 * Para trocar: substitua public/images/ps2-banner.jpg
 */
const ps2Banner = {
  src: '/images/ps2-banner.jpg',
  alt: 'Banner do PlayStation 2: console com controles e HD com mais de 400 jogos de PS2',
  fit: 'contain' as const,
};

/** Fotos do Xbox 360 Slim: aparecem inteiras (menores) dentro da moldura, sem corte. */
const slim = (n: number, alt: string) => ({
  ...img('xbox-360-slim-rgh-lt3-500gb', n, alt),
  fit: 'contain' as const,
});

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
    descriptionImage: ps2Banner,
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
    descriptionImage: ps2Banner,
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
    descriptionImage: ps2Banner,
    images: [
      img('ps2-opl-2-controles-com-fio', 1, 'PlayStation 2 slim protegido por plástico, com controle com fio à frente'),
      img('ps2-opl-2-controles-com-fio', 2, 'PlayStation 2 slim em pé, protegido por plástico, com controle com fio ao lado'),
      img('ps2-opl-2-controles-com-fio', 3, 'PlayStation 2 slim em pé com controle e cartão de memória'),
      img('ps2-opl-2-controles-com-fio', 4, 'PlayStation 2 slim deitado com controle sobre o console'),
      oplMenu,
    ],
  },

  // ---------------------------------------------------------------- 7
  {
    id: 'ps2-fat-sem-fio',
    slug: 'ps2-fat-opl-1-controle-sem-fio',
    name: 'PlayStation 2 Fat OPL',
    variant: '1 controle sem fio',
    category: 'playstation',
    condition: 'usado',
    available: true, // TODO: EDITAR — confirme se há estoque
    price: 210.5,
    shortDescription: 'PlayStation 2 Fat com OPL e controle sem fio para jogar seus clássicos favoritos.',
    description: [
      'PlayStation 2 modelo Fat (o clássico, de gabinete maior) com OPL instalado e 1 controle sem fio, pronto para reviver os clássicos.',
      'Aparelho usado: veja todas as fotos da galeria para conferir o estado real do console e dos acessórios.',
    ],
    features: ['PlayStation 2 modelo Fat (clássico)', 'OPL instalado', '1 controle sem fio', 'Produto usado'],
    includes: [
      'Console PlayStation 2 Fat com OPL',
      '1 controle sem fio',
      'HD externo com os jogos, cabo USB e cabo de vídeo (conforme fotos)', // TODO: EDITAR — confirme item a item
      'Adaptador PS2 para HDMI (conforme fotos)', // TODO: EDITAR
      'Cartão de memória de 8 MB (conforme fotos)', // TODO: EDITAR
      // TODO: EDITAR — confirme se a fonte/cabo de energia e o item preto ao lado do controle (foto 1) acompanham.
    ],
    conditionNotes: [
      'Produto usado, com marcas normais de uso.',
      'As fotos da galeria mostram o aparelho e os acessórios.',
      // TODO: EDITAR — descreva o que foi testado (leitura, controle, saídas) e qualquer detalhe de desgaste.
      // TODO: EDITAR — o modelo da etiqueta (SCPH-50001) é 120V. Se ele não for bivolt, informe a tensão aqui
      //   para o cliente saber se precisa de transformador em regiões 220V.
    ],
    descriptionImage: ps2Banner,
    images: [
      img('ps2-fat-opl-1-controle-sem-fio', 1, 'PlayStation 2 Fat em pé com controle sem fio, HD externo, adaptador HDMI, cartão de memória e cabos à frente'),
      img('ps2-fat-opl-1-controle-sem-fio', 2, 'Frente do PlayStation 2 Fat preto com entradas USB, de controle e de cartão de memória'),
      img('ps2-fat-opl-1-controle-sem-fio', 3, 'PlayStation 2 Fat visto de cima, com o logo PS2 em azul'),
      img('ps2-fat-opl-1-controle-sem-fio', 4, 'Traseira do PlayStation 2 Fat com etiqueta, ventilação e saídas de vídeo e áudio'),
      oplMenu,
    ],
  },

  // ---------------------------------------------------------------- 8
  {
    id: 'ps3-super-slim',
    slug: 'ps3-super-slim-250-jogos',
    name: 'PlayStation 3 Super Slim',
    variant: 'HD com + de 250 jogos',
    category: 'playstation',
    condition: 'usado',
    available: true, // TODO: EDITAR — confirme se há estoque
    price: 299.9, // TODO: EDITAR — confirme o preço
    shortDescription: 'PlayStation 3 Super Slim completo, com 2 controles e HD com mais de 250 jogos de PS3.',
    description: [
      'PlayStation 3 modelo Super Slim completo, com 2 controles sem fio e HD com mais de 250 jogos de PS3, pronto para jogar com um amigo.',
      'Aparelho usado: veja todas as fotos da galeria para conferir o estado real do console e dos controles.',
    ],
    features: [
      'PlayStation 3 modelo Super Slim',
      'HD com mais de 250 jogos de PS3',
      '2 controles sem fio',
      'Produto usado',
    ],
    includes: [
      'Console PlayStation 3 Super Slim',
      '2 controles sem fio',
      'HD com mais de 250 jogos de PS3',
      'Cabos de energia e de vídeo', // TODO: EDITAR — as fotos não mostram os cabos; confirme o que acompanha
      // TODO: EDITAR — informe a capacidade do HD (GB) se quiser destacar.
    ],
    conditionNotes: [
      'Produto usado, com marcas normais de uso.',
      'As fotos da galeria mostram o aparelho e os controles.',
      // TODO: EDITAR — descreva o que foi testado (leitura, controles, saídas) e qualquer detalhe de desgaste.
    ],
    images: [
      img('ps3-super-slim-250-jogos', 1, 'PlayStation 3 Super Slim preto em pé, com dois controles sem fio à frente'),
      img('ps3-super-slim-250-jogos', 2, 'PlayStation 3 Super Slim preto deitado com dois controles sem fio sobre o console'),
      img('ps3-super-slim-250-jogos', 3, 'PlayStation 3 Super Slim visto de frente, com dois controles sem fio em cima'),
      {
        src: '/images/produtos/ps3-super-slim-250-jogos/4.jpg',
        alt: 'Arte Game Mania: PS3 com HD com mais de 250 jogos de PS3',
        fit: 'contain' as const,
      },
    ],
  },

  // ---------------------------------------------------------------- 9
  {
    id: 'xbox360-fat-rgh',
    slug: 'xbox-360-fat-rgh-500gb',
    name: 'Xbox 360 Fat RGH',
    variant: 'HD 500GB',
    category: 'xbox',
    condition: 'usado', // TODO: EDITAR — confirme se é usado
    available: true, // TODO: EDITAR — confirme se há estoque
    price: 279.9,
    shortDescription: 'Xbox 360 Fat desbloqueado (RGH) com HD de 500GB e controle.',
    description: [
      'Explore mundos incríveis e viva aventuras épicas com o Xbox 360! Este console oferece uma experiência de jogo imersiva com gráficos impressionantes e uma vasta biblioteca de títulos para todos os gostos.',
      'Perfeito para colecionadores e entusiastas de games que buscam diversão sem limites.',
      'Aparelho usado: veja todas as fotos da galeria para conferir o estado real do console e dos acessórios.',
    ],
    features: [
      'Xbox 360 modelo Fat (clássico)',
      'Desbloqueado (RGH)',
      'HD de 500GB',
      'Bivolt (110V/220V)',
      'Produto usado', // TODO: EDITAR
    ],
    includes: [
      'Console Xbox 360 Fat',
      'HD de 500GB',
      'Controle sem fio (conforme fotos)', // TODO: EDITAR — confirme item a item
      'Fonte de energia bivolt (conforme fotos)', // TODO: EDITAR
      // TODO: EDITAR — confirme se os cabos de vídeo/energia acompanham.
    ],
    conditionNotes: [
      'Produto usado, com marcas normais de uso.',
      'As fotos da galeria mostram o aparelho e os acessórios.',
      'Aparelho bivolt: funciona em 110V e 220V, sem precisar de transformador.',
      // TODO: EDITAR — descreva o que foi testado (leitura, controle, saídas) e qualquer detalhe de desgaste.
    ],
    images: [
      img('xbox-360-fat-rgh-500gb', 1, 'Xbox 360 Fat branco deitado com controle sem fio e fonte de energia ao lado'),
      img('xbox-360-fat-rgh-500gb', 2, 'Xbox 360 Fat branco em pé com controle sem fio e fonte de energia'),
      img('xbox-360-fat-rgh-500gb', 3, 'Traseira do Xbox 360 Fat branco com etiqueta e saídas'),
      img('xbox-360-fat-rgh-500gb', 4, 'Xbox 360 Fat branco visto por trás, com controle sem fio ao lado'),
      {
        src: '/images/produtos/xbox-360-fat-rgh-500gb/5.jpg',
        alt: 'Menu do Xbox 360 na TV com a lista de jogos instalados no HD',
        fit: 'contain' as const,
      },
    ],
  },

  // ---------------------------------------------------------------- 10
  {
    id: 'xbox360-slim-rgh-lt3',
    slug: 'xbox-360-slim-rgh-lt3-500gb',
    name: 'Xbox 360 Slim RGH 3.0 e LT3.0',
    variant: 'HD 500GB',
    category: 'xbox',
    condition: 'usado',
    available: true, // TODO: EDITAR — confirme se há estoque
    price: 298.9,
    shortDescription: 'Xbox 360 Slim desbloqueado com RGH 3.0 e LT3.0, HD de 500GB cheio de jogos e controle original.',
    description: [
      'Console Xbox 360 desbloqueado com RGH 3.0, que permite rodar qualquer jogo via HD. Possui também o LT3.0, que permite rodar qualquer jogo via CD.',
      'O aparelho tem HD interno de 500GB com diversos títulos de Xbox 360 e Xbox clássico, além de um emulador de Super Nintendo com 1159 jogos.',
      'O aparelho está impecável, em excelente estado de conservação: foi feita a limpeza interna e a troca da pasta térmica, e toda a carcaça foi higienizada. O controle também foi limpo e higienizado, com troca dos analógicos por novos.',
    ],
    features: [
      'Xbox 360 modelo Slim',
      'Desbloqueado com RGH 3.0 (roda jogos via HD)',
      'LT3.0 (roda jogos via CD)',
      'HD interno de 500GB com títulos de Xbox 360 e Xbox clássico',
      'Emulador de Super Nintendo com 1159 jogos',
      'Limpeza interna e troca da pasta térmica',
      'Bivolt (110V/220V)',
      'Produto usado',
    ],
    includes: [
      'Xbox 360 Slim',
      'HD de 500GB',
      'Controle original Microsoft',
      'Fonte original Microsoft (bivolt)',
      'Caixa do aparelho',
      'Cabos para ligação',
    ],
    conditionNotes: [
      'Produto usado, em excelente estado de conservação.',
      'Limpeza interna completa e troca da pasta térmica.',
      'Carcaça e controle higienizados; analógicos do controle trocados por novos.',
      'Aparelho bivolt: funciona em 110V e 220V, sem precisar de transformador.',
    ],
    images: [
      slim(1, 'Xbox 360 Slim preto com controle em cima, ao lado da caixa do aparelho'),
      slim(2, 'Xbox 360 Slim ligado em frente a uma TV com o menu de jogos, ao lado da caixa e do controle'),
      slim(3, 'Xbox 360 Slim com um jogo de corrida rodando na TV, ao lado da caixa e do controle'),
      slim(4, 'Controle original do Xbox 360 preto segurado na mão'),
      slim(5, 'Detalhe dos botões e dos analógicos do controle do Xbox 360'),
      slim(6, 'Menu do Xbox 360 na TV com a lista de jogos instalados no HD'),
      slim(7, 'Menu do Xbox 360 na TV com a lista de jogos instalados no HD'),
      slim(8, 'Menu do Xbox 360 na TV com a lista de jogos instalados no HD'),
      slim(9, 'Menu do Xbox 360 na TV com a lista de jogos instalados no HD'),
      slim(10, 'Menu do Xbox 360 na TV com a lista de jogos instalados no HD'),
    ],
  },
];
