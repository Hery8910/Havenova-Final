'use client';
import React from 'react';
import { useIsMobile, useLang } from '@/packages/hooks';
import styles from './page.module.css';
import AboutHero from '@/packages/components/pages/aboutHero/AboutHero';
import AboutHeroSkeleton from '@/packages/components/pages/aboutHero/AboutHero.skeleton';
import { useI18n } from '@/packages/contexts/i18n/I18nContext';
import {
  Story,
  StorySkeleton,
  ReviewsSection,
  ReviewsSectionSkeleton,
  Values,
  ValuesSkeleton,
  WhyChoose,
  WhyChooseSkeleton,
} from '@/packages/components/client';
import { useProfile } from '@/packages/contexts/profile/ProfileContext';
import { useRouter } from 'next/navigation';
import { ServicesSection } from '../../../../../packages/components/pages';
import { href } from '../../../../../packages/utils/navigation';

type CtaCase = 'services' | 'review';

export default function AboutPage() {
  const { texts } = useI18n();
  const { profile } = useProfile();
  const router = useRouter();
  const lang = useLang();
  const isMobile = useIsMobile(1024);
  const aboutHeroTexts = texts.pages.about.hero;
  const storyTexts = texts.components.common.story;
  const valuesTexts = texts.components.common.values;
  const whyChooseTexts = texts.components.common.whyChoose;
  const servicesSectionTexts = texts.pages.services.servicesSection;
  const servicesList = texts.components.services.servicesList;
  const reviewsSectionTexts = texts.components.common.reviewsSection;
  const reviewsLists = texts.components.reviews.reviews;

  const handleNavigation = (section: CtaCase) => {
    switch (section) {
      case 'review':
        router.push(href(lang, '/reviews'));
        break;

      case 'services':
        router.push('/services');
        break;
      default:
        console.warn(`No redirect defined for ${section}`);
    }
  };

  const handleItemClick = (service: string) => {
    router.push(href(lang, `/services/${service}`));
  };

  return (
    <main className={styles.container}>
      {aboutHeroTexts ? <AboutHero {...aboutHeroTexts} /> : <AboutHeroSkeleton />}

      {storyTexts ? <Story {...storyTexts} /> : <StorySkeleton />}

      {valuesTexts ? (
        <Values {...valuesTexts} theme={profile?.theme ?? 'light'} isMobile={isMobile} />
      ) : (
        <ValuesSkeleton />
      )}

      {whyChooseTexts ? <WhyChoose {...whyChooseTexts} /> : <WhyChooseSkeleton />}

      <ServicesSection
        services={false}
        {...servicesSectionTexts}
        items={servicesList}
        theme={profile?.theme}
        handleItemClick={handleItemClick}
        handleCTAClick={() => handleNavigation('services')}
      />

      {reviewsSectionTexts ? (
        <ReviewsSection {...reviewsSectionTexts} items={reviewsLists} />
      ) : (
        <ReviewsSectionSkeleton />
      )}

      {/* Blog */}
    </main>
  );
}
