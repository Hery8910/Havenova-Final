'use client';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../../../../packages/contexts/i18n';
import styles from './page.module.css';
import { ReviewsHero, ReviewsHeroSkeleton, ReviewsList } from '@/packages/components/pages/reviews';
import { ReviewsSummary } from '@/packages/components/pages/reviews';
import { useState } from 'react';
import {
  Button,
  FAQSection,
  FAQSectionSkeleton,
  FinalCTA,
  FinalCTASkeleton,
} from '../../../../../packages/components/common';

const Review = () => {
  const { texts } = useI18n();
  const router = useRouter();

  const reviewsHeroTexts = texts.pages.reviews.hero;
  const reviewsSummaryTexts = texts.pages.reviews.summary;
  const reviewsListTexts = texts.pages.reviews.list;
  const reviewsList = texts.components.reviews.reviews;
  const faqReviewsTexts = texts.pages.reviews.faq;
  const finalCtaTexts = texts.components.common.finalCta;
  const [itemsNum, setItemsNum] = useState(6);

  return (
    <main className={styles.main}>
      {reviewsHeroTexts ? (
        <ReviewsHero {...reviewsHeroTexts} onClick={() => router.push('/services')} />
      ) : (
        <ReviewsHeroSkeleton />
      )}

      <ReviewsSummary {...reviewsSummaryTexts} />
      {/* {reviewsSummaryTexts ? (
      ) : (
        <ReviewsHeroSkeleton />
      )} */}
      <section className={styles.section}>
        <h3>{reviewsListTexts.heading}</h3>
        <ReviewsList items={reviewsList} itemsNum={itemsNum} />
        <Button
          cta={reviewsListTexts.button.cta}
          variant={reviewsListTexts.button.variant}
          icon={reviewsListTexts.button.icon}
          onClick={() => setItemsNum((prev) => prev + 5)}
        />
      </section>
      {faqReviewsTexts ? (
        <FAQSection {...faqReviewsTexts} onClick={() => router.push('/faq')} />
      ) : (
        <FAQSectionSkeleton />
      )}

      {finalCtaTexts ? (
        <FinalCTA {...finalCtaTexts} onClick={() => router.push('/services')} />
      ) : (
        <FinalCTASkeleton />
      )}
    </main>
  );
};

export default Review;
