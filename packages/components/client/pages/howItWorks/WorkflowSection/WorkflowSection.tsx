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
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="how-it-works-workflow-title" className={`${styles.title} type-title-lg`}>
            {texts.title}
          </h2>
          <p className={`${styles.subtitle} type-body-lg`}>{texts.subtitle}</p>
        </header>
        <ol className={styles.stepsGrid}>
          {texts.steps.map((step, index) => (
            <li className={styles.stepItem} key={step.title}>
              <article className={`${styles.stepCard} glass-panel--base`}>
                <aside className={styles.stepAside}>
                  <span className={`${styles.badge} type-label`}>{index + 1}</span>
                  <h3 className={`${styles.stepTitle} type-title-sm`}>{step.title}</h3>
                </aside>
                <p className={`${styles.stepDescription} type-body-sm`}>{step.description}</p>
              </article>
            </li>
          ))}
        </ol>
        <aside className={`${styles.note} glass-panel--base`}>
          <h3 className={`${styles.noteTitle} type-title-sm`}>{texts.note.title}</h3>
          <p className={`${styles.noteDescription} type-body-sm`}>{texts.note.description}</p>
        </aside>
      </div>
    </section>
  );
}
