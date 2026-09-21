/**
 * Tokenização do cartão NO NAVEGADOR (biblioteca oficial da Beehive Pay).
 * Doc: https://paybeehive.readme.io/reference/tokenizando-cartao
 *
 * Só importe este arquivo em componentes de cliente ('use client').
 * Variáveis usadas (definidas na Vercel):
 *   NEXT_PUBLIC_BEEHIVE_PUBLIC_KEY  chave pública da Beehive
 *   NEXT_PUBLIC_BEEHIVE_TEST_MODE   "true" para testar com a tokenização em modo de teste
 */

interface BeehivePayLib {
  setPublicKey(key: string): void;
  setTestMode(enabled: boolean): void;
  encrypt(card: { number: string; holderName: string; expMonth: number; expYear: number; cvv: string }): Promise<unknown>;
}

declare global {
  interface Window {
    BeehivePay?: BeehivePayLib;
  }
}

export type TokenizeErrorCode = 'config' | 'load' | 'encrypt';

export class TokenizeError extends Error {
  constructor(public code: TokenizeErrorCode) {
    super(code);
  }
}

const SCRIPT_URL = 'https://api.conta.paybeehive.com.br/v1/js';
let loading: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new TokenizeError('load'));
  if (window.BeehivePay) return Promise.resolve();
  if (!loading) {
    loading = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        loading = null;
        script.remove();
        reject(new TokenizeError('load'));
      };
      document.head.appendChild(script);
    });
  }
  return loading;
}

/** Baixa a biblioteca antes do clique em "Finalizar", para o pagamento ser mais rápido. */
export function preloadBeehive() {
  loadScript().catch(() => {
    /* o erro aparece de verdade só se o cliente tentar pagar */
  });
}

/** Troca os dados do cartão por um token de uso único (vale por poucos minutos). */
export async function tokenizeCard(card: { number: string; holderName: string; expMonth: number; expYear: number; cvv: string }): Promise<string> {
  const publicKey = process.env.NEXT_PUBLIC_BEEHIVE_PUBLIC_KEY;
  if (!publicKey) throw new TokenizeError('config');

  await loadScript();
  const lib = window.BeehivePay;
  if (!lib) throw new TokenizeError('load');

  lib.setPublicKey(publicKey);
  if (process.env.NEXT_PUBLIC_BEEHIVE_TEST_MODE === 'true') lib.setTestMode(true);

  try {
    const result = await lib.encrypt(card);
    const token = typeof result === 'string' ? result : (result as { hash?: string; token?: string } | null)?.hash ?? (result as { token?: string } | null)?.token;
    if (typeof token !== 'string' || !token) throw new TokenizeError('encrypt');
    return token;
  } catch (err) {
    if (err instanceof TokenizeError) throw err;
    throw new TokenizeError('encrypt');
  }
}
