import styles from './HowItWorks.module.css';
import { IconType } from 'react-icons';
import { FaClipboardList, FaCalendarCheck, FaTools } from 'react-icons/fa';
import { RiMailSendLine } from 'react-icons/ri';
interface Step {
  title: string;
  description: string;
}

interface HowItWorksProps {
  title: string;
  steps: Step[];
}

const HowItWorks: React.FC<HowItWorksProps> = ({ title, steps }) => {
  const icons = [FaClipboardList, FaCalendarCheck, FaTools, RiMailSendLine];

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.steps}>
        {steps.map((step: Step, index: number) => {
          const Icon: IconType = icons[index];
          return (
            <li key={index} className={styles.step}>
              <aside className={styles.aside}>
                <Icon className={styles.icon} />
                <span className={styles.span}></span>
              </aside>

              <article className={styles.article}>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepDescription}>{step.description}</p>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default HowItWorks;
