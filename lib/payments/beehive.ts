import { isIP } from 'node:net';
import QRCode from 'qrcode';
import { checkoutConfig } from '@/config/checkout';
import { displayName } from '@/lib/catalog';
import { onlyDigits } from '@/lib/format';
import type { PaymentGateway } from '@/lib/payments/gateway';
import type { CheckoutResult, PaymentStatusResponse } from '@/lib/payments/types';

/**
 * ============================================================
 * GATEWAY BEEHIVE PAY (Pix e Cartão de crédito)
 * ------------------------------------------------------------
 * Documentação oficial: https://paybeehive.readme.io
 *
 * COMO ATIVAR:
 * 1. No painel da Beehive (https://app.conta.paybeehive.com.br), vá em
 *    Configurações → Credenciais de API e copie a chave secreta e a
 *    chave pública.
 * 2. Na Vercel (Settings → Environment Variables), defina:
 *      PAYMENT_GATEWAY=beehive
 *      BEEHIVE_SECRET_KEY=...               (segredo, só no servidor)
 *      NEXT_PUBLIC_BEEHIVE_PUBLIC_KEY=...   (chave pública, usada no navegador)
 *    Depois faça um novo deploy (as variáveis NEXT_PUBLIC_ só entram no build).
 * 3. Em config/checkout.ts, deixe paymentsEnabled como true.
 *
 * COMO FUNCIONA:
 * - Pix: o servidor cria a transação e devolve o QR Code / "copia e cola"
 *   para a loja exibir. A tela consulta o status até o pagamento cair.
 * - Cartão: o navegador troca os dados do cartão por um token usando a
 *   biblioteca da Beehive (lib/payments/beehive-browser.ts). Só o token
 *   chega aqui — o número do cartão NUNCA passa pelo nosso servidor.
 * - Valores: a API trabalha em centavos. O total enviado é recalculado
 *   aqui a partir do catálogo (nunca vem do navegador).
 * - Frete: a Beehive NÃO soma shipping.fee ao total, então o frete entra
 *   no valor total como um item separado ("Frete PAC/SEDEX").
 * ============================================================
 */

const DEFAULT_API = 'https://api.conta.paybeehive.com.br/v1';
const REQUEST_TIMEOUT_MS = 20_000;
/** Validade do Pix, em dias (a Beehive trabalha com dias, não com horas). */
const PIX_EXPIRES_IN_DAYS = 1;

/** Só os campos da resposta da Beehive que a loja usa. */
export interface BeehiveTransaction {
  id: number;
  status: string;
  amount: number;
  paymentMethod?: string;
  secureId?: string;
  secureUrl?: string;
  pix?: { qrcode?: string; url?: string; expirationDate?: string } | null;
  refusedReason?: { description?: string; acquirerCode?: string } | null;
}

const apiBase = () => (process.env.BEEHIVE_API_URL || DEFAULT_API).replace(/\/$/, '');

function authHeader() {
  const key = process.env.BEEHIVE_SECRET_KEY;
  if (!key) throw new Error('BEEHIVE_SECRET_KEY não configurada.');
  // Basic Auth: "CHAVE_SECRETA:x" em base64, como na documentação da Beehive.
  return 'Basic ' + Buffer.from(`${key}:x`).toString('base64');
}

function beehiveRequest(path: string, init: RequestInit = {}) {
  return fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: authHeader(),
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

const toCents = (reais: number) => Math.round(reais * 100);
const fail = (message: string): CheckoutResult => ({ status: 'error', message });

/** Traduz o status da Beehive para o que a tela do Pix precisa saber. */
export function mapPaymentStatus(status: string): PaymentStatusResponse['status'] {
  switch (status) {
    case 'paid':
      return 'paid';
    case 'waiting_payment':
    case 'processing':
    case 'authorized':
    case 'partially_paid':
      return 'waiting';
    case 'refused':
    case 'canceled':
    case 'refunded':
    case 'chargedback':
    case 'in_protest':
      return 'failed';
    default:
      return 'unknown';
  }
}

/** Consulta uma transação na Beehive (GET /transactions/{id}). Devolve null se falhar. */
export async function getBeehiveTransaction(id: number): Promise<BeehiveTransaction | null> {
  try {
    const res = await beehiveRequest(`/transactions/${id}`);
    if (!res.ok) {
      console.error('[beehive] consulta de transação falhou', { id, status: res.status });
      return null;
    }
    return (await res.json()) as BeehiveTransaction;
  } catch (err) {
    console.error('[beehive] erro ao consultar transação', { id, error: err instanceof Error ? err.message : err });
    return null;
  }
}

/** Mensagem do erro devolvido pela Beehive (formato não é fixo na documentação). */
function extractDetail(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const d = data as Record<string, unknown>;
  const pick = (v: unknown): string | undefined => {
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) return v.map(pick).filter(Boolean).join(' ') || undefined;
    if (v && typeof v === 'object') return Object.values(v as object).map(pick).filter(Boolean).join(' ') || undefined;
    return undefined;
  };
  const text = pick(d.message) ?? pick(d.error) ?? pick(d.errors) ?? pick(d.details);
  return text && text.length <= 160 ? text : undefined;
}

/**
 * Descobre o "copia e cola" e a imagem do QR a partir da resposta.
 * A documentação não detalha se pix.qrcode é o código ou a imagem, então
 * aceitamos as duas formas e geramos o QR aqui quando só vier o código.
 */
async function resolvePixDisplay(tx: BeehiveTransaction) {
  const raw = [tx.pix?.qrcode, tx.pix?.url]
    .filter((v): v is string => typeof v === 'string')
    .map((v) => v.trim())
    .filter(Boolean);

  const code = raw.find((v) => v.startsWith('000201')); // início de todo BR Code do Pix
  let qrImage = raw.find((v) => v.startsWith('data:image/'));
  if (!qrImage) {
    const base64 = raw.find((v) => /^iVBOR/.test(v)); // PNG em base64 sem o prefixo data:
    if (base64) qrImage = `data:image/png;base64,${base64}`;
  }
  if (code && !qrImage) {
    try {
      qrImage = await QRCode.toDataURL(code, { errorCorrectionLevel: 'M', margin: 1, width: 360 });
    } catch {
      /* sem imagem: a tela ainda mostra o copia e cola */
    }
  }
  return { code, qrImage };
}

function resolveInstallments(requested: unknown): number {
  const { enabled, max } = checkoutConfig.installments;
  if (!enabled) return 1;
  const n = Math.floor(Number(requested));
  return Number.isFinite(n) && n >= 1 && n <= max ? n : 1;
}

export const beehiveGateway: PaymentGateway = {
  id: 'beehive',
  async createPayment({ order, payload, ip }): Promise<CheckoutResult> {
    const { customer, address, paymentMethod } = payload;

    if (order.lines.length === 0) return fail('Carrinho vazio.');

    // Itens em centavos. O total é a soma dos itens (produtos + frete), sempre consistente.
    const items: { title: string; unitPrice: number; quantity: number; tangible: boolean; externalRef: string }[] =
      order.lines.map((l) => ({
        title: displayName(l.product).slice(0, 120),
        unitPrice: toCents(l.product.price),
        quantity: l.quantity,
        tangible: true,
        externalRef: l.product.slug,
      }));
    const shippingCents = order.shipping.amount ? toCents(order.shipping.amount) : 0;
    if (shippingCents > 0) {
      items.push({ title: `Frete ${order.shipping.label}`.trim(), unitPrice: shippingCents, quantity: 1, tangible: false, externalRef: 'frete' });
    }
    const amount = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    if (amount <= 0) return fail('Não foi possível calcular o total do pedido.');

    const shippingAddress: Record<string, string> = {
      street: address.street.trim(),
      streetNumber: address.number.trim(),
      zipCode: onlyDigits(address.cep),
      neighborhood: address.district.trim(),
      city: address.city.trim(),
      state: address.state,
      country: 'br',
    };
    if (address.complement.trim()) shippingAddress.complement = address.complement.trim();

    const body: Record<string, unknown> = {
      amount,
      paymentMethod: paymentMethod === 'pix' ? 'pix' : 'credit_card',
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim(),
        document: { number: onlyDigits(customer.cpf), type: 'cpf' },
        phone: onlyDigits(customer.phone),
      },
      items,
      shipping: { fee: shippingCents, address: shippingAddress },
      traceable: false,
    };
    if (ip && isIP(ip)) body.ip = ip;

    if (paymentMethod === 'pix') {
      body.pix = { expiresInDays: PIX_EXPIRES_IN_DAYS };
    } else {
      const token = payload.cardToken?.trim();
      if (!token) return fail('Não foi possível ler os dados do cartão. Confira e tente novamente.');
      body.card = { hash: token };
      body.installments = resolveInstallments(payload.installments);
    }

    let res: Response;
    try {
      res = await beehiveRequest('/transactions', { method: 'POST', body: JSON.stringify(body) });
    } catch (err) {
      console.error('[beehive] falha de conexão ao criar transação', err instanceof Error ? err.message : err);
      return fail('Não foi possível conectar ao pagamento agora. Tente novamente em instantes.');
    }

    const data: unknown = await res.json().catch(() => null);
    if (!res.ok || !data || typeof data !== 'object') {
      // Log completo no servidor (aparece em "Logs" do projeto na Vercel) para diagnóstico.
      console.error('[beehive] erro na criação da transação', { status: res.status, body: data });
      if (res.status === 401 || res.status === 403) return fail('Pagamento indisponível no momento. Fale com o atendimento da loja.');
      if (res.status === 429) return fail('Muitas tentativas seguidas. Aguarde um instante e tente novamente.');
      if (res.status === 400 || res.status === 422) {
        const detail = extractDetail(data);
        return fail(`Não foi possível processar o pagamento. Confira os dados informados e tente novamente.${detail ? ` (${detail})` : ''}`);
      }
      return fail('Não foi possível iniciar o pagamento agora. Tente novamente em instantes.');
    }

    const tx = data as BeehiveTransaction;

    // ---------- Pix ----------
    if (paymentMethod === 'pix') {
      if (tx.status === 'refused' || tx.status === 'canceled') return fail('Não foi possível gerar o Pix. Tente novamente.');
      const { code, qrImage } = await resolvePixDisplay(tx);
      if (!code && !qrImage) {
        // Plano B: página de pagamento hospedada pela Beehive.
        const hosted = tx.secureUrl || (tx.pix?.url && /^https?:\/\//.test(tx.pix.url) ? tx.pix.url : undefined);
        if (hosted) return { status: 'redirect', url: hosted };
        console.error('[beehive] Pix criado, mas a resposta não trouxe QR Code utilizável', { id: tx.id });
        return fail('O Pix foi gerado, mas não conseguimos exibir o QR Code. Tente novamente.');
      }
      return {
        status: 'pix',
        pix: {
          transactionId: tx.id,
          secureId: tx.secureId ?? '',
          amount: (typeof tx.amount === 'number' ? tx.amount : amount) / 100,
          code,
          qrImage,
          expirationDate: tx.pix?.expirationDate,
          paymentUrl: tx.secureUrl,
        },
      };
    }

    // ---------- Cartão ----------
    switch (tx.status) {
      case 'paid':
        return { status: 'paid', transactionId: tx.id, receiptUrl: tx.secureUrl };
      case 'authorized':
      case 'processing':
      case 'waiting_payment':
      case 'partially_paid':
        return {
          status: 'processing',
          transactionId: tx.id,
          receiptUrl: tx.secureUrl,
          message: 'Estamos confirmando o pagamento com o banco. Guarde o número do pedido e, se precisar, fale com o nosso atendimento.',
        };
      case 'refused':
        console.error('[beehive] cartão recusado', { id: tx.id, reason: tx.refusedReason });
        return fail('O pagamento foi recusado pelo banco emissor. Confira os dados, tente outro cartão ou pague com Pix.');
      default:
        console.error('[beehive] status inesperado no cartão', { id: tx.id, status: tx.status });
        return fail('Não foi possível confirmar o pagamento. Tente novamente ou pague com Pix.');
    }
  },
};
