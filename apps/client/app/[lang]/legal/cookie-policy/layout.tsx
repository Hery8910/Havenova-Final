import { Metadata } from 'next';

import { cookiePolicyMetadata } from '../../../pageMetadata';

export const metadata: Metadata = cookiePolicyMetadata;

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
