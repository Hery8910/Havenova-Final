'use client';
import { useUser } from '../../../packages/contexts/user/UserContext';
import { Suspense, useEffect, useState } from 'react';

import { useClient } from '../../../packages/contexts/client/ClientContext';
import AlertPopup from '../../../packages/components/alertPopup/AlertPopup';
import { useI18n } from '../../../packages/contexts/i18n/I18nContext';

import HomeHero from '../../../packages/components/pages/homeHero/HomeHero';
import WelcomeOfferBanner from '@/packages/components/common/welcomeOfferBanner/WelcomeOfferBanner';
import WelcomeOfferBannerSkeleton from '@/packages/components/common/welcomeOfferBanner/WelcomeOfferBanner.skeleton';
import HowItWorks from '../../../packages/components/common/howItWorks/HowItWorks';
import WhyChoose from '../../../packages/components/common/whyChoose/WhyChoose';
import FAQPreview from '../../../packages/components/common/faqPreview/FAQPreview';
import TestimonialsPreview from '../../../packages/components/common/testimonials/testimonialsPreview/Testimonials';
import ServicesPreview from '../../../packages/components/common/servicePreview/ServicesPreview';
import FinalCTA from '../../../packages/components/common/finalCTA/FinalCTA';
import Loading from '../../../packages/components/layout/loading/Loading';
import HomeHeroSkeleton from '../../../packages/components/pages/homeHero/HomeHero.skeleton';
import SkeletonHowItWorks from '../../../packages/components/common/howItWorks/HowItWorks.skeleton';
import SkeletonServicesPreview from '../../../packages/components/common/servicePreview/ServicesPreview.skeleton';
import SkeletonWhyChoose from '../../../packages/components/common/whyChoose/WhyChoose.skeleton';
import { useRouter } from 'next/navigation';
import {
  HowItWorksSkeleton,
  ServicesPreviewSkeleton,
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
    type: 'success' | 'error';
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
        type: 'error',
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

  if (!client || loading || !user) return <Loading />;

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

      <TestimonialsPreview {...testimonialsTexts} mobile={isMobile} />
      <FAQPreview {...faqPreviewTexts} />
      <FinalCTA {...finalCtaTexts} />

      {alert && (
        <AlertPopup
          type={alert.type}
          title={alert.title}
          description={alert.description}
          onClose={() => setAlert(null)}
        />
      )}
    </main>
  );
}
