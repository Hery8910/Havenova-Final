import styles from './DashboardRoutePlaceholder.module.css';

type DashboardRoutePlaceholderProps = {
  title: string;
  eyebrow: string;
  description: string;
  routePath: string;
  domain: string;
  purpose: string;
  nextStep: string;
  bullets?: string[];
};

export function DashboardRoutePlaceholder({
  title,
  eyebrow,
  description,
  routePath,
  domain,
  purpose,
  nextStep,
  bullets = [],
}: DashboardRoutePlaceholderProps) {
  return (
    <section className={styles.page} aria-labelledby="dashboard-route-title">
      <article className={styles.hero}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 id="dashboard-route-title" className={styles.title}>
          {title}
        </h1>
        <p className={styles.description}>{description}</p>
      </article>

      <section className={styles.details} aria-label="Route scaffold details">
        <article className={styles.detailCard}>
          <p className={styles.sectionLabel}>Domain</p>
          <p className={styles.detailText}>{domain}</p>
        </article>

        <article className={styles.detailCard}>
          <p className={styles.sectionLabel}>Purpose</p>
          <p className={styles.detailText}>{purpose}</p>
        </article>

        <article className={styles.detailCard}>
          <p className={styles.sectionLabel}>Next Step</p>
          <p className={styles.detailText}>{nextStep}</p>
        </article>
      </section>

      <article className={styles.routeBox}>
        <p className={styles.routeLabel}>Route</p>
        <p className={styles.routeValue}>{routePath}</p>
        {bullets.length ? (
          <ul className={styles.bulletList}>
            {bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        ) : null}
      </article>
    </section>
  );
}
