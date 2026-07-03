import Link from 'next/link';
import styles from './page.module.css';

const summaryCards = [
  {
    label: 'Access',
    value: 'Worker',
    description: 'This app only renders after the worker session and worker complement are valid.',
  },
  {
    label: 'Auth',
    value: 'Shared',
    description: 'The auth shell and auth route base are shared with the other session apps.',
  },
  {
    label: 'Status',
    value: 'Bootstrap',
    description: 'This is the minimal protected home used to validate worker authentication.',
  },
];

const nextSteps = [
  'Validate invitation onboarding and normal login for worker users.',
  'Add worker-specific profile/account routes on top of this protected base.',
  'Extend the app only after the shared auth foundation is fully stable.',
];

export default function WorkerHome() {
  return (
    <section className={styles.page} aria-labelledby="worker-overview-title">
      <article className={`${styles.hero} glass-panel--base`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Worker Overview</p>
          <h1 id="worker-overview-title" className={styles.title}>
            Worker authentication is now isolated in its own app boundary.
          </h1>
          <p className={styles.description}>
            This surface exists to validate the shared auth base, worker-only access control, and
            `AuthProvider + WorkerProvider` wiring before worker-specific pages are added.
          </p>
          <div className={styles.heroActions}>
            <Link href="./profile" className="button">
              Open worker profile
            </Link>
          </div>
        </div>
      </article>

      <section className={styles.metrics} aria-label="Worker app status summary">
        {summaryCards.map((item) => (
          <article key={item.label} className={`${styles.metricCard} glass-panel--base`}>
            <p className={styles.metricLabel}>{item.label}</p>
            <p className={styles.metricValue}>{item.value}</p>
            <p className={styles.metricDescription}>{item.description}</p>
          </article>
        ))}
      </section>

      <article className={`${styles.nextPanel} glass-panel--base`} aria-labelledby="next-steps">
        <div className={styles.nextHeader}>
          <p className={styles.eyebrow}>Current Focus</p>
          <h2 id="next-steps" className={styles.sectionTitle}>
            Minimal protected base before worker domain pages
          </h2>
        </div>
        <ol className={styles.stepList}>
          {nextSteps.map((step) => (
            <li key={step} className={styles.stepItem}>
              {step}
            </li>
          ))}
        </ol>
      </article>
    </section>
  );
}
