import { Metadata } from 'next';

// import { aboutMetadata } from "../pageMetadata";
// export const metadata: Metadata = aboutMetadata;

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
