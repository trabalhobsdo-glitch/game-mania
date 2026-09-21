/**
 * Máscaras e validações dos campos do cartão (só no navegador).
 * Os dados digitados aqui NUNCA são enviados ao nosso servidor: o navegador
 * troca tudo por um token da Beehive (lib/payments/beehive-browser.ts).
 */
import { onlyDigits } from '@/lib/format';

export interface CardFields {
  number: string;
  holder: string;
  expiry: string; // MM/AA
  cvv: string;
}

export type CardErrors = Partial<Record<keyof CardFields, string>>;

export const emptyCard: CardFields = { number: '', holder: '', expiry: '', cvv: '' };

export function maskCardNumber(v: string) {
  const d = onlyDigits(v).slice(0, 19);
  return d.replace(/(.{4})/g, '$1 ').trim();
}

export function maskExpiry(v: string) {
  const d = onlyDigits(v).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export const maskCvv = (v: string) => onlyDigits(v).slice(0, 4);

/** Algoritmo de Luhn: pega erros de digitação no número do cartão. */
export function isValidLuhn(number: string) {
  const digits = onlyDigits(number);
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
}

/** "MM/AA" → { month, year (4 dígitos) }, ou null se inválido ou vencido. */
export function parseExpiry(value: string): { month: number; year: number } | null {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return null;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return null;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear || (year === currentYear && month < currentMonth)) return null;
  if (year > currentYear + 20) return null;
  return { month, year };
}

export function validateCard(c: CardFields): CardErrors {
  const e: CardErrors = {};
  if (!isValidLuhn(c.number)) e.number = 'Número do cartão inválido.';
  if (c.holder.trim().split(/\s+/).filter(Boolean).length < 2) e.holder = 'Informe o nome como está no cartão.';
  if (!parseExpiry(c.expiry)) e.expiry = 'Validade inválida ou vencida.';
  if (!/^\d{3,4}$/.test(c.cvv)) e.cvv = 'CVV inválido.';
  return e;
}
