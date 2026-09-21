import type { CheckoutPayload, CheckoutResult, PaymentStatusResponse } from '@/lib/payments/types';

/** Chamada do navegador para a rota de API do checkout (app/api/checkout). */
export async function submitCheckout(payload: CheckoutPayload): Promise<CheckoutResult> {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as CheckoutResult;
  return data;
}

/** Consulta o status do pagamento (Pix) em app/api/checkout/status. */
export async function fetchPaymentStatus(transactionId: number, secureId: string): Promise<PaymentStatusResponse> {
  const qs = new URLSearchParams({ id: String(transactionId), s: secureId });
  const res = await fetch(`/api/checkout/status?${qs.toString()}`, { cache: 'no-store' });
  return (await res.json()) as PaymentStatusResponse;
}
