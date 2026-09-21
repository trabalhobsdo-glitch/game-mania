import type { FaqItem, Product } from '@/lib/types';

/**
 * ============================================================
 * PERGUNTAS FREQUENTES (home)
 * Edite as respostas livremente. TODO: EDITAR — confira se batem com a sua operação.
 * ============================================================
 */
export const faq: FaqItem[] = [
  {
    q: 'Quais formas de pagamento estão disponíveis?',
    a: 'Aceitamos Pix e cartão de crédito, processados com segurança pela Beehive Pay. As opções aparecem na etapa de pagamento do checkout.',
  },
  {
    q: 'Vocês enviam para todo o Brasil?',
    a: 'Sim, enviamos para todo o Brasil pelos Correios. Você escolhe entre PAC (7 a 10 dias úteis, R$ 16,93) e SEDEX (5 a 7 dias úteis, R$ 39,54) no checkout.',
  },
  {
    q: 'Como acompanho meu pedido?',
    a: 'Depois que o pedido for despachado, enviamos o código de rastreamento pelos canais de contato informados na compra. Se precisar, fale com o nosso atendimento.',
  },
  {
    q: 'Os produtos possuem garantia?',
    a: 'As condições de garantia dependem do produto (novo ou usado) e ficam descritas na página de cada item. Em compras pela internet você também pode desistir em até 7 dias após o recebimento, conforme o Código de Defesa do Consumidor.',
  },
  {
    q: 'Como funciona a compra?',
    a: 'Escolha o produto, confira as fotos e a condição (novo ou usado), adicione ao carrinho e siga para o checkout. Lá você informa seus dados, o endereço de entrega e escolhe a forma de pagamento.',
  },
];

/** Perguntas que aparecem em toda página de produto (além das de cada produto). */
export function productFaq(product: Product): FaqItem[] {
  const base: FaqItem[] = [
    {
      q: 'O produto é novo ou usado?',
      a:
        product.condition === 'novo'
          ? 'Este produto é novo.'
          : 'Este produto é usado. Confira as fotos da galeria e a seção "Estado do produto" nesta página.',
    },
    {
      q: 'Como funciona o envio?',
      a: 'Enviamos para todo o Brasil pelos Correios. Você escolhe entre PAC (7 a 10 dias úteis) e SEDEX (5 a 7 dias úteis) no checkout.',
    },
    {
      q: 'Posso desistir da compra?',
      a: 'Sim. Em compras feitas pela internet, você pode desistir em até 7 dias após o recebimento, conforme o Código de Defesa do Consumidor. Veja a Política de troca e devolução.',
    },
  ];
  return [...(product.faq ?? []), ...base];
}
