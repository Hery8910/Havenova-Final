import styles from './HowItWorksSection.module.css';

export interface HowItWorksStep {
  title: string;
  description: string;
}

export interface HowItWorksSectionProps {
  heading: string;
  steps: HowItWorksStep[];
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ heading, steps }) => {
  return (
    <section className={styles.section} aria-labelledby="how-it-works-title">
        <h2 className={styles.h2} id="how-it-works-title">
          {heading}
        </h2>
      <ul className={styles.ul}>
        {steps.map((step, index) => (
          <li key={index} className={styles.li} aria-label={`Schritt ${index + 1}`}>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDescription}>{step.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HowItWorksSection;
