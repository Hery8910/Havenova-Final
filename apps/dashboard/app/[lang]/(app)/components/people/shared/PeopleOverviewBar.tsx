import styles from './PeopleOverviewBar.module.css';

type PeopleOverviewBarProps = {
  summary: React.ReactNode;
  actions?: React.ReactNode;
};

export function PeopleOverviewBar({ summary, actions }: PeopleOverviewBarProps) {
  return (
    <section className={styles.root} aria-label="Page overview">
      <div className={styles.summary}>{summary}</div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </section>
  );
}
