import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';

/**
 * ============================================================
 * BANNER DO MENU OPL  —  aparece na Home, logo acima das categorias
 * ------------------------------------------------------------
 * • Trocar a imagem:  substitua public/images/ps2-opl-menu.jpg
 * • Mudar o texto:    edite as linhas abaixo
 * • Tirar o link:     troque <Link href=...> por <div> (e </Link> por </div>)
 * • Remover da Home:  apague <OplBanner /> em components/home/HomeView.tsx
 * ============================================================
 */
export function OplBanner() {
  return (
    <section className="container-x pt-8 lg:pt-12" aria-labelledby="opl-banner-title">
      <Reveal>
        <Link
          href="/categoria/playstation"
          className="group block overflow-hidden rounded-card border border-white/10 bg-black transition duration-300 hover:border-accent/50 hover:shadow-card"
        >
          <span className="relative block">
            <Image
              src="/images/ps2-opl-menu.jpg"
              alt="Menu OPL do PlayStation 2 com a lista de jogos dublados em português"
              width={1500}
              height={1049}
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="h-auto w-full object-contain transition duration-700 group-hover:scale-[1.02]"
            />
          </span>
          <span className="flex flex-col gap-1 border-t border-white/10 bg-white/[0.03] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>
              <span id="opl-banner-title" className="block font-display text-xl font-bold sm:text-2xl">
                Jogos dublados em português
              </span>
              <span className="mt-0.5 block text-sm text-white/55">
                Todos os nossos PlayStation 2 já vêm com o OPL instalado e a lista de jogos pronta para jogar.
              </span>
            </span>
            <span className="mt-2 shrink-0 text-sm font-semibold text-accent sm:mt-0">Ver os PlayStation →</span>
          </span>
        </Link>
      </Reveal>
    </section>
  );
}
