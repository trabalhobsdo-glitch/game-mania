import { Headset } from 'lucide-react';
import { Accordion } from '@/components/ui/Accordion';
import { SupportLink } from '@/components/layout/SupportLink';
import { faq } from '@/data/faq';

export function FaqSection() {
  return (
    <section id="faq" className="container-x pt-20 lg:pt-28" aria-labelledby="faq-title">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.4fr] lg:gap-14">
        <div>
          <h2 id="faq-title" className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Perguntas frequentes
          </h2>
          <p className="mt-3 max-w-sm text-white/60">Não encontrou o que procurava? Fale com o nosso atendimento.</p>
          <SupportLink className="btn btn-outline mt-6">
            <Headset className="size-5" aria-hidden />
            Falar com atendimento
          </SupportLink>
        </div>
        <Accordion items={faq} />
      </div>
    </section>
  );
}
