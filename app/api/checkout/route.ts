import { NextResponse } from 'next/server';
import { enabledPaymentMethods } from '@/config/checkout';
import { buildOrder, validateItems } from '@/lib/order';
import { getGateway } from '@/lib/payments';
import type { CheckoutPayload, CheckoutResult } from '@/lib/payments/types';
import { validateFields } from '@/lib/validation';

export const runtime = 'nodejs';

const reply = (body: CheckoutResult, status = 200) => NextResponse.json(body, { status });

/** IP do cliente (a Vercel envia em x-forwarded-for). Usado só para análise de fraude no gateway. */
function clientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || req.headers.get('x-real-ip') || undefined;
}

export async function POST(req: Request) {
  let body: Partial<CheckoutPayload>;
  try {
    body = await req.json();
  } catch {
    return reply({ status: 'error', message: 'Requisição inválida.' }, 400);
  }

  // 1) Itens: confere produto, disponibilidade e quantidade (preços vêm do catálogo, nunca do navegador)
  const items = validateItems(body.items);
  if (!items.ok) return reply({ status: 'error', message: items.error }, 400);

  // 2) Dados do cliente e endereço
  const c = body.customer;
  const a = body.address;
  if (!c || !a) return reply({ status: 'error', message: 'Dados incompletos.' }, 400);
  const errors = validateFields({
    name: c.name ?? '',
    email: c.email ?? '',
    phone: c.phone ?? '',
    cpf: c.cpf ?? '',
    cep: a.cep ?? '',
    street: a.street ?? '',
    number: a.number ?? '',
    complement: a.complement ?? '',
    district: a.district ?? '',
    city: a.city ?? '',
    state: a.state ?? '',
  });
  if (Object.keys(errors).length > 0) return reply({ status: 'error', message: 'Confira os dados informados.' }, 400);

  // 3) Forma de pagamento: só as habilitadas em config/checkout.ts
  const method = enabledPaymentMethods().find((m) => m.id === body.paymentMethod);
  if (!method) return reply({ status: 'error', message: 'Forma de pagamento indisponível.' }, 400);
  if (method.id === 'card') {
    // O cartão chega como token gerado no navegador — nunca o número do cartão.
    const token = body.cardToken;
    if (typeof token !== 'string' || token.length < 8 || token.length > 2048) {
      return reply({ status: 'error', message: 'Não foi possível ler os dados do cartão. Confira e tente novamente.' }, 400);
    }
  }

  // 4) Cobrança pelo gateway ativo
  const order = buildOrder(items.items, a.state, body.shippingMethod);
  try {
    const result = await getGateway().createPayment({ order, payload: body as CheckoutPayload, ip: clientIp(req) });
    return reply(result, result.status === 'error' ? 502 : 200);
  } catch (err) {
    console.error('[checkout] erro inesperado ao criar o pagamento', err instanceof Error ? err.message : err);
    return reply({ status: 'error', message: 'Não foi possível iniciar o pagamento agora. Tente novamente em instantes.' }, 502);
  }
}
