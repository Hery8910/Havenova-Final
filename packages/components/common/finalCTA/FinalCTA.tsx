import styles from './FinalCTA.module.css';
import Button, { ButtonProps } from '../button/Button';
import Image from 'next/image';

export interface FinalCTAProps {
  headline: string;
  subheadline: string;
  button: ButtonProps;
  image: string;
  onClick: () => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ headline, subheadline, button, image, onClick }) => {
  return (
    <section className={styles.section} aria-labelledby="final-cta-headline">
      <article className={styles.article}>
        <header className={styles.header}>
          <h2 id="final-cta-headline" className={styles.headline}>
            {headline}
          </h2>
          <p className={styles.subheadline}>{subheadline}</p>
          <Button cta={button.cta} variant={button.variant} icon={button.icon} onClick={onClick} />
        </header>
        <Image
          className={styles.image}
          src={image}
          alt=""
          width={500}
          height={500}
          loading="lazy"
          decoding="async"
        />
      </article>
    </section>
  );
};

export default FinalCTA;
