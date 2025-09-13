import { Metadata } from "next";

import { privacyPolicyMetadata } from "../../pageMetadata";

export const metadata: Metadata = privacyPolicyMetadata;

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}