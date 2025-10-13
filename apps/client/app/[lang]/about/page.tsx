'use client';
import React from 'react';
import { useIsMobile } from '@/packages/hooks';
import styles from './page.module.css';
import AboutHero from '@/packages/components/pages/aboutHero/AboutHero';
import AboutHeroSkeleton from '@/packages/components/pages/aboutHero/AboutHero.skeleton';
import { useI18n } from '@/packages/contexts/i18n/I18nContext';
import {
  ServicesPreview,
  ServicesPreviewSkeleton,
  Story,
  StorySkeleton,
  ReviewsSection,
  ReviewsSectionSkeleton,
  Values,
  ValuesSkeleton,
  WhyChoose,
  WhyChooseSkeleton,
} from '@/packages/components/common';
import { useUser } from '@/packages/contexts/user/UserContext';
import { useRouter } from 'next/navigation';

type CtaCase = 'services' | 'review';

export default function AboutPage() {
  const { texts } = useI18n();
  const { user } = useUser();
  const router = useRouter();
  const isMobile = useIsMobile(1024);
  const aboutHeroTexts = texts.pages.about.hero;
  const storyTexts = texts.components.common.story;
  const valuesTexts = texts.components.common.values;
  const whyChooseTexts = texts.components.common.whyChoose;
  const servicesPreviewTexts = texts.components.common.servicesPreview;
  const reviewsSectionTexts = texts.components.common.reviewsSection;
  const reviewsLists = texts.components.reviews.reviews;

  const handleNavigation = (section: CtaCase) => {
    switch (section) {
      case 'review':
        router.push('/reviews');
        break;

      case 'services':
        router.push('/services');
        break;
      default:
        console.warn(`No redirect defined for ${section}`);
    }
  };
  return (
    <main className={styles.container}>
      {aboutHeroTexts ? <AboutHero {...aboutHeroTexts} /> : <AboutHeroSkeleton />}

      {storyTexts ? <Story {...storyTexts} /> : <StorySkeleton />}

      {valuesTexts ? (
        <Values {...valuesTexts} theme={user?.theme ?? 'light'} isMobile={isMobile} />
      ) : (
        <ValuesSkeleton />
      )}

      {whyChooseTexts ? <WhyChoose {...whyChooseTexts} /> : <WhyChooseSkeleton />}

      {servicesPreviewTexts ? (
        <ServicesPreview
          {...servicesPreviewTexts}
          theme={user?.theme ?? 'light'}
          onClick={() => handleNavigation('services')}
        />
      ) : (
        <ServicesPreviewSkeleton />
      )}

      {reviewsSectionTexts ? (
        <ReviewsSection {...reviewsSectionTexts} items={reviewsLists} />
      ) : (
        <ReviewsSectionSkeleton />
      )}

      {/* Blog */}
    </main>
  );
}
