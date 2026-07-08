'use client';

import { useState } from 'react';
import {
  type PopupsTexts,
  useAuth,
  useGlobalAlert,
  useI18n,
  useProfile,
} from '../../../../contexts';
import {
  fallbackButtons,
  fallbackGlobalError,
  fallbackPopups,
} from '../../../../contexts/i18n';
import { createServiceRequest } from '../../../../services';
import { type UpdateUserClientProfileInput } from '../../../../types';
import { getPopup } from '../../../../utils';
import { mergeSavedAddressFromRequest } from '../shared';
import { HomeServicePageView } from './HomeServicePage.view';
import type { HomeServiceRequestFormSubmission } from './HomeServiceRequestForm/homeServiceRequest.types';
import type { HomeServicePageTexts } from './homeServicePage.types';

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

interface HomeServicePageClientProps {
  homeService?: HomeServicePageTexts;
  lang: 'de' | 'en' | 'es';
}

export function HomeServicePageClient({
  homeService,
  lang,
}: HomeServicePageClientProps) {
  const { texts } = useI18n();
  const { auth } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { showError, showLoading, showSuccess, closeAlert } = useGlobalAlert();
  const [isAlertClosed, setIsAlertClosed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const popupTexts: PopupsTexts = texts?.popups ?? {
    ...fallbackPopups,
    button: fallbackButtons,
  };

  if (!homeService) {
    return null;
  }

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
        const profileUpdate: UpdateUserClientProfileInput = {
          savedAddresses: mergeSavedAddressFromRequest(
            profile.savedAddresses ?? [],
            payload.workAddress
          ),
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
    <HomeServicePageView
      homeService={homeService}
      lang={lang}
      isLogged={Boolean(auth?.isLogged)}
      isAlertClosed={isAlertClosed}
      isSubmitting={isSubmitting}
      onCloseAuthAlert={() => setIsAlertClosed(true)}
      onRequireAuth={() => setIsAlertClosed(false)}
      onSubmit={handleSubmit}
    />
  );
}
