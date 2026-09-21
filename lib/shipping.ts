import { checkoutConfig } from '@/config/checkout';

export interface ShippingOption {
  id: string;
  label: string;
  /** Valor cheio da modalidade, antes do frete grátis (se configurado). */
  price: number;
  daysMin: number;
  daysMax: number;
}

export interface ShippingQuote {
  /** null = a combinar (não entra no total) */
  amount: number | null;
  label: string;
  /** Prazo em dias úteis, formatado, quando aplicável (ex.: "7 a 10 dias úteis"). */
  days?: string;
  /** true quando o valor é só uma prévia (ex.: carrinho, antes de escolher no checkout). */
  estimate?: boolean;
}

function applyFreeAbove(subtotal: number, amount: number): number {
  const { freeAbove } = checkoutConfig.shipping;
  if (freeAbove !== null && subtotal >= freeAbove && subtotal > 0) return 0;
  return amount;
}

/**
 * Lista as modalidades dos Correios (PAC/SEDEX) com o valor já aplicando
 * frete grátis, se configurado. Usada no checkout para o cliente escolher.
 */
export function getShippingOptions(subtotal: number): (ShippingOption & { amount: number })[] {
  if (checkoutConfig.shipping.mode !== 'correios') return [];
  return checkoutConfig.shipping.options.map((o) => ({ ...o, amount: applyFreeAbove(subtotal, o.price) }));
}

/**
 * Calcula o frete conforme config/checkout.ts.
 *
 * Modo 'correios': passe o `methodId` escolhido pelo cliente (PAC ou SEDEX) para
 * cobrar o valor certo. Sem `methodId` (ex.: no carrinho, antes do checkout),
 * devolve a modalidade mais barata como prévia (`estimate: true`).
 *
 * PONTO DE INTEGRAÇÃO: para calcular automaticamente por CEP e peso via API dos
 * Correios/Melhor Envio em vez de valores fixos, troque esta função por uma
 * chamada a uma rota de API (app/api/frete) que consulte o serviço e devolva
 * as modalidades com valor e prazo.
 */
export function getShipping(subtotal: number, state?: string, methodId?: string): ShippingQuote {
  const { mode, fixedPrice, byState } = checkoutConfig.shipping;

  if (mode === 'correios') {
    const options = getShippingOptions(subtotal);
    if (options.length === 0) return { amount: null, label: 'A combinar' };
    const chosen = (methodId && options.find((o) => o.id === methodId)) || options[0];
    return {
      amount: chosen.amount,
      label: chosen.amount === 0 ? 'Grátis' : chosen.label,
      days: `${chosen.daysMin} a ${chosen.daysMax} dias úteis`,
      estimate: !methodId,
    };
  }

  const freeAmount = applyFreeAbove(subtotal, fixedPrice);
  if (freeAmount === 0 && checkoutConfig.shipping.freeAbove !== null) {
    return { amount: 0, label: 'Grátis' };
  }
  if (mode === 'fixed') return { amount: fixedPrice, label: fixedPrice === 0 ? 'Grátis' : '' };
  if (mode === 'by-region' && state && byState[state.toUpperCase()] !== undefined) {
    return { amount: byState[state.toUpperCase()], label: '' };
  }
  return { amount: null, label: 'A combinar' };
}
