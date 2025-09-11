'use client';
import { useUser } from '../../../packages/contexts/UserContext';
import { Suspense, useEffect, useState } from 'react';

import { useClient } from '../../../packages/contexts/ClientContext';
import AlertPopup from '../../../packages/components/alertPopup/AlertPopup';
import { useI18n } from '../../../packages/contexts/I18nContext';

import HomeHero from '../../../packages/components/pages/home/homeHero/HomeHero';
import WelcomeOfferBanner from '../../../packages/components/common/welcomeOfferBanner/WelcomeOfferBanner';
import HowItWorks from '../../../packages/components/common/howItWorks/HowItWorks';
import WhyChoose from '../../../packages/components/common/whyChoose/WhyChoose';
import FAQPreview from '../../../packages/components/common/faqPreview/FAQPreview';
import TestimonialsPreview from '../../../packages/components/common/testimonials/testimonialsPreview/Testimonials';
import ServicesPreview from '../../../packages/components/common/servicePreview/ServicesPreview';
import FinalCTA from '../../../packages/components/common/finalCTA/FinalCTA';
import Loading from '../../../packages/components/layout/loading/Loading';
import HomeHeroSkeleton from '../../../packages/components/pages/home/homeHero/HomeHero.skeleton';
import SkeletonWelcomeOfferBanner from '../../../packages/components/common/welcomeOfferBanner/WelcomeOfferBanner.skeleton';
import SkeletonHowItWorks from '../../../packages/components/common/howItWorks/HowItWorks.skeleton';
import SkeletonServicesPreview from '../../../packages/components/common/servicePreview/ServicesPreview.skeleton';
import SkeletonWhyChoose from '../../../packages/components/common/whyChoose/WhyChoose.skeleton';

export default function Home() {
  const { client, loading } = useClient();
  const { registerSessionCallback, user } = useUser();

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
  // const [showHero, setShowHero] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => setShowHero(true), 5000); // simula delay
  //   return () => clearTimeout(timer);
  // }, []);

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

  if (!client || loading || !user) return <Loading />;

  return (
    <main>
      <Suspense fallback={<HomeHeroSkeleton />}>
        <HomeHero {...homeHeroTexts} />
      </Suspense>

      {/* test */}
      {/* <Suspense fallback={<SkeletonWhyChoose />}>
        {showHero ? <WhyChoose {...whyChooseTexts} /> : <SkeletonServicesPreview />}
      </Suspense> */}

      <Suspense fallback={<SkeletonWelcomeOfferBanner />}>
        <WelcomeOfferBanner {...welcomeOfferTexts} />
      </Suspense>

      <Suspense fallback={<SkeletonHowItWorks />}>
        <HowItWorks {...howItWorksTexts} />
      </Suspense>

      <Suspense fallback={<SkeletonServicesPreview />}>
        <ServicesPreview {...servicesPreviewTexts} theme={user?.theme ?? 'light'} />
      </Suspense>

      <Suspense fallback={<SkeletonWhyChoose />}>
        <WhyChoose {...whyChooseTexts} />
      </Suspense>

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
