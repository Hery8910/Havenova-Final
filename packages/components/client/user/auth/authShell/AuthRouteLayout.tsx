import React from 'react';
import styles from './authShell.module.css';

export function AuthRouteLayout({ children }: { children: React.ReactNode }) {
  return <main className={`bg-pattern-squares ${styles.authMainLayout}`}>{children}</main>;
}
