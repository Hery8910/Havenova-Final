'use client';

import styles from './page.module.css';
import { useI18n } from '../../../../../packages/contexts/i18n/I18nContext';
import { useLang } from '../../../../../packages/hooks/useLang';
import { AppInstallSection } from '../../../../../packages/components/client/pages/home/AppInstallSection';
import type { AppInstallSectionTexts } from '../../../../../packages/components/client/pages/home/AppInstallSection';
import { ServicesSection } from '../../../../../packages/components/client/pages/home/ServicesSection';
import { BenefitsSection } from '../../../../../packages/components/client/pages/home/BenefitsSection';
import {
  PageHero,
  PageHeroContent,
} from '../../../../../packages/components/client/pages/hero/PageHero';

export interface HomePageTexts {
  hero: PageHeroContent;
  appInstall: AppInstallSectionTexts['appInstall'];
  appInstalled: AppInstallSectionTexts['appInstalled'];
  services: {
    title: string;
    subtitle: string;
    items: {
      title: string;
      description: string;
      highlights: string[];
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
      <PageHero texts={home.hero} lang={lang} />
      <AppInstallSection
        texts={{ appInstall: home.appInstall, appInstalled: home.appInstalled }}
        lang={lang}
      />
      <ServicesSection texts={home.services} lang={lang} />
      <BenefitsSection texts={home.benefits} />
    </main>
  );
}
