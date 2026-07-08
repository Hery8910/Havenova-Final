import styles from './DirectorySummary.module.css';

export type DirectorySummaryItem = {
  label: string;
  value: string | number;
};

type DirectorySummaryProps = {
  items: DirectorySummaryItem[];
};

export function DirectorySummary({ items }: DirectorySummaryProps) {
  return (
    <section className={styles.grid} aria-label="Directory summary">
      {items.map((item) => (
        <article key={item.label} className={styles.card}>
          <p className={styles.label}>{item.label}</p>
          <p className={styles.value}>{item.value}</p>
        </article>
      ))}
    </section>
  );
}
