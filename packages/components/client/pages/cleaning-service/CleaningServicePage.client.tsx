'use client';

import { useState } from 'react';
import {
  type PopupsTexts,
  useAuth,
  useGlobalAlert,
  useI18n,
  useProfile,
} from '../../../../contexts';
import { getI18nFallbacks } from '../../../../contexts/i18n';
import { createCleaningRequest } from '../../../../services';
import type { UpdateUserClientProfileInput } from '../../../../types';
import { getPopup } from '../../../../utils';
import { mergeSavedAddressFromRequest } from '../shared';
import { CleaningServicePageView } from './CleaningServicePage.view';
import type { CleaningRequestFormSubmission } from './CleaningRequestForm/CleaningRequestForm';
import type { CleaningServicePageTexts } from './cleaningService.types';

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

interface CleaningServicePageClientProps {
  cleaning?: CleaningServicePageTexts;
  lang: 'de' | 'en' | 'es';
}

export function CleaningServicePageClient({
  cleaning,
  lang,
}: CleaningServicePageClientProps) {
  const { fallbackButtons, fallbackGlobalError, fallbackPopups } = getI18nFallbacks(lang);
  const { auth } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { texts } = useI18n();
  const { showError, showLoading, showSuccess, closeAlert } = useGlobalAlert();
  const [isAlertClosed, setIsAlertClosed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);

  const popupTexts: PopupsTexts = texts?.popups ?? {
    ...fallbackPopups,
    button: fallbackButtons,
  };

  if (!cleaning) {
    return null;
  }

  const draftOwnerKey = auth?.userClientId || auth?.clientId || 'guest';
  const draftStorageKey = `cleaning-request-draft:v1:${draftOwnerKey}`;

  const handleSubmit = async (payload: CleaningRequestFormSubmission) => {
    if (!auth?.isLogged || !auth.clientId) {
      const sessionPopup = getPopup(
        popupTexts,
        'CLEANING_REQUEST_MISSING_SESSION',
        'AUTH_REQUIRED',
        fallbackPopups.CLEANING_REQUEST_MISSING_SESSION
      );

      showError({
        response: {
          status: 401,
          title: sessionPopup.title,
          description: sessionPopup.description,
          cancelLabel: sessionPopup.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });
      setIsAlertClosed(false);
      return false;
    }

    setIsSubmitting(true);
    const loadingPopup = getPopup(
      popupTexts,
      'CLEANING_REQUEST_LOADING',
      'GLOBAL_LOADING',
      fallbackPopups.CLEANING_REQUEST_LOADING
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

      const response = await createCleaningRequest({
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
          response.message || 'Cleaning request submission failed'
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
      const successPopup = getPopup(
        popupTexts,
        'CLEANING_REQUEST_SUBMITTED',
        'CLEANING_REQUEST_SUBMITTED',
        fallbackPopups.CLEANING_REQUEST_SUBMITTED
      );

      showSuccess({
        response: {
          status: 200,
          title: successPopup.title,
          description: successPopup.description,
          cancelLabel: successPopup.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });
      setFormResetKey((current) => current + 1);
      return true;
    } catch (error: unknown) {
      const requestError = error as RequestError;
      closeAlert();
      const errorKey = requestError.response?.data?.errorCode || requestError.response?.data?.code;
      const popupData = getPopup(
        popupTexts,
        errorKey,
        'GLOBAL_INTERNAL_ERROR',
        cleaning.submission.errors.unexpected.title
          ? cleaning.submission.errors.unexpected
          : fallbackGlobalError
      );

      showError({
        response: {
          status: requestError.response?.status || 500,
          title: popupData.title,
          description:
            popupData.description ||
            requestError.response?.data?.message ||
            requestError.message ||
            cleaning.submission.errors.unexpected.description,
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
    <CleaningServicePageView
      cleaning={cleaning}
      lang={lang}
      isLogged={Boolean(auth?.isLogged)}
      isAlertClosed={isAlertClosed}
      isSubmitting={isSubmitting}
      formResetKey={formResetKey}
      draftOwnerKey={draftOwnerKey}
      draftStorageKey={draftStorageKey}
      onCloseAuthAlert={() => setIsAlertClosed(true)}
      onRequireAuth={() => setIsAlertClosed(false)}
      onSubmit={handleSubmit}
    />
  );
}
