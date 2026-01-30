'use client';

import styles from './page.module.css';
import { useI18n } from '../../../../../packages/contexts/i18n/I18nContext';
import { useLang } from '../../../../../packages/hooks/useLang';
import { HeroSection } from '../../../../../packages/components/client/pages/home/HeroSection';
import { AppInstallSection } from '../../../../../packages/components/client/pages/home/AppInstallSection';
import { ServicesSection } from '../../../../../packages/components/client/pages/home/ServicesSection';
import { BenefitsSection } from '../../../../../packages/components/client/pages/home/BenefitsSection';

export interface HomePageTexts {
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    ctas: {
      cleaning: { label: string; href: string };
      maintenance: { label: string; href: string };
    };
    image: {
      src: string;
      alt: string;
      badgeTitle: string;
      badgeSubtitle: string;
      tag: string;
    };
  };
  appInstall: {
    kicker: string;
    title: string;
    description: string;
    primaryCta: { label: string; installedLabel: string };
    secondaryCta: { label: string };
    features: string[];
  };
  appInstalled: {
    kicker: string;
    title: string;
    description: string;
    primaryCta: { label: string };
  };
  services: {
    title: string;
    subtitle: string;
    items: {
      title: string;
      description: string;
      ctaLabel: string;
      href: string;
      icon: string;
    }[];
  };
  benefits: {
    kicker: string;
    title: string;
    description: string;
    items: { title: string; description: string }[];
  };
}

export default function Home() {
  const lang = useLang();
  const { texts } = useI18n();
  const home: HomePageTexts = texts?.pages?.client?.home;

  if (!home) return null;

  return (
    <main className={styles.main}>
      <HeroSection texts={home.hero} lang={lang} />
      <AppInstallSection
        texts={{ appInstall: home.appInstall, appInstalled: home.appInstalled }}
        lang={lang}
      />
      <ServicesSection texts={home.services} lang={lang} />
      <BenefitsSection texts={home.benefits} />
    </main>
  );
}
