import styles from './PeoplePageHeader.module.css';

type PeoplePageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function PeoplePageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PeoplePageHeaderProps) {
  return (
    <header className={styles.root}>
      <div className={styles.copy}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 className={styles.title}>{title}</h1>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>

      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
}
