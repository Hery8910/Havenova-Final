import styles from './WorkflowSection.module.css';
import type { HowItWorksWorkflowTexts } from '../howItWorks.types';

export default function WorkflowSection({
  texts,
}: {
  texts: HowItWorksWorkflowTexts;
}) {
  return (
    <section className={styles.workflow} aria-labelledby="how-it-works-workflow-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2
            id="how-it-works-workflow-title"
            className={`${styles.title} type-title-lg v2-page-heading`}
          >
            {texts.title}
          </h2>
          <p className={`${styles.subtitle} type-body-lg v2-page-copy`}>{texts.subtitle}</p>
        </header>
        <ol className={styles.stepsGrid}>
          {texts.steps.map((step, index) => (
            <li className={styles.stepItem} key={step.title}>
              <article className={`${styles.stepCard} v2-card v2-card--neutral`}>
                <aside className={styles.stepAside}>
                  <span className={`${styles.badge} type-label v2-card v2-card--accent`}>
                    {index + 1}
                  </span>
                  <h3 className={`${styles.stepTitle} type-title-sm v2-page-heading`}>{step.title}</h3>
                </aside>
                <p className={`${styles.stepDescription} type-body-sm v2-page-copy`}>{step.description}</p>
              </article>
            </li>
          ))}
        </ol>
        <aside className={`${styles.note} v2-card v2-card--accent`}>
          <h3 className={`${styles.noteTitle} type-title-sm v2-page-heading`}>{texts.note.title}</h3>
          <p className={`${styles.noteDescription} type-body-sm v2-page-copy`}>{texts.note.description}</p>
        </aside>
      </div>
    </section>
  );
}
