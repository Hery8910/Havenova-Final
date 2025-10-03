// src/components/HomeHero.tsx
import { ReviewStars } from '../../../common/testimonials/reviewStars';
import styles from './ReviewsSummary.module.css';

export interface ReviewsSummaryProps {
  heading: string;
  description: string;
  average: string;
  averageRating: number;
  totalReviews: number;
}

const ReviewsSummary: React.FC<ReviewsSummaryProps> = ({
  heading,
  description,
  average,
  averageRating,
  totalReviews,
}) => {
  return (
    <section className={styles.section} aria-labelledby="reviews-summary-title">
      <header className={styles.header}>
        <h3 className={styles.h1} id="reviews-summary-title">
          {heading}
        </h3>
        <p className={styles.description}>{description}</p>
      </header>
      <aside className={styles.aside}>
        <h4 className={styles.average}>{average}</h4>
        <div className={styles.wrapper}>
          <p className={styles.averageRating}>{averageRating}</p>
          <div className={styles.stars}>
            <ReviewStars rating={averageRating} />
          </div>
        </div>
      </aside>
    </section>
  );
};

export default ReviewsSummary;
