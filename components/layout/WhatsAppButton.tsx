'use client';

import { usePathname } from 'next/navigation';
import { whatsappUrl } from '@/lib/format';

/**
 * Botão flutuante do WhatsApp (canto inferior direito).
 * Aparece só na página principal e nas páginas de produto.
 * Some se não houver número em data/store.ts.
 */
export function WhatsAppButton() {
  const pathname = usePathname();
  const wa = whatsappUrl();
  const visivel = pathname === '/' || pathname.startsWith('/produto/');
  if (!wa || !visivel) return null;

  return (
    <a
      href={wa}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a gente no WhatsApp"
      className="fixed bottom-5 right-5 z-[60] flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-transform duration-200 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-6 sm:right-6 sm:size-16"
    >
      <svg viewBox="0 0 32 32" className="size-8 sm:size-9" fill="currentColor" aria-hidden="true">
        <path d="M16.003 3C8.83 3 3 8.827 3 15.994c0 2.292.6 4.53 1.737 6.5L3 29l6.68-1.752a13 13 0 0 0 6.318 1.61h.005c7.17 0 13-5.828 13-12.995 0-3.47-1.352-6.733-3.808-9.187A12.9 12.9 0 0 0 16.003 3Zm0 23.66h-.004a10.8 10.8 0 0 1-5.5-1.506l-.395-.234-3.964 1.04 1.058-3.865-.257-.397a10.78 10.78 0 0 1-1.654-5.7c0-5.96 4.855-10.81 10.82-10.81 2.888 0 5.6 1.126 7.64 3.17a10.74 10.74 0 0 1 3.16 7.646c-.003 5.96-4.857 10.656-10.904 10.656Zm5.93-8.1c-.325-.163-1.923-.95-2.22-1.058-.298-.108-.515-.163-.732.163-.217.325-.84 1.058-1.03 1.275-.19.217-.38.244-.705.08-.325-.162-1.372-.506-2.613-1.612-.966-.862-1.617-1.926-1.807-2.25-.19-.326-.02-.502.143-.664.147-.146.325-.38.488-.57.163-.19.217-.325.325-.542.108-.217.054-.407-.027-.57-.082-.162-.732-1.764-1.003-2.415-.264-.634-.532-.548-.732-.558l-.623-.011c-.217 0-.57.081-.868.407-.298.325-1.139 1.113-1.139 2.714s1.166 3.15 1.329 3.367c.163.217 2.295 3.503 5.56 4.913.777.335 1.383.535 1.856.685.78.248 1.49.213 2.05.129.626-.093 1.923-.786 2.194-1.545.27-.76.27-1.41.19-1.546-.082-.136-.298-.217-.623-.38Z" />
      </svg>
    </a>
  );
}
