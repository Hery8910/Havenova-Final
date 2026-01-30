import styles from './WorkflowSection.module.css';

export default function WorkflowSection({
  texts,
}: {
  texts: {
    title: string;
    subtitle: string;
    steps: { title: string; description: string }[];
    note: { title: string; description: string };
  };
}) {
  return (
    <section className={styles.workflow} aria-labelledby="how-it-works-workflow-title">
      <section className={styles.container} aria-labelledby="how-it-works-workflow-title">
        <header className={styles.header}>
          <h2 id="how-it-works-workflow-title" className={styles.title}>
            {texts.title}
          </h2>
          <p className={styles.subtitle}>{texts.subtitle}</p>
        </header>
        <ol className={styles.stepsGrid}>
          {texts.steps.map((step, index) => (
            <li className={styles.stepItem} key={step.title}>
              <article className={`${styles.stepCard} card--glass`}>
                <aside className={styles.stepAside}>
                  <span className={styles.badge}>{index + 1}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                </aside>
                <p className={styles.stepDescription}>{step.description}</p>
              </article>
            </li>
          ))}
        </ol>
        <aside className={`${styles.note} card--glass`}>
          <h3 className={styles.noteTitle}>{texts.note.title}</h3>
          <p className={styles.noteDescription}>{texts.note.description}</p>
        </aside>
      </section>
    </section>
  );
}
