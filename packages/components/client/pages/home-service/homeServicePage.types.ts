import type { FAQSectionTexts } from '../../faqSection/FAQSection';
import type { PageHeroContent } from '../hero';
import type { ServiceCrossCtaSectionTexts } from '../shared';
import type { HomeServiceRequestFormTexts } from './HomeServiceRequestForm/HomeServiceRequestForm';

export interface HomeServiceAuthAlertTexts {
  title: string;
  description: string;
  closeLabel: string;
  a11y: {
    dialogLabel: string;
    actionsLabel: string;
    loginLabel: string;
    registerLabel: string;
  };
  ctas: {
    login: { label: string; href: string };
    register: { label: string; href: string };
  };
}

export interface HomeServicePageTexts {
  hero: PageHeroContent;
  faq: FAQSectionTexts;
  relatedServiceCta: ServiceCrossCtaSectionTexts;
  authAlert: HomeServiceAuthAlertTexts;
  form: HomeServiceRequestFormTexts;
}
