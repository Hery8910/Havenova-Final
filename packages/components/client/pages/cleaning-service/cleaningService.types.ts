import type { FAQSectionTexts } from '../../faqSection/FAQSection';
import type { PageHeroContent } from '../hero';
import type { ServiceCrossCtaSectionTexts } from '../shared';
import type { CleaningRequestFormTexts } from './CleaningRequestForm/cleaningRequest.types';

export interface CleaningServiceAuthAlertTexts {
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

export interface CleaningServicePageTexts {
  hero: PageHeroContent;
  faq: FAQSectionTexts;
  relatedServiceCta: ServiceCrossCtaSectionTexts;
  authAlert: CleaningServiceAuthAlertTexts;
  form: CleaningRequestFormTexts;
  submission: {
    loading: {
      title: string;
      description: string;
    };
    success: {
      title: string;
      description: string;
    };
    errors: {
      missingSession: {
        title: string;
        description: string;
      };
      unexpected: {
        title: string;
        description: string;
      };
    };
  };
}
