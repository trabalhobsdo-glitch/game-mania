import type { Metadata } from 'next';
import { HomeView } from '@/components/home/HomeView';
import { store } from '@/data/store';

export const metadata: Metadata = {
  title: { absolute: store.seo.title },
  description: store.seo.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return <HomeView />;
}
