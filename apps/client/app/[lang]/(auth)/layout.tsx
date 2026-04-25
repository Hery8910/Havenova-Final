// apps/client/app/[lang]/(auth)/layout.tsx
import { ReactNode } from 'react';
import styles from './user/userAuth.module.css'; // Ajusta la ruta a tu CSS

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className={`bg-pattern-squares ${styles.authMainLayout}`}>
      <div className={`glass-panel--service-primary ${styles.authCardWrapper}`}>{children}</div>
    </main>
  );
}
