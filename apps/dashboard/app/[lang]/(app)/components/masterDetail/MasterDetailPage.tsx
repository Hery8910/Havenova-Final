import styles from './MasterDetailPage.module.css';

type MasterDetailPageProps = {
  navigation: React.ReactNode;
  detail: React.ReactNode;
  navigationLabel?: string;
  detailLabel?: string;
};

export function MasterDetailPage({
  navigation,
  detail,
  navigationLabel = 'Directory navigation',
  detailLabel = 'Detail panel',
}: MasterDetailPageProps) {
  return (
    <section className={styles.page}>
      <section className={styles.panel} aria-label={navigationLabel}>
        <div className={styles.panelScroll}>{navigation}</div>
      </section>

      <section className={styles.panel} aria-label={detailLabel}>
        <div className={styles.panelScroll}>{detail}</div>
      </section>
    </section>
  );
}
