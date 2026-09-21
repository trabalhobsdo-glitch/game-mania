import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { getLegalDoc } from '@/data/legal';

const doc = getLegalDoc('politica-de-privacidade')!;

export const metadata: Metadata = { title: doc.title, description: doc.description, alternates: { canonical: '/politica-de-privacidade' } };

export default function Page() {
  return <LegalPage doc={doc} />;
}
