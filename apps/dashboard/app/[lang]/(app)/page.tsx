import styles from './page.module.css';

const summaryCards = [
  {
    label: 'Access',
    value: 'Protected',
    description: 'The dashboard now resolves session and role before rendering protected UI.',
  },
  {
    label: 'Workspace',
    value: 'Active',
    description: 'Navigation, content shell, and page surfaces now share a unified workspace.',
  },
  {
    label: 'Onboarding',
    value: 'Pending',
    description: 'Invitation-based first access remains the final validation step for this client.',
  },
];

const nextSteps = [
  'Align dashboard pages with the new shell and token system.',
  'Refine admin-facing flows without exposing protected views to guests.',
  'Validate invitation access after the visual and structural base is stable.',
];

export default function DashboardHome() {
  return (
    <section className={styles.page} aria-labelledby="dashboard-overview-title">
      <article className={`${styles.hero} glass-panel--base`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Dashboard Overview</p>
          <h1 id="dashboard-overview-title" className={styles.title}>
            Operational access is now resolved before the workspace renders.
          </h1>
          <p className={styles.description}>
            This home surface will become the summary entry point for client domains, access, and
            operational status. For now it acts as the stable base while the rest of the dashboard
            is aligned to the new shell.
          </p>
        </div>
      </article>

      <section className={styles.metrics} aria-label="Dashboard status summary">
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
            Incremental stabilization before invitation testing
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
