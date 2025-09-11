import { Metadata } from "next";

import { checkoutMetadata } from "../pageMetadata"; 

export const metadata: Metadata = checkoutMetadata;

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}