import { checkoutConfig } from '@/config/checkout';
import type { Order } from '@/lib/order';
import type { CheckoutPayload, CheckoutResult } from '@/lib/payments/types';

/**
 * Contrato que qualquer gateway (Beehive Pay, Mercado Pago, Stripe, Yampi…) precisa cumprir.
 * O restante da loja só conhece esta interface.
 */
export interface PaymentGateway {
  id: string;
  createPayment(input: { order: Order; payload: CheckoutPayload; ip?: string }): Promise<CheckoutResult>;
}

/** Gateway provisório: não cobra nada e informa que o pagamento ainda será ativado. */
export const placeholderGateway: PaymentGateway = {
  id: 'placeholder',
  async createPayment() {
    return { status: 'pending_integration', message: checkoutConfig.messages.pendingIntegration };
  },
};
