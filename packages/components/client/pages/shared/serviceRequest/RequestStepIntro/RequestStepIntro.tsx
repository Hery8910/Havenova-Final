import type { ElementType, ReactNode } from 'react';
import styles from './RequestStepIntro.module.css';

interface RequestStepIntroProps {
  title: ReactNode;
  titleId?: string;
  description?: ReactNode;
  descriptionSecondary?: ReactNode;
  titleAs?: ElementType;
}

export default function RequestStepIntro({
  title,
  titleId,
  description,
  descriptionSecondary,
  titleAs: TitleTag = 'h3',
}: RequestStepIntroProps) {
  return (
    <header className={styles.header}>
      <TitleTag id={titleId} className={styles.title}>
        {title}
      </TitleTag>
      {description ? <p className={styles.description}>{description}</p> : null}
      {descriptionSecondary ? <p className={styles.description}>{descriptionSecondary}</p> : null}
    </header>
  );
}
