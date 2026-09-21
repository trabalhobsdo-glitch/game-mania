/**
 * ============================================================
 * INFORMAÇÕES DA LOJA
 * Nome, contatos, redes sociais, textos institucionais e da home.
 * Campos marcados com "TODO: EDITAR" dependem de você.
 * ============================================================
 */

export const store = {
  name: 'GAME MANIA',
  tagline: 'Tudo para gamers!',

  /** URL pública. Defina NEXT_PUBLIC_SITE_URL na Vercel quando tiver o domínio. */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://game-mania.vercel.app',

  seo: {
    title: 'Game Mania | Games, Consoles e Acessórios',
    description:
      'Consoles, games e acessórios para você voltar a jogar seus clássicos favoritos. PlayStation, Game Stick e mais, com envio para todo o Brasil.',
  },

  // ---------- Contatos (deixe vazio o que ainda não existir) ----------
  contact: {
    /** Somente números com DDI+DDD. Ex.: 5531999999999 */ // TODO: EDITAR
    whatsapp: '',
    whatsappMessage: 'Olá! Vim pela loja GAME MANIA e gostaria de ajuda.',
    /** URL completa. Ex.: https://instagram.com/sualoja */ // TODO: EDITAR
    instagram: '',
    /** Perfil do TikTok (URL completa). */
    tiktok: 'https://www.tiktok.com/@gamemania',
    email: 'gamemania@gmail.com',
    hours: 'Sempre aberto',
  },

  // ---------- Dados da empresa (rodapé e páginas legais) ----------
  company: {
    legalName: '', // TODO: EDITAR — razão social
    cnpj: '', // TODO: EDITAR
    address: '', // TODO: EDITAR — opcional
  },

  /**
   * Garantia. Se ficar vazio, a garantia não é citada nas páginas de produto.
   * Escreva exatamente o que você oferece. TODO: EDITAR
   */
  warranty: {
    novo: '',
    usado: '',
  },

  /** Mostra o aviso "texto-modelo" nas páginas legais. Mude para false depois de revisar. */
  legalDraftNotice: true,

  // ---------- Home ----------
  hero: {
    titleLines: ['SEU PRÓXIMO GAME', 'ESTÁ AQUI.'],
    text: 'Consoles, games e acessórios para você voltar a jogar seus clássicos favoritos.',
    primaryCta: 'VER PRODUTOS',
    secondaryCta: 'CONHECER A GAME MANIA',
    /** Produtos (slugs) mostrados nas fotos do hero. Use itens disponíveis. */
    showcase: ['ps2-opl-2-controles-sem-fio', 'game-stick-2', 'ps2-opl-2-controles-com-fio'],
    chips: ['Envio para todo o Brasil', 'Compra segura', 'Produtos selecionados'],
  },

  about: {
    titleLines: ['GAME MANIA,', 'DESDE 2016.'],
    text: 'Uma loja feita por quem gosta de games, para quem gosta de games. Consoles e acessórios para voltar aos clássicos e curtir novas experiências, com transparência do primeiro clique à entrega.',
  },


  trust: {
    title: 'COMPRE COM TRANQUILIDADE',
    items: [
      {
        icon: 'truck',
        title: 'Envio para todo o Brasil',
        text: 'Enviamos para o seu CEP. Prazo e frete confirmados antes do pagamento.',
      },
      {
        icon: 'lock',
        title: 'Compra segura',
        text: 'Conexão protegida e pagamento processado por plataforma especializada.',
      },
      {
        icon: 'card',
        title: 'Pagamento facilitado',
        text: 'Pix ou cartão de crédito, processados com segurança pela Beehive Pay.',
      },
      {
        icon: 'gamepad',
        title: 'Produtos selecionados',
        text: 'Cada item mostra se é novo ou usado, com fotos do aparelho.',
      },
      {
        icon: 'headset',
        title: 'Atendimento ao cliente',
        text: 'Tire suas dúvidas antes e depois da compra.',
      },
    ],
  },

  shipping: {
    headline: 'Envio para todo o Brasil pelos Correios',
    detail: 'PAC (7 a 10 dias úteis) ou SEDEX (5 a 7 dias úteis). Você escolhe a modalidade no checkout.',
  },
} as const;

export type Store = typeof store;
