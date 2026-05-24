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
  titleId,
}: {
  currentStep: number;
  texts: ProcessStepsHeaderTexts;
  titleId?: string;
}) {
  const orderedSteps = Object.values(texts.steps);
  const totalSteps = orderedSteps.length;
  const visualCurrentStep = currentStep > totalSteps ? null : currentStep;

  return (
    <header className={styles.header} aria-labelledby={titleId}>
      <div className={styles.intro}>
        <p className={`${styles.meta} type-body-sm`}>
          {texts.stepLabel} {Math.min(currentStep, totalSteps)}/{totalSteps}
        </p>
        <h2 id={titleId} className={`${styles.title} type-title-lg`}>
          {texts.title}
        </h2>
        <p className={`${styles.description} type-body-md`}>{texts.description}</p>
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
                <h3 className={`${styles.stepHeading} type-body-md`}>{step.heading}</h3>
              </article>
            </li>
          );
        })}
      </ol>
    </header>
  );
}
