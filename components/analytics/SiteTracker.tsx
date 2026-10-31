'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** Avisa o servidor (aparece nos Logs da Vercel): entrou, clicou, saiu. Nunca atrapalha a loja. */
function send(data: Record<string, unknown>) {
  try {
    const body = JSON.stringify(data);
    const ok = navigator.sendBeacon?.('/api/track', new Blob([body], { type: 'application/json' }));
    if (!ok) fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
  } catch {
    /* ignora */
  }
}

export function SiteTracker() {
  const pathname = usePathname();
  const first = useRef(true);

  // Entrou: na primeira página (com a origem) e a cada troca de página
  useEffect(() => {
    const origem = first.current ? document.referrer || window.location.search || 'direto' : 'navegando na loja';
    first.current = false;
    send({ evento: 'entrou', pagina: pathname, origem });
  }, [pathname]);

  // Clicou em botão/link e saiu (fechou ou trocou de aba)
  useEffect(() => {
    const t0 = Date.now();
    const onHide = () => {
      if (document.visibilityState === 'hidden') {
        send({ evento: 'saiu', pagina: window.location.pathname, segundos: Math.round((Date.now() - t0) / 1000) });
      }
    };
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.('button, a') as HTMLElement | null;
      const texto = (el?.innerText?.trim() || el?.getAttribute('aria-label') || '').replace(/\s+/g, ' ');
      if (texto) send({ evento: 'clicou', pagina: window.location.pathname, texto });
    };
    document.addEventListener('visibilitychange', onHide);
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      document.removeEventListener('click', onClick, true);
    };
  }, []);

  return null;
}
