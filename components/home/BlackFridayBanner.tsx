import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';

/**
 * ============================================================
 * BANNER BLACK FRIDAY  —  aparece na Home, logo abaixo do "SEU PRÓXIMO GAME ESTÁ AQUI."
 * ------------------------------------------------------------
 * • Trocar a imagem:  substitua public/images/banner-black-friday.jpg
 * • Mudar o link:     edite o href abaixo
 * • Remover da Home:  apague <BlackFridayBanner /> em components/home/HomeView.tsx
 * ============================================================
 */
export function BlackFridayBanner() {
  return (
    <section className="container-x pb-2 lg:pb-4" aria-label="Promoção Black Friday de PlayStations">
      <Reveal>
        <Link
          href="/categoria/playstation"
          className="group block overflow-hidden rounded-card border border-white/10 bg-black transition duration-300 hover:border-accent/50 hover:shadow-card"
        >
          <Image
            src="/images/banner-black-friday.jpg"
            alt="Black Friday: confira os PlayStations disponíveis"
            width={1672}
            height={941}
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="h-auto w-full object-contain transition duration-700 group-hover:scale-[1.02]"
          />
        </Link>
      </Reveal>
    </section>
  );
}
