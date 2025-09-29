'use client';
import { useUser } from '../../../packages/contexts/user/UserContext';
import { useEffect, useState } from 'react';

import { useClient } from '../../../packages/contexts/client/ClientContext';
import { AlertWrapper } from '../../../packages/components/alert';
import { useI18n } from '../../../packages/contexts/i18n/I18nContext';

import HomeHero from '@/packages/components/pages/homeHero/HomeHero';
import WelcomeOfferBanner from '@/packages/components/common/welcomeOfferBanner/WelcomeOfferBanner';
import WelcomeOfferBannerSkeleton from '@/packages/components/common/welcomeOfferBanner/WelcomeOfferBanner.skeleton';
import HowItWorks from '../../../packages/components/common/howItWorks/HowItWorks';
import WhyChoose from '../../../packages/components/common/whyChoose/WhyChoose';
import ServicesPreview from '../../../packages/components/common/servicePreview/ServicesPreview';
import FinalCTA from '../../../packages/components/common/finalCTA/FinalCTA';
import Loading from '../../../packages/components/loading/Loading';
import HomeHeroSkeleton from '../../../packages/components/pages/homeHero/HomeHero.skeleton';
import { useRouter } from 'next/navigation';
import {
  FAQSection,
  FAQSectionSkeleton,
  FinalCTASkeleton,
  HowItWorksSkeleton,
  ServicesPreviewSkeleton,
  Testimonials,
  TestimonialsSkeleton,
  WhyChooseSkeleton,
} from '../../../packages/components/common';

export type HomeCtaCase = 'hero' | 'offer' | 'about' | 'services' | 'review' | 'faq' | 'ctaFinal';

export default function Home() {
  const { client, loading } = useClient();
  const { registerSessionCallback, user } = useUser();
  const router = useRouter();
  const { texts } = useI18n();
  const homeHeroTexts = texts.pages.home.hero;
  const howItWorksTexts = texts.components.common.howItWorks;
  const servicesPreviewTexts = texts.components.common.servicesPreview;
  const whyChooseTexts = texts.components.common.whyChoose;
  const testimonialsTexts = texts.components.common.testimonials;
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
        router.push('/services');
        break;
      case 'offer':
        router.push('/user/register');
        break;
      case 'about':
        router.push('/about');
        break;
      case 'services':
        router.push('/services');
        break;
      case 'review':
        router.push('/reviews');
        break;
      case 'faq':
        router.push('/faq');
        break;
      case 'ctaFinal':
        router.push('/services');
        break;
      default:
        console.warn(`No redirect defined for ${section}`);
    }
  };

  if (!client || loading || !user) return <Loading theme={user?.theme ?? 'light'} />;

  return (
    <main>
      {homeHeroTexts ? (
        <HomeHero {...homeHeroTexts} onClick={() => handleNavigation('hero')} />
      ) : (
        <HomeHeroSkeleton />
      )}

      {welcomeOfferTexts ? (
        <WelcomeOfferBanner {...welcomeOfferTexts} onClick={() => handleNavigation('offer')} />
      ) : (
        <WelcomeOfferBannerSkeleton />
      )}

      {howItWorksTexts ? (
        <HowItWorks {...howItWorksTexts} onClick={() => handleNavigation('about')} />
      ) : (
        <HowItWorksSkeleton />
      )}

      {servicesPreviewTexts ? (
        <ServicesPreview
          {...servicesPreviewTexts}
          theme={user?.theme ?? 'light'}
          onClick={() => handleNavigation('about')}
        />
      ) : (
        <ServicesPreviewSkeleton />
      )}

      {whyChooseTexts ? <WhyChoose {...whyChooseTexts} /> : <WhyChooseSkeleton />}

      {testimonialsTexts ? <Testimonials {...testimonialsTexts} /> : <TestimonialsSkeleton />}

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
