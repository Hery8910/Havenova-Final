import styles from './MasterDetailPage.module.css';

type MasterDetailPageProps = {
  navigation: React.ReactNode;
  detail: React.ReactNode;
  navigationLabel?: string;
  detailLabel?: string;
  mobileView?: 'navigation' | 'detail' | 'both';
};

export function MasterDetailPage({
  navigation,
  detail,
  navigationLabel = 'Directory navigation',
  detailLabel = 'Detail panel',
  mobileView = 'both',
}: MasterDetailPageProps) {
  const navigationClassName = [
    styles.panel,
    mobileView === 'detail' ? styles.mobileNavigationHidden : '',
  ]
    .filter(Boolean)
    .join(' ');
  const detailClassName = [styles.panel, mobileView === 'navigation' ? styles.mobileDetailHidden : '']
    .filter(Boolean)
    .join(' ');

  return (
    <section className={styles.page}>
      <section className={navigationClassName} aria-label={navigationLabel}>
        <div className={styles.panelScroll}>{navigation}</div>
      </section>

      <section className={detailClassName} aria-label={detailLabel}>
        <div className={styles.panelScroll}>{detail}</div>
      </section>
    </section>
  );
}
