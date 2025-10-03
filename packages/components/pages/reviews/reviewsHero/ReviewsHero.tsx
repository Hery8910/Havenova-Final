// src/components/HomeHero.tsx
import Image from 'next/image';
import styles from './ReviewsHero.module.css';
import { Button } from '../../../common';
import { ButtonProps } from '../../../common/button/Button';

export interface ReviewsHeroProps {
  headline1: string;
  headline2: string;
  subtitle: string;
  button: ButtonProps;
  image: string;
  onClick: () => void;
}

const ReviewsHero: React.FC<ReviewsHeroProps> = ({
  headline1,
  headline2,
  subtitle,
  button,
  image,
  onClick,
}) => {
  return (
    <section className={styles.section} aria-labelledby="reviews-hero-title">
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.h1} id="reviews-hero-title">
            {headline1}
          </h1>
          <h2 className={styles.h2}>{headline2}</h2>
          <p className={styles.description}>{subtitle}</p>
          <Button cta={button.cta} variant={button.variant} icon={button.icon} onClick={onClick} />
        </header>
        <Image
          src={image}
          alt="" // decorative
          width={600}
          height={400}
          priority={true}
          fetchPriority="auto"
          className={styles.image}
          quality={75}
        />
      </div>
    </section>
  );
};

export default ReviewsHero;
