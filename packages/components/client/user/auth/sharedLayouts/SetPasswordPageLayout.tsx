import { Metadata } from 'next';

import { getPageMetadata } from '@/packages/utils/metadata';

export async function generateMetadata({
  params,
}: {
  params: { lang: 'de' | 'en' | 'es' };
}): Promise<Metadata> {
  return getPageMetadata(params.lang, 'setPassword');
}

export default function SetPasswordPageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
