// src/components/TestimonialsSkeleton.tsx
import styles from './ReviewsSection.module.css';

const ReviewsSectionSkeleton = () => {
  return (
    <section className={styles.section} aria-labelledby="testimonials-title">
      <header className={styles.header}>
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <div className={`${styles.skeleton} ${styles.skeletonSubtitle}`} />
      </header>

      <article className={styles.wrapper}>
        <ul className={styles.ul}>
          {Array.from({ length: 3 }).map((_, i) => (
            <li className={`${styles.li} card`} key={i}>
              <header className={styles.header_li}>
                <div className={styles.name_div}>
                  <div className={`${styles.skeleton} ${styles.skeletonTextSmall}`} />
                  <div className={`${styles.skeleton} ${styles.skeletonText}`} />
                </div>
                <div className={styles.rating_div}>
                  <div className={`${styles.skeleton} ${styles.skeletonStars}`} />
                  <div className={`${styles.skeleton} ${styles.skeletonTextSmall}`} />
                </div>
              </header>
              <div className={`${styles.skeleton} ${styles.skeletonParagraph}`} />
              <div className={`${styles.skeleton} ${styles.skeletonParagraph}`} />
            </li>
          ))}
        </ul>
      </article>

      <aside className={styles.aside}>
        <div className={`${styles.skeleton} ${styles.skeletonParagraph}`} />
        <div className={`${styles.skeleton} ${styles.skeletonButton}`} />
      </aside>
    </section>
  );
};

export default ReviewsSectionSkeleton;
