/**
 * ============================================================
 * CONFIGURAÇÕES DE CHECKOUT, PAGAMENTO E FRETE
 * Tudo que muda o comportamento da compra fica neste arquivo.
 * ============================================================
 */

export type PaymentMethodId = 'pix' | 'card';

export const checkoutConfig = {
  currency: 'BRL',

  /** Quantidade máxima de unidades do mesmo produto por pedido. */
  maxQuantityPerOrder: 5,

  /**
   * Gateway de pagamento: Beehive Pay (lib/payments/beehive.ts).
   * Enquanto for false, o checkout monta o pedido, valida os dados e avisa
   * que o pagamento será ativado em breve (nenhuma compra é simulada).
   * Para ativar: defina PAYMENT_GATEWAY=beehive, BEEHIVE_SECRET_KEY e
   * NEXT_PUBLIC_BEEHIVE_PUBLIC_KEY nas variáveis de ambiente da Vercel
   * (veja .env.example), faça um novo deploy e deixe paymentsEnabled como true.
   */
  paymentsEnabled: true,

  /** Métodos exibidos no checkout e nas páginas de produto. Processados pela Beehive Pay. */
  paymentMethods: [
    { id: 'pix', label: 'Pix', enabled: true },
    { id: 'card', label: 'Cartão de crédito', enabled: true },
  ] as { id: PaymentMethodId; label: string; enabled: boolean }[],

  /**
   * Parcelamento no cartão. Só ligue depois de confirmar as condições (e como o juros é cobrado) com a Beehive Pay.
   * TODO: EDITAR
   */
  installments: {
    enabled: false,
    max: 12,
    interestFree: false,
  },

  /**
   * Frete pelos Correios, com valor e prazo fixos por modalidade (o cliente escolhe
   * no checkout). Para trocar valores, prazos ou adicionar/remover uma modalidade,
   * edite a lista abaixo.
   *  - price: valor em reais (ex.: 16.93)
   *  - daysMin / daysMax: prazo em dias úteis, só para exibição
   * Para calcular automaticamente por CEP e peso via API dos Correios/Melhor Envio,
   * veja lib/shipping.ts.
   * TODO: EDITAR
   */
  shipping: {
    mode: 'correios' as 'arrange' | 'fixed' | 'by-region' | 'correios',
    options: [
      { id: 'pac', label: 'PAC', price: 16.93, daysMin: 7, daysMax: 10 },
      { id: 'sedex', label: 'SEDEX', price: 39.54, daysMin: 5, daysMax: 7 },
    ],
    // Usados apenas nos modos 'fixed' e 'by-region' (mantidos para referência futura):
    fixedPrice: 0,
    byState: {} as Record<string, number>, // ex.: { MG: 25, SP: 32.5 }
    /** Frete grátis acima deste valor de subtotal (null = desativado). */
    freeAbove: null as number | null,
  },

  messages: {
    shippingArrange: 'Frete a combinar: o valor será confirmado antes do pagamento.',
    pendingIntegration:
      'O pagamento online será ativado em breve. Seu pedido ainda não foi finalizado e nenhuma cobrança foi feita.',
  },
};

export const enabledPaymentMethods = () => checkoutConfig.paymentMethods.filter((m) => m.enabled);
