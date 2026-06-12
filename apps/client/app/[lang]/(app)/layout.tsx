import '../../migration-styles/index.css';
import React from 'react';
import { AppLayoutShell } from './AppLayoutShell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppLayoutShell>{children}</AppLayoutShell>;
}
