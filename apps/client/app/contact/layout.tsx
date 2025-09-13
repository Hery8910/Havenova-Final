import { Metadata } from "next";

import { contactMetadata } from "../pageMetadata"; 

export const metadata: Metadata = contactMetadata;

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}