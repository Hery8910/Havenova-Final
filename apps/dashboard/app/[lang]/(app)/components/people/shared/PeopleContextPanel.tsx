import styles from './PeopleContextPanel.module.css';

type PeopleContextPanelProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  noteLabel?: string;
  noteText?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
};

export function PeopleContextPanel({
  eyebrow,
  title,
  description,
  noteLabel,
  noteText,
  actions,
  children,
}: PeopleContextPanelProps) {
  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </header>

      {noteLabel && noteText ? (
        <article className={styles.note}>
          <p className={styles.noteLabel}>{noteLabel}</p>
          <p className={styles.noteText}>{noteText}</p>
        </article>
      ) : null}

      {children}

      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </section>
  );
}
