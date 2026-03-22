import styles from './ProcessStepsHeader.module.css';

type StepText = {
  heading: string;
};

type ProcessStepsHeaderTexts = {
  title: string;
  description: string;
  stepLabel: string;
  steps: {
    customerFrequency: StepText;
    propertyDetails: StepText;
    scheduling: StepText;
    serviceAddress: StepText;
  };
};

export default function ProcessStepsHeader({
  currentStep,
  texts,
}: {
  currentStep: 1 | 2 | 3 | 4 | 5;
  texts: ProcessStepsHeaderTexts;
}) {
  const orderedSteps: StepText[] = [
    texts.steps.customerFrequency,
    texts.steps.propertyDetails,
    texts.steps.scheduling,
    texts.steps.serviceAddress,
  ];
  const visualCurrentStep = currentStep === 5 ? null : currentStep;

  return (
    <header className={styles.header} aria-labelledby="cleaning-process-title">
      <h2 id="cleaning-process-title" className={styles.title}>
        {texts.title}
      </h2>

      <ol className={styles.timeline}>
        {orderedSteps.map((step, index) => {
          const number = (index + 1) as 1 | 2 | 3 | 4;
          const isActive = number === visualCurrentStep;
          const isCompleted = currentStep === 5 ? true : number < currentStep;

          return (
            <li
              key={step.heading}
              className={styles.timelineItem}
              aria-current={isActive ? 'step' : undefined}
            >
              <article
                className={`${styles.card} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
              >
                <span className={styles.index} aria-hidden="true">
                  {number}
                </span>
                <h3 className={styles.stepHeading}>{step.heading}</h3>
              </article>
            </li>
          );
        })}
      </ol>
    </header>
  );
}
