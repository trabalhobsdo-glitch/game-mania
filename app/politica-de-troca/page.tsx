import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { getLegalDoc } from '@/data/legal';

const doc = getLegalDoc('politica-de-troca')!;

export const metadata: Metadata = { title: doc.title, description: doc.description, alternates: { canonical: '/politica-de-troca' } };

export default function Page() {
  return <LegalPage doc={doc} />;
}
