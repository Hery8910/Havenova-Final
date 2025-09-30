import { Metadata } from 'next';

import { faqMetadata } from '../../pageMetadata';

export const metadata: Metadata = faqMetadata;

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
