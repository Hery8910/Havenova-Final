// src/components/HomeHero.tsx
import Image from 'next/image';
import styles from './ServicesHero.module.css';

export interface ServicesHeroProps {
  headline1: string;
  subtitle: string;
  image: string;
}

const ServicesHero: React.FC<ServicesHeroProps> = ({ headline1, subtitle, image }) => {
  return (
    <section className={styles.section} aria-labelledby="services-hero-title">
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.h1} id="services-hero-title">
            {headline1}
          </h1>
          <p className={styles.description}>{subtitle}</p>
        </header>
        <Image
          src={image}
          alt="" // decorative
          fill
          sizes="100vw"
          priority={true}
          fetchPriority="auto"
          className={styles.image}
          quality={75}
        />
      </div>
    </section>
  );
};

export default ServicesHero;
