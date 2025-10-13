// src/components/WelcomeOfferBanner.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './WelcomeOfferBanner.module.css';
import Button, { ButtonProps } from '../button/Button';
import { WelcomeOfferBannerSkeleton } from '.';

export interface OfferBannerContent {
  header: string;
  description: string;
  button: ButtonProps;
  image: {
    src: string;
    alt: string;
  };
  onClick: () => void;
}

const WelcomeOfferBanner: React.FC<OfferBannerContent> = ({
  header,
  description,
  button,
  image,
  onClick,
}) => {
  if (!header || !description) return <WelcomeOfferBannerSkeleton />;
  return (
    <section
      className={styles.section}
      aria-labelledby="offer-banner-title"
      aria-describedby="offer-banner-desc"
    >
      <figure className={styles.figure}>
        <Image
          className={styles.image}
          src={image.src}
          alt={image.alt}
          width={500}
          height={500}
          sizes="(min-width: 1025px) 450px, 300px"
          priority={true}
          fetchPriority="auto"
        />
      </figure>

      <div className={styles.main}>
        <h2 id="offer-banner-title" className={styles.h2}>
          {header}
        </h2>
        <p id="offer-banner-desc" className={styles.p}>
          {description}
        </p>
        <Button cta={button.cta} variant={button.variant} icon={button.icon} onClick={onClick} />
      </div>
    </section>
  );
};

export default WelcomeOfferBanner;
