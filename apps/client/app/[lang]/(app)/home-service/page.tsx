'use client';

import { useState } from 'react';
import { AuthRequiredAlert } from '../../../../../../packages/components/client/pages/cleaning-service';
import {
  HomeServiceRequestForm,
  type HomeServiceRequestFormSubmission,
} from '../../../../../../packages/components/client/pages/home-service';
import {
  PageHero,
  type PageHeroContent,
} from '../../../../../../packages/components/client/pages/hero';
import {
  ServiceCrossCtaSection,
  type ServiceCrossCtaSectionTexts,
} from '../../../../../../packages/components/client/pages/shared';
import { FAQSection } from '../../../../../../packages/components/client/faqSection';
import type { FAQSectionTexts } from '../../../../../../packages/components/client/faqSection/FAQSection';
import {
  type PopupsTexts,
  useAuth,
  useGlobalAlert,
  useI18n,
  useProfile,
} from '../../../../../../packages/contexts';
import {
  fallbackButtons,
  fallbackGlobalError,
  fallbackPopups,
} from '../../../../../../packages/contexts/i18n';
import { useLang } from '../../../../../../packages/hooks';
import { createServiceRequest } from '../../../../../../packages/services';
import {
  type UpdateUserClientProfileInput,
  type UserSavedAddress,
} from '../../../../../../packages/types';
import { getPopup } from '../../../../../../packages/utils';
import styles from './page.module.css';

interface HomeServicePageTexts {
  hero: PageHeroContent;
  faq: FAQSectionTexts;
  relatedServiceCta: ServiceCrossCtaSectionTexts;
  authAlert: {
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
  };
  form: import('../../../../../../packages/components/client/pages/home-service').HomeServiceRequestFormTexts;
}

interface RequestError {
  message?: string;
  response?: {
    status?: number;
    data?: {
      errorCode?: string;
      code?: string;
      message?: string;
    };
  };
}

export default function HomeService() {
  const lang = useLang();
  const { texts } = useI18n();
  const { auth } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { showError, showLoading, showSuccess, closeAlert } = useGlobalAlert();
  const [isAlertClosed, setIsAlertClosed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const homeService = texts?.pages?.client?.['home-service'] as HomeServicePageTexts | undefined;
  const popupTexts: PopupsTexts = texts?.popups ?? {
    ...fallbackPopups,
    button: fallbackButtons,
  };

  if (!homeService) return null;

  const handleSubmit = async (payload: HomeServiceRequestFormSubmission) => {
    if (!auth?.isLogged) {
      showError({
        response: {
          status: 401,
          title: homeService.authAlert.title,
          description: homeService.authAlert.description,
          cancelLabel: fallbackButtons.close,
        },
        onCancel: closeAlert,
      });
      setIsAlertClosed(false);
      return false;
    }

    setIsSubmitting(true);
    const loadingPopup = getPopup(
      popupTexts,
      'GLOBAL_LOADING',
      'GLOBAL_LOADING',
      fallbackPopups.GLOBAL_LOADING
    );

    showLoading({
      response: {
        status: 102,
        title: loadingPopup.title,
        description: loadingPopup.description,
      },
    });

    try {
      if (payload.workAddress.source === 'new' && payload.workAddress.saveToProfile) {
        const currentSavedAddresses = profile.savedAddresses ?? [];
        const nextSavedAddress: UserSavedAddress = {
          label: payload.workAddress.label?.trim() || undefined,
          address: payload.workAddress.address,
        };
        const hasSameAddress = currentSavedAddresses.some(
          (savedAddress) =>
            savedAddress.label === nextSavedAddress.label &&
            savedAddress.address.street === nextSavedAddress.address.street &&
            savedAddress.address.streetNumber === nextSavedAddress.address.streetNumber &&
            savedAddress.address.postalCode === nextSavedAddress.address.postalCode &&
            savedAddress.address.district === nextSavedAddress.address.district &&
            (savedAddress.address.floor || '') === (nextSavedAddress.address.floor || '')
        );

        const profileUpdate: UpdateUserClientProfileInput = {
          savedAddresses: hasSameAddress
            ? currentSavedAddresses
            : [...currentSavedAddresses, nextSavedAddress],
        };

        await updateProfile(profileUpdate);
      }

      const response = await createServiceRequest({
        serviceType: payload.serviceType,
        customerType: payload.customerType,
        preferredVisitSlot: payload.preferredVisitSlot,
        workAddress: {
          address: payload.workAddress.address,
          source: payload.workAddress.source,
        },
        details: payload.details,
      });

      if (!response.success) {
        const error = new Error(
          response.message || 'Home service request submission failed'
        ) as Error & {
          response?: { status: number; data: { code?: string; message?: string } };
        };
        error.response = {
          status: 400,
          data: {
            code: response.code,
            message: response.message,
          },
        };
        throw error;
      }

      closeAlert();
      showSuccess({
        response: {
          status: 200,
          title: 'Request submitted',
          description: 'Your home service request was sent successfully.',
          cancelLabel: fallbackButtons.close,
        },
        onCancel: closeAlert,
      });
      return true;
    } catch (error: unknown) {
      const requestError = error as RequestError;
      closeAlert();
      const errorKey = requestError.response?.data?.errorCode || requestError.response?.data?.code;
      const popupData = getPopup(
        popupTexts,
        errorKey,
        'GLOBAL_INTERNAL_ERROR',
        fallbackGlobalError
      );

      showError({
        response: {
          status: requestError.response?.status || 500,
          title: popupData.title,
          description:
            popupData.description ||
            requestError.response?.data?.message ||
            requestError.message ||
            fallbackGlobalError.description,
          cancelLabel: popupData.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHero texts={homeService.hero} lang={lang} />
      <main id="app-main-content" tabIndex={-1} className={styles.main}>
        {!auth?.isLogged && !isAlertClosed && (
          <AuthRequiredAlert
            texts={homeService.authAlert}
            lang={lang}
            onClose={() => setIsAlertClosed(true)}
          />
        )}

        <HomeServiceRequestForm
          texts={homeService.form}
          loading={isSubmitting}
          canSubmit={Boolean(auth?.isLogged)}
          onRequireAuth={() => setIsAlertClosed(false)}
          onSubmit={handleSubmit}
        />

        <FAQSection texts={homeService.faq} />

        <ServiceCrossCtaSection
          texts={homeService.relatedServiceCta}
          lang={lang}
          surface="cleaning-service"
        />
      </main>
    </>
  );
}
