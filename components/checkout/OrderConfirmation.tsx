import Link from 'next/link';
import { CircleCheck, Clock } from 'lucide-react';
import { SupportLink } from '@/components/layout/SupportLink';

/** Tela mostrada depois que o pagamento foi aprovado (ou está sendo confirmado). */
export function OrderConfirmation({
  transactionId,
  receiptUrl,
  pending,
  message,
}: {
  transactionId?: number;
  receiptUrl?: string;
  pending?: boolean;
  message?: string;
}) {
  const Icon = pending ? Clock : CircleCheck;
  return (
    <div className="container-x pb-8 pt-8 lg:pt-12">
      <div className="card mx-auto flex max-w-xl flex-col items-center gap-5 px-6 py-14 text-center" role="status">
        <span className="grid size-20 place-items-center rounded-full border border-accent/40 bg-accent/10">
          <Icon className="size-9 text-accent" aria-hidden />
        </span>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight sm:text-3xl">
            {pending ? 'Pagamento em análise' : 'Pagamento confirmado!'}
          </h1>
          {transactionId ? <p className="mt-2 font-display text-lg text-accent">Pedido nº {transactionId}</p> : null}
          <p className="mt-3 text-white/65">
            {message ??
              'Recebemos o seu pagamento. Vamos preparar o seu pedido e enviar o código de rastreamento pelos contatos informados na compra.'}
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {receiptUrl && (
            <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              Ver comprovante
            </a>
          )}
          <Link href="/" className="btn btn-primary">
            Voltar à loja
          </Link>
        </div>
        <SupportLink className="text-sm text-white/55 underline underline-offset-4 hover:text-white">Precisa de ajuda? Fale com a gente</SupportLink>
      </div>
    </div>
  );
}
