'use client';

import { useState } from 'react';
import {
  AuthRequiredAlert,
  CleaningRequestForm,
  type CleaningRequestFormSubmission,
  Hero,
} from '../../../../../../packages/components/client/pages/cleaning-service';
import { useLang } from '../../../../../../packages/hooks';
import {
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
import type { PopupsTexts } from '../../../../../../packages/contexts/alert/alert.types';
import { createCleaningRequest } from '../../../../../../packages/services';
import {
  type CleaningCustomerType,
  PropertySizeRange,
  type UpdateUserClientProfileInput,
  type UserSavedAddress,
} from '../../../../../../packages/types';
import { getPopup } from '../../../../../../packages/utils';
import styles from './page.module.css';

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

export interface CleaningServicePageTexts {
  hero: {
    icon: {
      src: string;
      alt: string;
    };
    title: string;
    accent: string;
    title2: string;
    description: string;
  };
  authAlert: {
    title: string;
    description: string;
    closeLabel: string;
    ctas: {
      login: { label: string; href: string };
      register: { label: string; href: string };
    };
  };
  form: {
    process: {
      title: string;
      description: string;
      stepLabel: string;
      steps: {
        customerFrequency: {
          heading: string;
          ariaLabel?: string;
        };
        propertyDetails: {
          heading: string;
          ariaLabel?: string;
        };
        scheduling: {
          heading: string;
          ariaLabel?: string;
        };
        serviceAddress: {
          heading: string;
          ariaLabel?: string;
        };
      };
    };
    customerType: {
      label: string;
      options: Record<CleaningCustomerType, string>;
    };
    frequency: {
      label: string;
      options: Record<'once' | 'two_per_month' | 'three_per_month' | 'weekly', string>;
      discounts: Record<'once' | 'two_per_month' | 'three_per_month' | 'weekly', string>;
      recommendedLabel: string;
    };
    property: {
      title: string;
      sizeRangeLabel: string;
      sizeRangeOptions: Record<PropertySizeRange, string>;
      roomsCountLabel: string;
      hasBalconyLabel: string;
      hasIndoorStairsLabel: string;
      hasPetsLabel: string;
      detailsLabel: string;
      detailsPlaceholder: string;
    };
    common: {
      yes: string;
      no: string;
      next: string;
      review: string;
      back: string;
      submit: string;
    };
    errors: {
      required: string;
      invalid: string;
      roomsRange: string;
      detailsTooLong: string;
      unsafeInput: string;
    };
    scheduling?: {
      title?: string;
      description?: string;
      slotsTitle?: string;
      noDateSelected?: string;
      noAvailability?: string;
      blockedBadge?: string;
      selectedBadge?: string;
      availableBadge?: string;
      closeSlotsLabel?: string;
      loading?: string;
      errorPrefix?: string;
      previousMonth?: string;
      nextMonth?: string;
      nonWorkday?: string;
      blockedDay?: string;
      availableDay?: string;
      monthNavigationAriaLabel?: string;
      weekdayLabels?: string[];
      required?: string;
      missingClientConfig?: string;
    };
    serviceAddress?: {
      title?: string;
      description?: string;
      loading?: string;
      optionsLegend?: string;
      useDifferentAddressLabel?: string;
      useDifferentAddressHint?: string;
      emptyState?: string;
      manualHint?: string;
      saveToProfileLabel?: string;
      savedAddressLabel?: string;
      savedAddressPlaceholder?: string;
      addressDetailsAriaLabel?: string;
      fields?: {
        street?: string;
        streetNumber?: string;
        postalCode?: string;
        district?: string;
        floor?: string;
      };
      stepAriaLabel?: string;
      required?: string;
    };
    review: {
      title: string;
      description: string;
      sections: {
        customer: string;
        property: string;
        scheduling: string;
        address: string;
      };
      labels: {
        customerType: string;
        frequency: string;
        sizeRange: string;
        roomsCount: string;
        hasBalcony: string;
        hasIndoorStairs: string;
        hasPets: string;
        details: string;
        visitDate: string;
        visitTime: string;
        addressSource: string;
        addressLabel: string;
        address: string;
        saveToProfile: string;
      };
      sourceOptions: {
        primary: string;
        saved: string;
        new: string;
      };
      emptyDetails: string;
      finalNote: string;
    };
  };
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

export default function CleaningService() {
  const lang = useLang();
  const { auth } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { texts } = useI18n();
  const { showError, showLoading, showSuccess, closeAlert } = useGlobalAlert();
  const cleaning = texts.pages.client.cleaning as CleaningServicePageTexts;
  const [isAlertClosed, setIsAlertClosed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);

  const popupTexts: PopupsTexts = texts?.popups ?? {
    ...fallbackPopups,
    button: fallbackButtons,
  };

  const handleMainFormSubmit = async (payload: CleaningRequestFormSubmission) => {
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
      return;
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
        const currentSavedAddresses = profile.savedAddresses ?? [];
        const nextSavedAddress: UserSavedAddress = {
          label: payload.workAddress.label?.trim() || undefined,
          address: payload.workAddress.address,
        };
        const hasSameAddress = nextSavedAddress
          ? currentSavedAddresses.some(
              (savedAddress) =>
                savedAddress.label === nextSavedAddress.label &&
                savedAddress.address.street === nextSavedAddress.address.street &&
                savedAddress.address.streetNumber === nextSavedAddress.address.streetNumber &&
                savedAddress.address.postalCode === nextSavedAddress.address.postalCode &&
                savedAddress.address.district === nextSavedAddress.address.district &&
                (savedAddress.address.floor || '') === (nextSavedAddress.address.floor || '')
            )
          : false;
        const mergedSavedAddresses: UserSavedAddress[] =
          nextSavedAddress && !hasSameAddress
            ? [...currentSavedAddresses, nextSavedAddress]
            : currentSavedAddresses;
        const profileUpdate: UpdateUserClientProfileInput = {
          savedAddresses: mergedSavedAddresses,
        };

        await updateProfile(profileUpdate);
      }

      const response = await createCleaningRequest({
        clientId: auth.clientId,
        userId: auth.userId || undefined,
        ...payload,
      });

      if (!response.success) {
        const error = new Error(response.message || 'Cleaning request submission failed') as Error & {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      {!auth?.isLogged && !isAlertClosed && (
        <AuthRequiredAlert
          texts={cleaning.authAlert}
          lang={lang}
          onClose={() => setIsAlertClosed(true)}
        />
      )}
      <Hero texts={cleaning.hero} />
      <CleaningRequestForm
        key={formResetKey}
        texts={cleaning.form}
        loading={isSubmitting}
        canSubmit={Boolean(auth?.isLogged)}
        onRequireAuth={() => setIsAlertClosed(false)}
        onSubmit={handleMainFormSubmit}
      />
    </main>
  );
}
