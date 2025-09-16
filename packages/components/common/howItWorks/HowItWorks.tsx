// src/components/WorkFlow.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './HowItWorks.module.css';
import Button, { ButtonProps } from '../button/Button';

export interface HowItWorksStep {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
}

export interface HowItWorksData {
  title: string;
  subtitle: string;
  description: string;
  steps: HowItWorksStep[];
  button: ButtonProps;
  onClick: () => void;
}

const HowItWorks: React.FC<HowItWorksData> = ({
  title,
  subtitle,
  description,
  steps,
  button,
  onClick,
}) => {
  return (
    <section className={styles.section} aria-labelledby="howitworks-title">
      <header className={styles.header}>
        <h2 id="howitworks-title">{title}</h2>
        <h3 className={styles.h3}>{subtitle}</h3>
      </header>

      <ol className={styles.ol}>
        {steps.map((step, idx) => (
          <li className={styles.li} key={`${idx}-${step.title}`}>
            <figure>
              <Image
                className={styles.image}
                src={step.image.src}
                alt={step.image.alt}
                width={350}
                height={200}
                sizes="(min-width: 1025px) 400px, (min-width: 768px) 350px, 90vw"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="sr-only">{step.image.alt}</figcaption>
            </figure>

            <article className={`${styles.article} card`} aria-labelledby={`how-step-${idx}`}>
              <h4 className={styles.h4} id={`how-step-${idx}`}>
                {step.title}
              </h4>
              <p>{step.description}</p>
            </article>
          </li>
        ))}
      </ol>

      <p className={styles.p}>{description}</p>

      <Button cta={button.cta} variant={button.variant} icon={button.icon} onClick={onClick} />
    </section>
  );
};

export default HowItWorks;
