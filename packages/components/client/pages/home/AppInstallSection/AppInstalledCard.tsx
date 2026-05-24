import Link from 'next/link';
import styles from './AppInstallSection.module.css';
import type { AppInstallCta, AppInstallVariantTexts } from './AppInstallSection.types';

type AppInstalledCardProps = {
  content: AppInstallVariantTexts & {
    ctas: AppInstallCta[];
  };
};

export function AppInstalledCard({ content }: AppInstalledCardProps) {
  return (
    <div className={`${styles.appCard} ${styles.appInstalledCard}`} data-state="installed">
      <header className={styles.titleBlock}>
        <h2 id="home-app-title" className="type-display-md">
          {content.title}
        </h2>
      </header>

      <div className={styles.copyBlock}>
        <p className={`${styles.sectionSubtitle} type-body-lg`}>{content.description}</p>
        <div className={styles.appCtas}>
          {content.ctas.map((cta, index) => (
            <Link
              key={`${cta.href}-${index}`}
              className={`${styles.actionButton}  button button--accent`}
              href={cta.href}
            >
              {cta.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
