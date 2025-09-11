// src/components/WelcomeOfferBanner.skeleton.tsx
import React from 'react';
import styles from './WelcomeOfferBanner.module.css';

const SkeletonWelcomeOfferBanner: React.FC = () => {
  return (
    <section
      className={`${styles.section} ${styles.skeletonCard}`}
      aria-busy="true"
      aria-live="polite"
    >
      <div
        className={`${styles.image} ${styles.skelMedia} ${styles.animShimmer}`}
        aria-hidden="true"
      />
      <div className={styles.main}>
        <div className={`${styles.skeletonText} ${styles.animShimmer}`} />
        <div className={`${styles.skeletonTextSm} ${styles.animShimmer}`} />
        <div className={`${styles.skeletonTextSm} ${styles.animShimmer}`} />
        <div className={`${styles.skeletonButton} ${styles.animShimmer}`} role="presentation" />
      </div>
    </section>
  );
};

export default SkeletonWelcomeOfferBanner;
