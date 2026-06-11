import '../../migration-styles/index.css';
import type { Metadata } from 'next';
import { HomePageClient } from '../../../../../packages/components/client/pages/home';
import { getPageMetadata } from '../../../../../packages/utils/metadata';

export async function generateMetadata({
  params,
}: {
  params: { lang: 'de' | 'en' | 'es' };
}): Promise<Metadata> {
  return getPageMetadata(params.lang, 'home');
}

export default function HomePage() {
  return <HomePageClient />;
}
