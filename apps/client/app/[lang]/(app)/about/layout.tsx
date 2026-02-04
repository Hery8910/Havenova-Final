import { Metadata } from 'next';

import { aboutMetadataTranslations } from '../../../pageMetadata';
import { getPageMetadata } from '../../../../../../packages/utils/metadata';

export async function generateMetadata({
  params,
}: {
  params: { lang: 'de' | 'en' };
}): Promise<Metadata> {
  return getPageMetadata(params.lang, 'about');
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
