'use client';

import { useRouter } from 'next/navigation';
import {
  FAQSection,
  FAQSectionSkeleton,
  HowItWorksSection,
  WelcomeOfferBanner,
  WhyChoose,
} from '@/packages/components/common';
import { useI18n } from '@/packages/contexts/i18n';
import { useLang } from '@/packages/hooks';
import styles from './page.module.css';
import { useUser } from '@/packages/contexts/user/UserContext';
import { useClient } from '@/packages/contexts/client/ClientContext';
import Loading from '@/packages/components/loading/Loading';
import { href } from '@/packages/utils/navigation';
import ServicesHero from '@/packages/components/pages/services/servicesHero/ServicesHero';
import ServicesSection from '@/packages/components/pages/services/servicesSection/ServicesSection';

const Services = () => {
  const { client, loading } = useClient();
  const { user } = useUser();
  const router = useRouter();
  const lang = useLang();
  const { texts } = useI18n();

  const heroTexts = texts.pages.services.hero;
  const servicesSectionTexts = texts.pages.services.servicesSection;
  const servicesList = texts.components.services.servicesList;
  const howItWorksTexts = texts.pages.services.howItWorks;
  const welcomeOfferTexts = texts.components.common.welcomeOfferBanner;
  const whyChooseTexts = texts.components.common.whyChoose;
  const faqServicesTexts = texts.pages.services.faq;

  const handleItemClick = (service: string) => {
    router.push(`/services/${service}`);
  };

  const handleCTAClick = () => {
    router.push(href(lang, '/services'));
  };

  if (!client || loading || !user) return <Loading theme={user?.theme ?? 'light'} />;

  return (
    <main className={styles.main}>
      <ServicesHero {...heroTexts} />

      {user.role === 'guest' && (
        <WelcomeOfferBanner
          {...welcomeOfferTexts}
          onClick={() => router.push(href(lang, '/user/register'))}
        />
      )}

      <ServicesSection
        services={true}
        {...servicesSectionTexts}
        items={servicesList}
        theme={user.theme}
        handleItemClick={handleItemClick}
        handleCTAClick={handleCTAClick}
      />

      <HowItWorksSection {...howItWorksTexts} />

      <WhyChoose {...whyChooseTexts} />

      {faqServicesTexts ? (
        <FAQSection {...faqServicesTexts} onClick={() => router.push(href(lang, '/faq'))} />
      ) : (
        <FAQSectionSkeleton />
      )}
    </main>
  );
};

export default Services;
