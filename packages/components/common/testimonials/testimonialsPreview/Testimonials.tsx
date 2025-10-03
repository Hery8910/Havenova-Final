// src/components/Testimonials.tsx
import ReviewStars from '../reviewStars/ReviewStars';
import styles from './Testimonials.module.css';
import Button, { ButtonProps } from '../../button/Button';
import { ReviewsList } from '../../../pages';
import { ReviewsListlItem } from '../../../pages/reviews/reviewsList/ReviewsList';

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

export interface TestimonialsProps {
  title: string;
  subtitle: string;
  description: string;
  items: ReviewsListlItem[];
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
        <ReviewsList items={items} itemsNum={4} />
      </article>
      <aside className={styles.aside}>
        <p className={styles.p}>{description}</p>
        <Button cta={button.cta} variant={button.variant} icon={button.icon} onClick={onClick} />
      </aside>
    </section>
  );
};

export default Testimonials;
