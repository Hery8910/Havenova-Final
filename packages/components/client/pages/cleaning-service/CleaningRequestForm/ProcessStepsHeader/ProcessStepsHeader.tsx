import styles from './ProcessStepsHeader.module.css';

type StepText = {
  heading: string;
  ariaLabel?: string;
};

type ProcessStepsHeaderTexts = {
  title: string;
  description: string;
  stepLabel: string;
  steps: Record<string, StepText>;
};

export default function ProcessStepsHeader({
  currentStep,
  texts,
}: {
  currentStep: number;
  texts: ProcessStepsHeaderTexts;
}) {
  const orderedSteps = Object.values(texts.steps);
  const totalSteps = orderedSteps.length;
  const visualCurrentStep = currentStep > totalSteps ? null : currentStep;

  return (
    <header className={styles.header} aria-labelledby="cleaning-process-title">
      <div className={styles.intro}>
        <p className={styles.meta}>
          {texts.stepLabel} {Math.min(currentStep, totalSteps)}/{totalSteps}
        </p>
        <h2 id="cleaning-process-title" className={styles.title}>
          {texts.title}
        </h2>
        <p className={styles.description}>{texts.description}</p>
      </div>

      <ol className={styles.timeline}>
        {orderedSteps.map((step, index) => {
          const number = index + 1;
          const isActive = number === visualCurrentStep;
          const isCompleted = number < currentStep;

          return (
            <li
              key={step.heading}
              className={styles.timelineItem}
              aria-current={isActive ? 'step' : undefined}
            >
              <article
                className={`${styles.card} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
              >
                <span className={styles.index} aria-hidden="true" />
                <h3 className={styles.stepHeading}>{step.heading}</h3>
              </article>
            </li>
          );
        })}
      </ol>
    </header>
  );
}
