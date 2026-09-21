import { TriangleAlert } from 'lucide-react';
import { store } from '@/data/store';
import type { LegalDoc } from '@/data/legal';

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <div className="container-x pb-8 pt-8 lg:pt-14">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{doc.title}</h1>
        {store.legalDraftNotice && (
          <p className="mt-6 flex items-start gap-3 rounded-card border border-accent/30 bg-accent/[0.06] p-4 text-sm text-white/80">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
            Texto-modelo. Revise com um responsável legal antes de publicar a loja e depois desative este aviso em data/store.ts.
          </p>
        )}
        <div className="mt-10 space-y-9">
          {doc.sections.map((s) => (
            <section key={s.title}>
              <h2 className="mb-3 text-xl font-bold">{s.title}</h2>
              {s.paragraphs.map((p) => (
                <p key={p} className="leading-relaxed text-white/70">{p}</p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
