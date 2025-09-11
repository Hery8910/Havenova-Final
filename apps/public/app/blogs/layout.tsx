import { Metadata } from 'next';

import { blogMetadata } from '../pageMetadata';

export const metadata: Metadata = blogMetadata;

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
