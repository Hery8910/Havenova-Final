import styles from './ProfileSubroutePlaceholder.module.css';

type ProfileSubroutePlaceholderProps = {
  title: string;
  eyebrow: string;
  description: string;
  routePath: string;
  nextStep: string;
  bullets: string[];
};

export function ProfileSubroutePlaceholder({
  title,
  eyebrow,
  description,
  routePath,
  nextStep,
  bullets,
}: ProfileSubroutePlaceholderProps) {
  return (
    <section className={styles.page} aria-labelledby="profile-subroute-title">
      <article className={styles.hero}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 id="profile-subroute-title" className={styles.title}>
          {title}
        </h1>
        <p className={styles.description}>{description}</p>
        <p className={styles.nextStep}>{nextStep}</p>
      </article>

      <article className={styles.routeCard} aria-label="Profile subroute scaffold details">
        <p className={styles.routeLabel}>Route</p>
        <p className={styles.routeValue}>{routePath}</p>
        <ul className={styles.bulletList}>
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
