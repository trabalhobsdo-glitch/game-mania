import { About } from '@/components/home/About';
import { FaqSection } from '@/components/home/FaqSection';
import { Hero } from '@/components/home/Hero';
import { OplBanner } from '@/components/home/OplBanner';
import { Storefront } from '@/components/home/Storefront';
import { Trust } from '@/components/home/Trust';

/**
 * ============================================================
 * ORDEM DAS SEÇÕES DA HOME
 * ------------------------------------------------------------
 * Para voltar com os cards de categoria (PlayStation / Game Stick):
 *   import { Categories } from '@/components/home/Categories';
 * e coloque <Categories /> abaixo de <OplBanner />.
 * O componente continua no projeto, só não é usado na Home.
 * As páginas /categoria/playstation e /categoria/game-stick
 * seguem funcionando normalmente.
 * ============================================================
 */
export function HomeView() {
  return (
    <>
      <Hero />
      <OplBanner />
      <Storefront />
      <Trust />
      <About />
      <FaqSection />
    </>
  );
}
