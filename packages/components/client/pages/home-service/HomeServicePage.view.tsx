import { FAQSection } from '../../faqSection';
import { PageHero } from '../hero';
import { AuthRequiredAlert, ServiceCrossCtaSection, ServiceRequestPageLayout } from '../shared';
import HomeServiceRequestForm from './HomeServiceRequestForm/HomeServiceRequestForm';
import type { HomeServiceRequestFormSubmission } from './HomeServiceRequestForm/homeServiceRequest.types';
import type { HomeServicePageTexts } from './homeServicePage.types';

interface HomeServicePageViewProps {
  homeService: HomeServicePageTexts;
  lang: 'de' | 'en' | 'es';
  isLogged: boolean;
  isAlertClosed: boolean;
  isSubmitting: boolean;
  onCloseAuthAlert: () => void;
  onRequireAuth: () => void;
  onSubmit: (payload: HomeServiceRequestFormSubmission) => Promise<boolean>;
}

export function HomeServicePageView({
  homeService,
  lang,
  isLogged,
  isAlertClosed,
  isSubmitting,
  onCloseAuthAlert,
  onRequireAuth,
  onSubmit,
}: HomeServicePageViewProps) {
  return (
    <ServiceRequestPageLayout
      dataPage="home-service"
      hero={<PageHero texts={homeService.hero} lang={lang} />}
      alert={
        !isLogged && !isAlertClosed ? (
          <AuthRequiredAlert texts={homeService.authAlert} lang={lang} onClose={onCloseAuthAlert} />
        ) : null
      }
      form={
        <HomeServiceRequestForm
          texts={homeService.form}
          loading={isSubmitting}
          canSubmit={isLogged}
          onRequireAuth={onRequireAuth}
          onSubmit={onSubmit}
        />
      }
      faq={<FAQSection texts={homeService.faq} />}
      related={
        <ServiceCrossCtaSection
          texts={homeService.relatedServiceCta}
          lang={lang}
          surface="cleaning-service"
        />
      }
    />
  );
}
