import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { getLegalDoc } from '@/data/legal';

const doc = getLegalDoc('termos-de-uso')!;

export const metadata: Metadata = { title: doc.title, description: doc.description, alternates: { canonical: '/termos-de-uso' } };

export default function Page() {
  return <LegalPage doc={doc} />;
}
