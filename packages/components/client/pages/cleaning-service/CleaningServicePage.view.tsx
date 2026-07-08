import { FAQSection } from '../../faqSection';
import { PageHero } from '../hero';
import { AuthRequiredAlert, ServiceCrossCtaSection, ServiceRequestPageLayout } from '../shared';
import CleaningRequestForm from './CleaningRequestForm/CleaningRequestForm';
import type { CleaningRequestFormSubmission } from './CleaningRequestForm/CleaningRequestForm';
import type { CleaningServicePageTexts } from './cleaningService.types';

interface CleaningServicePageViewProps {
  cleaning: CleaningServicePageTexts;
  lang: 'de' | 'en' | 'es';
  isLogged: boolean;
  isAlertClosed: boolean;
  isSubmitting: boolean;
  formResetKey: number;
  draftOwnerKey: string;
  draftStorageKey: string;
  onCloseAuthAlert: () => void;
  onRequireAuth: () => void;
  onSubmit: (payload: CleaningRequestFormSubmission) => Promise<boolean>;
}

export function CleaningServicePageView({
  cleaning,
  lang,
  isLogged,
  isAlertClosed,
  isSubmitting,
  formResetKey,
  draftOwnerKey,
  draftStorageKey,
  onCloseAuthAlert,
  onRequireAuth,
  onSubmit,
}: CleaningServicePageViewProps) {
  return (
    <ServiceRequestPageLayout
      dataPage="cleaning-service"
      hero={<PageHero texts={cleaning.hero} lang={lang} />}
      alert={
        !isLogged && !isAlertClosed ? (
          <AuthRequiredAlert texts={cleaning.authAlert} lang={lang} onClose={onCloseAuthAlert} />
        ) : null
      }
      form={
        <CleaningRequestForm
          key={formResetKey}
          texts={cleaning.form}
          loading={isSubmitting}
          canSubmit={isLogged}
          draftStorageKey={draftStorageKey}
          draftOwnerKey={draftOwnerKey}
          onRequireAuth={onRequireAuth}
          onSubmit={onSubmit}
        />
      }
      faq={<FAQSection texts={cleaning.faq} />}
      related={
        <ServiceCrossCtaSection
          texts={cleaning.relatedServiceCta}
          lang={lang}
          surface="home-service"
        />
      }
    />
  );
}
