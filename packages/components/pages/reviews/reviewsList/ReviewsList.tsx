// src/components/Testimonials.tsx

import { ReviewStars } from '../../../common/reviews/reviewStars';
import styles from './ReviewsList.module.css';

export interface ReviewsListlItem {
  author: string;
  date: string;
  rating: number;
  service: string;
  comment: string;
}

export interface ReviewsListProps {
  items: ReviewsListlItem[];
  itemsNum: number;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ items, itemsNum }) => {
  return (
    <ul className={styles.ul}>
      {items.slice(0, itemsNum).map((item, idx) => (
        <li className={`${styles.li} card`} key={idx}>
          <h4 className={styles.h4}>{item.author}</h4>
          <div className={styles.rating_div}>
            <ReviewStars rating={item.rating} />
            <p>{item.date}</p>
            <p>{item.comment}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ReviewsList;
