'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, CircleAlert, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { brl } from '@/lib/format';
import { fetchPaymentStatus } from '@/lib/payments/client';
import type { PixPaymentData } from '@/lib/payments/types';

/** AAAA-MM-DD → DD/MM/AAAA */
function formatDate(iso?: string) {
  const m = iso && /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : undefined;
}

/**
 * Mostra o QR Code e o "copia e cola" do Pix e consulta o pagamento até ele cair.
 * A consulta roda a cada 5 s (a cada 15 s depois de 5 minutos) e também quando o
 * cliente volta para a aba, por exemplo depois de pagar no app do banco.
 */
export function PixPayment({
  pix,
  onPaid,
  onBack,
}: {
  pix: PixPaymentData;
  onPaid: (receiptUrl?: string) => void;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const onPaidRef = useRef(onPaid);
  onPaidRef.current = onPaid;

  const canPoll = Boolean(pix.secureId);

  useEffect(() => {
    if (!canPoll) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const startedAt = Date.now();

    const check = async () => {
      try {
        const res = await fetchPaymentStatus(pix.transactionId, pix.secureId);
        if (stopped) return;
        if (res.status === 'paid') {
          stopped = true;
          onPaidRef.current(res.receiptUrl);
          return;
        }
        if (res.status === 'failed') {
          stopped = true;
          setFailed(true);
          return;
        }
      } catch {
        /* sem internet por um instante: tenta de novo no próximo ciclo */
      }
      if (stopped) return;
      const delay = Date.now() - startedAt < 5 * 60_000 ? 5_000 : 15_000;
      timer = setTimeout(check, delay);
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible' && !stopped) {
        if (timer) clearTimeout(timer);
        check();
      }
    };

    check();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [canPoll, pix.transactionId, pix.secureId]);

  const copy = useCallback(async () => {
    if (!pix.code) return;
    try {
      await navigator.clipboard.writeText(pix.code);
    } catch {
      // Navegadores antigos / sem permissão: seleciona o texto para o cliente copiar manualmente.
      const field = document.getElementById('pix-code') as HTMLTextAreaElement | null;
      field?.select();
      document.execCommand?.('copy');
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [pix.code]);

  const validUntil = formatDate(pix.expirationDate);

  if (failed) {
    return (
      <div className="container-x pb-8 pt-8 lg:pt-12">
        <div className="card mx-auto flex max-w-xl flex-col items-center gap-5 px-6 py-14 text-center" role="alert">
          <span className="grid size-20 place-items-center rounded-full border border-red-400/40 bg-red-500/10">
            <CircleAlert className="size-9 text-red-300" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tight">Este Pix expirou ou foi cancelado</h1>
            <p className="mt-3 text-white/65">Nenhuma cobrança foi feita. Volte ao checkout para gerar um novo Pix.</p>
          </div>
          <button type="button" onClick={onBack} className="btn btn-primary">
            Voltar ao checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x pb-8 pt-8 lg:pt-12">
      <div className="card mx-auto max-w-xl space-y-6 p-5 text-center sm:p-8">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight sm:text-3xl">Pague com Pix</h1>
          <p className="mt-2 font-display text-3xl font-bold text-accent">{brl(pix.amount)}</p>
          <p className="mt-2 text-sm text-white/60">Pedido nº {pix.transactionId}</p>
        </div>

        {pix.qrImage && (
          <div className="mx-auto w-fit rounded-card bg-white p-3">
            {/* data URL gerada no servidor: <img> simples, sem otimização do next/image */}
            <img src={pix.qrImage} alt="QR Code do Pix" width={240} height={240} className="size-56 sm:size-60" />
          </div>
        )}

        {pix.code && (
          <div className="space-y-3 text-left">
            <label htmlFor="pix-code" className="block text-sm font-medium text-white/80">
              Pix copia e cola
            </label>
            <textarea
              id="pix-code"
              readOnly
              rows={3}
              value={pix.code}
              onFocus={(e) => e.currentTarget.select()}
              className="field h-auto w-full resize-none break-all py-3 text-xs leading-relaxed"
            />
            <button type="button" onClick={copy} className="btn btn-primary w-full">
              {copied ? <Check className="size-5" aria-hidden /> : <Copy className="size-5" aria-hidden />}
              {copied ? 'Código copiado!' : 'Copiar código Pix'}
            </button>
          </div>
        )}

        <ol className="space-y-1.5 text-left text-sm text-white/60">
          <li>1. Abra o app do seu banco e escolha pagar com Pix.</li>
          <li>2. Escaneie o QR Code ou cole o código copiado.</li>
          <li>3. Confirme o pagamento. Esta tela atualiza sozinha quando o Pix cair.</li>
        </ol>

        <div className="flex items-center justify-center gap-2 rounded-control border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70" role="status">
          {canPoll ? <Loader2 className="size-4 animate-spin text-accent" aria-hidden /> : null}
          {canPoll ? 'Aguardando o pagamento…' : 'Depois de pagar, guarde o comprovante do seu banco.'}
        </div>

        {validUntil && <p className="text-xs text-white/45">Este Pix é válido até {validUntil}.</p>}

        {pix.paymentUrl && (
          <a href={pix.paymentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-accent underline underline-offset-4">
            Abrir página de pagamento <ExternalLink className="size-3.5" aria-hidden />
          </a>
        )}
      </div>
    </div>
  );
}
