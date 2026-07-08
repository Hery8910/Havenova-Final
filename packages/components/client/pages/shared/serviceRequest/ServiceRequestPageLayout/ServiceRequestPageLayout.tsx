import type { ReactNode } from 'react';
import styles from './ServiceRequestPageLayout.module.css';

interface ServiceRequestPageLayoutProps {
  dataPage: string;
  hero: ReactNode;
  alert?: ReactNode;
  form: ReactNode;
  faq: ReactNode;
  related: ReactNode;
}

export default function ServiceRequestPageLayout({
  dataPage,
  hero,
  alert,
  form,
  faq,
  related,
}: ServiceRequestPageLayoutProps) {
  return (
    <>
      <section className={styles.heroSection}>{hero}</section>

      <main id="app-main-content" tabIndex={-1} className={styles.main} data-page={dataPage}>
        {alert ?? null}

        <section className={styles.formSection}>
          <div className={styles.formSectionInner}>
            <div className={styles.formSurface}>{form}</div>
          </div>
        </section>

        {faq}

        <section className={styles.relatedSection}>
          <div className={styles.relatedSectionInner}>{related}</div>
        </section>
      </main>
    </>
  );
}
