import Image from 'next/image';
import Link from 'next/link';
import { Clock, Instagram, Mail, MessageCircle } from 'lucide-react';
import { store } from '@/data/store';
import { enabledPaymentMethods } from '@/config/checkout';
import { hasOffers } from '@/lib/catalog';
import { TikTokIcon } from '@/components/ui/TikTokIcon';
import { whatsappUrl } from '@/lib/format';

export function Footer() {
  const wa = whatsappUrl();
  const { contact, company } = store;
  const year = new Date().getFullYear();

  const shop = [
    { label: 'Início', href: '/' },
    { label: 'Produtos', href: '/#produtos' },
    ...(hasOffers() ? [{ label: 'Ofertas', href: '/categoria/ofertas' }] : []),
    { label: 'Sobre nós', href: '/#sobre' },
    { label: 'Contato', href: '/#contato' },
  ];
  const legal = [
    { label: 'Política de privacidade', href: '/politica-de-privacidade' },
    { label: 'Termos de uso', href: '/termos-de-uso' },
    { label: 'Política de troca e devolução', href: '/politica-de-troca' },
  ];

  const linkCls = 'text-white/65 transition hover:text-accent';

  return (
    <footer className="mt-24 border-t border-white/10 bg-black" id="rodape">
      <div className="container-x grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <Image src="/logo.webp" alt={`${store.name} — ${store.tagline}`} width={665} height={595} className="h-32 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">{store.about.text}</p>
        </div>

        <nav aria-label="Loja">
          <h2 className="mb-4 font-display text-base font-semibold text-white">Loja</h2>
          <ul className="space-y-3 text-sm">
            {shop.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Institucional">
          <h2 className="mb-4 font-display text-base font-semibold text-white">Institucional</h2>
          <ul className="space-y-3 text-sm">
            {legal.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div id="contato">
          <h2 className="mb-4 font-display text-base font-semibold text-white">Atendimento</h2>
          <ul className="space-y-3 text-sm">
            {wa && (
              <li className="flex items-center gap-3">
                <MessageCircle className="size-4 text-accent" aria-hidden />
                <a href={wa} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  WhatsApp
                </a>
              </li>
            )}
            {contact.instagram && (
              <li className="flex items-center gap-3">
                <Instagram className="size-4 text-accent" aria-hidden />
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  Instagram
                </a>
              </li>
            )}
            {contact.tiktok && (
              <li className="flex items-center gap-3">
                <TikTokIcon className="size-4 text-accent" />
                <a href={contact.tiktok} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  TikTok
                </a>
              </li>
            )}
            {contact.email && (
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-accent" aria-hidden />
                <a href={`mailto:${contact.email}`} className={linkCls}>
                  {contact.email}
                </a>
              </li>
            )}
            {contact.hours && (
              <li className="flex items-center gap-3">
                <Clock className="size-4 text-accent" aria-hidden />
                <span className="text-white/65">{contact.hours}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-4 py-6 text-xs leading-relaxed text-white/45 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl space-y-1.5">
            <p>
              © {year} {company.legalName || store.name}. Todos os direitos reservados.
              {company.cnpj && <> CNPJ {company.cnpj}.</>}
              {company.address && <> {company.address}.</>}
            </p>
            <p>
              PlayStation e DualSense são marcas de seus respectivos proprietários. A {store.name} é uma loja independente e não é
              afiliada à Sony Interactive Entertainment.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2" aria-label="Formas de pagamento">
            {enabledPaymentMethods().map((m) => (
              <li key={m.id} className="rounded-full border border-white/15 px-3 py-1 text-white/60">
                {m.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
