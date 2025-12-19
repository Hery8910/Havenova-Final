'use client';
import { useProfile } from '@/packages/contexts/profile/ProfileContext';
import { useEffect, useRef, useState } from 'react';

import { useClient } from '@/packages/contexts/client/ClientContext';
import { useI18n } from '@/packages/contexts/i18n/I18nContext';
import { useLang } from '@/packages/hooks/useLang';
import { href } from '@/packages/utils/navigation';

import HomeHero from '@/packages/components/pages/homeHero/HomeHero';
import WelcomeOfferBanner from '@/packages/components/common/welcomeOfferBanner/WelcomeOfferBanner';
import WelcomeOfferBannerSkeleton from '@/packages/components/common/welcomeOfferBanner/WelcomeOfferBanner.skeleton';
import HowItWorks from '@/packages/components/common/howItWorks/HowItWorks';
import WhyChoose from '@/packages/components/common/whyChoose/WhyChoose';
import FinalCTA from '@/packages/components/common/finalCTA/FinalCTA';
import Loading from '@/packages/components/loading/Loading';
import HomeHeroSkeleton from '@/packages/components/pages/homeHero/HomeHero.skeleton';
import { useRouter } from 'next/navigation';
import {
  FAQSection,
  FAQSectionSkeleton,
  FinalCTASkeleton,
  HowItWorksSkeleton,
  ReviewsSection,
  ReviewsSectionSkeleton,
} from '@/packages/components/common';
import { ServicesSection } from '@/packages/components/pages';
import { useAuth } from '../../../../packages/contexts';

export type HomeCtaCase = 'hero' | 'offer' | 'about' | 'services' | 'review' | 'faq' | 'ctaFinal';

export default function Home() {
  const { client, loading } = useClient();
  const { profile, reloadProfile } = useProfile();
  const router = useRouter();
  const lang = useLang();
  const { texts } = useI18n();
  const { auth, refreshAuth } = useAuth();

  if (!client || loading || !profile) return <Loading theme={profile?.theme ?? 'dark'} />;

  const homeHeroTexts = texts.pages.home.hero;
  const howItWorksTexts = texts.components.common.howItWorks;
  const servicesSectionTexts = texts.pages.services.servicesSection;
  const servicesList = texts.components.services.servicesList;
  const whyChooseTexts = texts.components.common.whyChoose;
  const reviewsSectionTexts = texts.components.common.reviewsSection;
  const reviewsLists = texts.components.reviews.reviews;
  const faqPreviewTexts = texts.components.common.faq;
  const finalCtaTexts = texts.components.common.finalCta;

  const popups = texts.popups;
  const [isMobile, setIsMobile] = useState(false);
  const didRefreshRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Refrescar sesión y perfil si corresponde
  useEffect(() => {
    if (didRefreshRef.current) return;
    didRefreshRef.current = true;

    let isMounted = true;

    (async () => {
      await refreshAuth();
      if (!isMounted) return;

      // reloadProfile ya verifica permisos internamente
      await reloadProfile();
    })();

    return () => {
      isMounted = false;
    };
  }, [refreshAuth, reloadProfile]);

  const handleNavigation = (section: HomeCtaCase) => {
    switch (section) {
      case 'hero':
        router.push(href(lang, '/services'));
        break;
      case 'offer':
        router.push(href(lang, '/user/register'));
        break;
      case 'about':
        router.push(href(lang, '/about'));
        break;
      case 'services':
        router.push(href(lang, '/services'));
        break;
      case 'review':
        router.push(href(lang, '/reviews'));
        break;
      case 'faq':
        router.push(href(lang, '/faq'));
        break;
      case 'ctaFinal':
        router.push(href(lang, '/services'));
        break;
      default:
        console.warn(`No redirect defined for ${section}`);
    }
  };

  const handleItemClick = (service: string) => {
    router.push(href(lang, `/services/${service}`));
  };

  return (
    <main>
      {homeHeroTexts ? (
        <HomeHero {...homeHeroTexts} onClick={() => handleNavigation('hero')} />
      ) : (
        <HomeHeroSkeleton />
      )}

      {howItWorksTexts ? (
        <HowItWorks {...howItWorksTexts} onClick={() => handleNavigation('about')} />
      ) : (
        <HowItWorksSkeleton />
      )}

      <ServicesSection
        services={false}
        {...servicesSectionTexts}
        items={servicesList}
        theme={profile?.theme}
        handleItemClick={handleItemClick}
        handleCTAClick={() => handleNavigation('services')}
      />

      <WhyChoose {...whyChooseTexts} />

      {reviewsSectionTexts ? (
        <ReviewsSection {...reviewsSectionTexts} items={reviewsLists} />
      ) : (
        <ReviewsSectionSkeleton />
      )}

      {faqPreviewTexts ? (
        <FAQSection {...faqPreviewTexts} onClick={() => handleNavigation('faq')} />
      ) : (
        <FAQSectionSkeleton />
      )}

      {finalCtaTexts ? (
        <FinalCTA {...finalCtaTexts} onClick={() => handleNavigation('services')} />
      ) : (
        <FinalCTASkeleton />
      )}
    </main>
  );
}
