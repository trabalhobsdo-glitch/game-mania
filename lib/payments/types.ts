import type { PaymentMethodId } from '@/config/checkout';
import type { CartItem } from '@/lib/types';

export interface CheckoutPayload {
  customer: { name: string; email: string; phone: string; cpf: string };
  address: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    state: string;
  };
  paymentMethod: PaymentMethodId;
  /** id da modalidade de frete escolhida (ex.: 'pac' | 'sedex'), quando aplicável. */
  shippingMethod?: string;
  /** Só slug + quantidade: os preços são sempre recalculados no servidor. */
  items: CartItem[];
  /**
   * Cartão: token gerado NO NAVEGADOR pela biblioteca da Beehive (BeehivePay.encrypt).
   * O número do cartão nunca chega ao nosso servidor.
   */
  cardToken?: string;
  /** Parcelas no cartão. Só é considerado se checkoutConfig.installments.enabled for true. */
  installments?: number;
}

/** Dados para mostrar o pagamento por Pix na própria loja. */
export interface PixPaymentData {
  transactionId: number;
  /** Identificador seguro da transação (usado para consultar o status sem expor outros pedidos). */
  secureId: string;
  /** Total cobrado, em reais. */
  amount: number;
  /** Código "Pix copia e cola". */
  code?: string;
  /** Imagem do QR Code (data URL). */
  qrImage?: string;
  /** Validade do Pix (AAAA-MM-DD), quando informada pela Beehive. */
  expirationDate?: string;
  /** Página de pagamento hospedada pela Beehive (plano B se o QR não puder ser exibido aqui). */
  paymentUrl?: string;
}

export type CheckoutResult =
  | { status: 'pending_integration'; message: string }
  | { status: 'redirect'; url: string }
  | { status: 'pix'; pix: PixPaymentData }
  | { status: 'paid'; transactionId: number; receiptUrl?: string }
  | { status: 'processing'; transactionId: number; receiptUrl?: string; message: string }
  | { status: 'error'; message: string };

/** Resposta da consulta de status usada pela tela do Pix. */
export interface PaymentStatusResponse {
  status: 'paid' | 'waiting' | 'failed' | 'unknown';
  receiptUrl?: string;
}
