import { checkoutConfig } from '@/config/checkout';
import { beehiveGateway } from '@/lib/payments/beehive';
import { placeholderGateway, type PaymentGateway } from '@/lib/payments/gateway';
import { pagarmeGateway } from '@/lib/payments/pagarme';

/**
 * ============================================================
 * ONDE CONECTAR O GATEWAY DE PAGAMENTO
 * ------------------------------------------------------------
 * O gateway da Beehive Pay está em lib/payments/beehive.ts.
 * Para ativar:
 * 1. Na Vercel, defina PAYMENT_GATEWAY=beehive, BEEHIVE_SECRET_KEY e
 *    NEXT_PUBLIC_BEEHIVE_PUBLIC_KEY (veja .env.example).
 * 2. Em config/checkout.ts, deixe paymentsEnabled como true.
 * Enquanto isso, o checkout usa o gateway provisório: monta o
 * pedido e avisa que o pagamento será ativado em breve, sem cobrar
 * nada.
 *
 * (lib/payments/pagarme.ts é o gateway antigo; pode ser apagado se
 * você não for mais usá-lo.)
 * ============================================================
 */
export function getGateway(): PaymentGateway {
  if (!checkoutConfig.paymentsEnabled) return placeholderGateway;
  switch (process.env.PAYMENT_GATEWAY) {
    case 'beehive':
      return beehiveGateway;
    case 'pagarme':
      return pagarmeGateway;
    default:
      return placeholderGateway;
  }
}
