import { NextResponse } from 'next/server';
import { getBeehiveTransaction, mapPaymentStatus } from '@/lib/payments/beehive';
import type { PaymentStatusResponse } from '@/lib/payments/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const json = (body: PaymentStatusResponse, status = 200) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

/**
 * Consulta o status de um pagamento (usada pela tela do Pix enquanto o cliente paga).
 * Exige o id E o secureId (UUID) da transação: sem o secureId, ninguém consegue
 * descobrir o status de pedidos alheios só trocando o número do id.
 */
export async function GET(req: Request) {
  if (process.env.PAYMENT_GATEWAY !== 'beehive') return json({ status: 'unknown' }, 404);

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));
  const secureId = searchParams.get('s') ?? '';
  if (!Number.isInteger(id) || id <= 0 || secureId.length < 8 || secureId.length > 64) return json({ status: 'unknown' }, 400);

  const tx = await getBeehiveTransaction(id);
  if (!tx || tx.secureId !== secureId) return json({ status: 'unknown' }, 404);

  const status = mapPaymentStatus(tx.status);
  return json({ status, receiptUrl: status === 'paid' ? tx.secureUrl : undefined });
}
