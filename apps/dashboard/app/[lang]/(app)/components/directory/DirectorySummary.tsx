import styles from './DirectorySummary.module.css';

export type DirectorySummaryItem = {
  label: string;
  value: string | number;
  tone?: 'neutral' | 'primary' | 'secondary' | 'accent';
  isActive?: boolean;
  onSelect?: () => void;
};

type DirectorySummaryProps = {
  items: DirectorySummaryItem[];
};

export function DirectorySummary({ items }: DirectorySummaryProps) {
  return (
    <section className={styles.grid} aria-label="Directory summary">
      {items.map((item) => {
        const className = [
          styles.card,
          item.tone ? styles[`tone-${item.tone}`] : styles['tone-neutral'],
          item.isActive ? styles.active : '',
        ]
          .filter(Boolean)
          .join(' ');

        const content = (
          <>
            <p className={styles.label}>{item.label}</p>
            <p className={styles.value}>{item.value}</p>
          </>
        );

        return item.onSelect ? (
          <button
            key={item.label}
            type="button"
            className={className}
            aria-pressed={item.isActive}
            onClick={item.onSelect}
          >
            {content}
          </button>
        ) : (
          <article key={item.label} className={className}>
            {content}
          </article>
        );
      })}
    </section>
  );
}
