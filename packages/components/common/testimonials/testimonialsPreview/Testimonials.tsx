// src/components/Testimonials.tsx
import ReviewStars from '../reviewStars/ReviewStars';
import styles from './Testimonials.module.css';
import Button, { ButtonProps } from '../../button/Button';

// Raw desde la API (subset útil)
export type StarRating = 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE' | 'STAR_RATING_UNSPECIFIED';

export interface GbpReview {
  reviewId: string;
  name: string; // "accounts/{acc}/locations/{loc}/reviews/{id}"
  reviewer: {
    displayName?: string;
    profilePhotoUrl?: string;
    isAnonymous?: boolean;
  };
  starRating: StarRating;
  comment?: string;
  createTime: string; // ISO
  updateTime?: string; // ISO
  reviewReply?: {
    comment?: string;
    updateTime?: string;
  };
}

// Modelo UI normalizado para tu componente Testimonials
export interface TestimonialItem {
  id: string;
  author: string;
  avatarUrl?: string;
  rating: number;
  text: string;
  date: string;
  reply?: { text: string; date?: string };
}

export interface TestimonialsProps {
  title: string;
  subtitle: string;
  description: string;
  items: TestimonialItem[];
  mobile: boolean;
  button: ButtonProps;
  onClick: () => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({
  title,
  subtitle,
  description,
  items,
  button,
  onClick,
}) => {
  return (
    <section className={styles.section} aria-labelledby="testimonials-title">
      <header className={styles.header}>
        <h2 id="testimonials-title">{title}</h2>
        <h3 className={styles.h3} id="testimonials-subtitle">
          {subtitle}
        </h3>
      </header>
      <article className={styles.wrapper}>
        <ul className={styles.ul}>
          {items.slice(0, 4).map((item) => (
            <li className={`${styles.li} card`} key={item.id}>
              <header className={styles.header_li} aria-label={`Rezension von ${item.author}`}>
                <h4 className={styles.h4}>{item.author}</h4>
                <div className={styles.rating_div}>
                  <ReviewStars rating={item.rating} />
                  <time className={styles.time} dateTime={new Date(item.date).toISOString()}>
                    {new Date(item.date).toLocaleDateString()}
                  </time>
                </div>
              </header>
              <p className={styles.p}>{item.text}</p>
              {item.reply && (
                <footer className={styles.footer}>
                  <p>Antwort</p>
                  <p className={styles.p}>{item.reply.text}</p>
                </footer>
              )}
            </li>
          ))}
        </ul>
      </article>
      <aside className={styles.aside}>
        <p className={styles.p}>{description}</p>

        <Button cta={button.cta} variant={button.variant} icon={button.icon} onClick={onClick} />
      </aside>
    </section>
  );
};

export default Testimonials;
