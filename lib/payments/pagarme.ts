import type { PaymentGateway } from '@/lib/payments/gateway';
import type { CheckoutResult } from '@/lib/payments/types';
import { onlyDigits } from '@/lib/format';

/**
 * ============================================================
 * GATEWAY PAGAR.ME (Pix e Cartão de crédito)
 * ------------------------------------------------------------
 * COMO ATIVAR:
 * 1. Crie uma conta na Pagar.me e pegue a Secret Key em
 *    Configurações → Chaves de API (https://dashboard.pagar.me).
 * 2. Na Vercel, defina:
 *      PAYMENT_GATEWAY=pagarme
 *      PAGARME_SECRET_KEY=sk_...
 * 3. Em config/checkout.ts, mude paymentsEnabled para true.
 *
 * IMPORTANTE SOBRE O CARTÃO:
 * A Pagar.me exige que o número do cartão seja transformado em um
 * "card_token" DENTRO DO NAVEGADOR, usando o Pagar.me.js, antes de
 * chegar até este arquivo — o servidor nunca deve ver o número do
 * cartão. O formulário de checkout desta loja ainda não tem os
 * campos de cartão nem essa tokenização; por isso, pagamento com
 * cartão devolve uma mensagem de erro amigável até esse passo ser
 * implementado. O Pix funciona assim que a chave for configurada.
 * Doc do Pagar.me.js: https://docs.pagar.me/docs/pagarmejs
 *
 * Este arquivo segue a documentação pública da Pagar.me (API v5,
 * /core/v5/orders) em vigor na criação deste projeto. Confira a
 * referência oficial (https://docs.pagar.me/reference) antes de
 * ativar em produção, caso algum campo tenha mudado.
 * ============================================================
 */

const PAGARME_API = 'https://api.pagar.me/core/v5';

function authHeader() {
  const key = process.env.PAGARME_SECRET_KEY;
  if (!key) throw new Error('PAGARME_SECRET_KEY não configurada.');
  return 'Basic ' + Buffer.from(`${key}:`).toString('base64');
}

export const pagarmeGateway: PaymentGateway = {
  id: 'pagarme',
  async createPayment({ order, payload }): Promise<CheckoutResult> {
    const { customer, address, paymentMethod } = payload;
    const phone = onlyDigits(customer.phone);

    const body: Record<string, unknown> = {
      items: order.lines.map((l) => ({
        amount: Math.round(l.product.price * 100),
        description: l.product.name.slice(0, 64),
        quantity: l.quantity,
        code: l.product.slug,
      })),
      customer: {
        name: customer.name,
        email: customer.email,
        type: 'individual',
        document: onlyDigits(customer.cpf),
        document_type: 'CPF',
        phones: {
          mobile_phone: { country_code: '55', area_code: phone.slice(0, 2), number: phone.slice(2) },
        },
        address: {
          line_1: `${address.number}, ${address.street}`,
          line_2: address.complement || '',
          zip_code: onlyDigits(address.cep),
          city: address.city,
          state: address.state,
          country: 'BR',
        },
      },
    };

    if (order.shipping.amount) {
      body.shipping = {
        amount: Math.round(order.shipping.amount * 100),
        description: order.shipping.label,
        address: body.customer && (body as any).customer.address,
      };
    }

    if (paymentMethod === 'pix') {
      body.payments = [{ payment_method: 'pix', pix: { expires_in: 3600 } }];
    } else {
      // Cartão: precisa do card_token gerado no navegador (ver comentário acima).
      const cardToken = (payload as unknown as { cardToken?: string }).cardToken;
      if (!cardToken) {
        return { status: 'error', message: 'Pagamento por cartão ainda não está disponível. Tente pagar com Pix.' };
      }
      body.payments = [
        { payment_method: 'credit_card', credit_card: { operation_type: 'auth_and_capture', installments: 1, card_token: cardToken } },
      ];
    }

    let res: Response;
    try {
      res = await fetch(`${PAGARME_API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: authHeader() },
        body: JSON.stringify(body),
      });
    } catch {
      return { status: 'error', message: 'Não foi possível conectar à Pagar.me. Tente novamente.' };
    }

    const data = await res.json().catch(() => null);
    if (!res.ok || !data) {
      // Log completo no servidor (aparece nos "Logs" do projeto na Vercel) para diagnóstico.
      console.error('[pagarme] erro na criação do pedido', { status: res.status, body: data });
      const detail =
        data?.errors && typeof data.errors === 'object'
          ? Object.values(data.errors).flat().join(' ')
          : undefined;
      const message = [data?.message, detail].filter(Boolean).join(' — ') || `Erro ${res.status} ao falar com a Pagar.me.`;
      return { status: 'error', message: `Pagar.me: ${message}` };
    }

    const charge = data.charges?.[0];
    const qrCodeUrl: string | undefined = charge?.last_transaction?.qr_code_url;
    if (paymentMethod === 'pix' && qrCodeUrl) {
      return { status: 'redirect', url: qrCodeUrl };
    }
    if (charge?.status === 'paid' || charge?.status === 'processing') {
      return { status: 'redirect', url: `/checkout?pedido=${data.id}` };
    }
    return { status: 'error', message: 'O pagamento não foi confirmado pela Pagar.me. Tente novamente.' };
  },
};
