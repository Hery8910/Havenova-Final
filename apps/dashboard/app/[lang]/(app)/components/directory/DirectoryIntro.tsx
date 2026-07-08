import styles from './DirectoryIntro.module.css';

type DirectoryIntroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function DirectoryIntro({ eyebrow, title, description }: DirectoryIntroProps) {
  return (
    <header className={styles.root}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h1 className={styles.title}>{title}</h1>
      {description ? <p className={styles.description}>{description}</p> : null}
    </header>
  );
}
