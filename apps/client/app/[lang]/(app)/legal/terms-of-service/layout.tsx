import { Metadata } from 'next';

import { termsOfServiceMetadata } from '../../../../pageMetadata';

export const metadata: Metadata = termsOfServiceMetadata;

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
