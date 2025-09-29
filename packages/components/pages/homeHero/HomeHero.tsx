// src/components/HomeHero.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './HomeHero.module.css';
import { Button } from '../../common';
import { ButtonProps } from '../../common/button/Button';

export interface HomeHeroProps {
  headline1: string;
  headline2: string;
  subtitle: string;
  button: ButtonProps;
  image: string;
  onClick: () => void;
}

const HomeHero: React.FC<HomeHeroProps> = ({
  headline1,
  headline2,
  subtitle,
  button,
  image,
  onClick,
}) => {
  return (
    <section className={styles.section} aria-labelledby="home-hero-title">
      {/* Fondo decorativo optimizado */}
      <div className={styles.bgWrapper}>
        <Image
          src={image}
          alt="" // decorative
          fill
          sizes="100vw"
          priority={true}
          fetchPriority="auto"
          className={styles.backgroundImage}
          quality={75}
        />
      </div>

      <div className={styles.main}>
        <aside className={styles.aside}>
          <h1 id="home-hero-title">
            <span className={styles.headline1}>
              {headline1}
              <span className={styles.and}>&</span>
            </span>
            <span className={styles.headline2}>{headline2}</span>
          </h1>
        </aside>

        <p className={styles.description}>{subtitle}</p>
        <Button cta={button.cta} variant={button.variant} icon={button.icon} onClick={onClick} />
      </div>
    </section>
  );
};

export default HomeHero;
