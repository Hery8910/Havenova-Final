import Link from 'next/link';
import styles from './AppInstallSection.module.css';
import type {
  AppInstallTexts,
  AppNotInstalledContent,
  AppNotInstalledState,
} from './AppInstallSection.types';

type AppNotInstalledCardProps = {
  state: AppNotInstalledState;
  content: AppNotInstalledContent;
  onInstall: () => void;
};

export function AppNotInstalledCard({ state, content, onInstall }: AppNotInstalledCardProps) {
  const showSupportBar = state === 'installable' || state === 'ios-manual';
  const installCta =
    state === 'installable' ? (content as AppInstallTexts['installable']).cta : null;
  const fallbackCta =
    state === 'unavailable' ? (content as AppInstallTexts['unavailable']).cta : null;

  return (
    <div
      className={`${styles.appCard} ${styles.appInstalledCard} ${styles.appNotInstalledCard}`}
      data-state={state}
    >
      <header className={styles.titleBlock}>
        <h2 id="home-app-title" className="type-display-md">
          {content.title}
        </h2>
      </header>

      <div className={styles.copyBlock}>
        <p className={`${styles.sectionSubtitle} type-body-lg`}>
          {content.description}
        </p>
        {fallbackCta ? (
          <div className={styles.appCtas}>
            <Link
              className={`${styles.actionButton} button button--accent`}
              href={fallbackCta.href}
            >
              {fallbackCta.label}
            </Link>
          </div>
        ) : null}
      </div>

      {showSupportBar ? (
        <div className={`${styles.supportBar} card card--neutral`}>
          <p className={`${styles.supportInfo} type-body-sm`}>
            {'info' in content ? content.info : ''}
          </p>
          {installCta ? (
            <button
              type="button"
              className={`${styles.actionButton} button button--accent`}
              onClick={onInstall}
            >
              {installCta.label}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
