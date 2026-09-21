import type { Metadata, Viewport } from 'next';
import '@fontsource/chakra-petch/latin-500.css';
import '@fontsource/chakra-petch/latin-600.css';
import '@fontsource/chakra-petch/latin-700.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import './globals.css';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartProvider } from '@/components/cart/CartProvider';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { store } from '@/data/store';

export const metadata: Metadata = {
  metadataBase: new URL(store.url),
  title: { default: store.seo.title, template: `%s | ${store.name}` },
  description: store.seo.description,
  applicationName: store.name,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: store.name,
    title: store.seo.title,
    description: store.seo.description,
    images: [{ url: '/og.jpg', width: 1408, height: 768, alt: `${store.name} — ${store.tagline}` }],
  },
  twitter: { card: 'summary_large_image', title: store.seo.title, description: store.seo.description, images: ['/og.jpg'] },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: store.name,
    url: store.url,
    logo: `${store.url}/logo.webp`,
    description: store.seo.description,
  };
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col">
        <noscript>
          <style>{'.reveal{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <CartProvider>
          <a href="#conteudo" className="sr-only z-[100] rounded-lg bg-accent px-4 py-2 font-semibold text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
            Pular para o conteúdo
          </a>
          <Header />
          <main id="conteudo" className="flex-1 pt-[var(--header-h)]">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
