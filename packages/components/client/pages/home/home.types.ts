import type { PageHeroContent } from '../hero';
import type { AppInstallSectionTexts } from './AppInstallSection';

export interface HomeServicesSectionItemTexts {
  title: string;
  description: string;
  highlights: string[];
  ctaLabel: string;
  href: string;
  icon: string;
}

export interface HomeServicesSectionTexts {
  title: string;
  subtitle: string;
  items: HomeServicesSectionItemTexts[];
}

export interface HomeBenefitsSectionItemTexts {
  title: string;
  description: string;
}

export interface HomeBenefitsSectionTexts {
  title: string;
  description: string;
  items: HomeBenefitsSectionItemTexts[];
}

export interface HomePageTexts {
  hero: PageHeroContent;
  appInstall: AppInstallSectionTexts['appInstall'];
  appInstalled: AppInstallSectionTexts['appInstalled'];
  services: HomeServicesSectionTexts;
  benefits: HomeBenefitsSectionTexts;
}
