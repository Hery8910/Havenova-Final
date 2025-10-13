'use client';
import { useUser } from '@/packages/contexts/user/UserContext';
import { useEffect, useState } from 'react';

import { useClient } from '@/packages/contexts/client/ClientContext';
import { AlertWrapper } from '@/packages/components/alert';
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
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FAQSection,
  FAQSectionSkeleton,
  FinalCTASkeleton,
  HowItWorksSkeleton,
  ReviewsSection,
  ReviewsSectionSkeleton,
} from '@/packages/components/common';
import { ServicesSection } from '@/packages/components/pages';

export type HomeCtaCase = 'hero' | 'offer' | 'about' | 'services' | 'review' | 'faq' | 'ctaFinal';

export default function Home() {
  const { client, loading } = useClient();
  const { registerSessionCallback, user } = useUser();
  const router = useRouter();
  const lang = useLang();
  const { texts } = useI18n();
  const searchParams = useSearchParams();

  const homeHeroTexts = texts.pages.home.hero;
  const howItWorksTexts = texts.components.common.howItWorks;
  const servicesSectionTexts = texts.pages.services.servicesSection;
  const servicesList = texts.components.services.servicesList;
  const whyChooseTexts = texts.components.common.whyChoose;
  const reviewsSectionTexts = texts.components.common.reviewsSection;
  const reviewsLists = texts.components.reviews.reviews;
  const faqPreviewTexts = texts.components.common.faq;
  const welcomeOfferTexts = texts.components.common.welcomeOfferBanner;
  const finalCtaTexts = texts.components.common.finalCta;

  const popups = texts.popups;
  const [isMobile, setIsMobile] = useState(false);
  const [alert, setAlert] = useState<{
    status: number;
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const status = searchParams.get('status');
    const code = searchParams.get('code');
    const http = Number(searchParams.get('http'));

    if (status && code) {
      const popupData = texts.popups?.[code] || {};
      setAlert({
        status: http || (status === 'success' ? 200 : 400),
        title: popupData.title || (status === 'success' ? 'Success' : 'Error'),
        description: popupData.description || '',
      });
      setTimeout(() => {
        setAlert(null);
      }, 3000);
      // limpiar la URL
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    registerSessionCallback(() => {
      setAlert({
        status: 401,
        title: popups?.SESSION_EXPIRED?.title || 'Session expired',
        description:
          popups?.SESSION_EXPIRED?.description || 'Your session has expired. Please log in again.',
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texts]);

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

  if (!client || loading || !user) return <Loading theme={user?.theme ?? 'light'} />;

  return (
    <main>
      {homeHeroTexts ? (
        <HomeHero {...homeHeroTexts} onClick={() => handleNavigation('hero')} />
      ) : (
        <HomeHeroSkeleton />
      )}

      {welcomeOfferTexts && user.role === 'guest' && (
        <WelcomeOfferBanner {...welcomeOfferTexts} onClick={() => handleNavigation('offer')} />
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
        theme={user.theme}
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

      {alert && <AlertWrapper response={alert} onClose={() => setAlert(null)} />}
    </main>
  );
}
