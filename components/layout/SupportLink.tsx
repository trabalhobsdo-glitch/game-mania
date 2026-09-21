import Link from 'next/link';
import type { ReactNode } from 'react';
import { whatsappUrl } from '@/lib/format';

/**
 * Link de atendimento: abre o WhatsApp se o número estiver em data/store.ts,
 * senão leva à área de contato do rodapé.
 */
export function SupportLink({
  children,
  className,
  label = 'Atendimento',
  onClick,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
  onClick?: () => void;
}) {
  const wa = whatsappUrl();
  if (wa) {
    return (
      <a href={wa} target="_blank" rel="noopener noreferrer" className={className} aria-label={label} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href="/#contato" className={className} aria-label={label} onClick={onClick}>
      {children}
    </Link>
  );
}
