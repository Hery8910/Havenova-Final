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
import { createCleaningRequest } from '../../../../../../packages/services';
import {
  PropertySizeRange,
  type UpdateUserClientProfileInput,
  type UserSavedAddress,
} from '../../../../../../packages/types';
import { getPopup } from '../../../../../../packages/utils';
import styles from './page.module.css';

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
        };
        propertyDetails: {
          heading: string;
        };
        scheduling: {
          heading: string;
        };
        serviceAddress: {
          heading: string;
        };
      };
    };
    customerType: {
      label: string;
      options: Record<'private' | 'business', string>;
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
      required?: string;
      missingClientConfig?: string;
    };
    serviceAddress?: {
      required?: string;
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

const CLEANING_POPUP_FALLBACKS = {
  CLEANING_REQUEST_LOADING: {
    title: 'Anfrage wird gesendet',
    description: 'Ihre Reinigungsanfrage wird sicher verarbeitet.',
  },
  CLEANING_REQUEST_SUBMITTED: {
    title: 'Anfrage gesendet',
    description:
      'Ihre Reinigungsanfrage wurde erfolgreich gesendet. Wir melden uns mit dem nächsten Schritt bei Ihnen.',
  },
  CLEANING_REQUEST_MISSING_SESSION: {
    title: 'Anmeldung erforderlich',
    description:
      'Ihre Sitzung enthält nicht alle erforderlichen Daten. Bitte melden Sie sich erneut an und versuchen Sie es noch einmal.',
  },
};

const getCleaningFallbackTexts = (lang: 'de' | 'en'): CleaningServicePageTexts =>
  lang === 'en'
    ? {
        hero: {
          icon: {
            src: '/svg/cleaning.svg',
            alt: 'Cleaning service icon',
          },
          title: 'Professional',
          accent: 'Cleaning Service',
          title2: 'in Berlin',
          description:
            'Flexible, reliable, and tailored to your home or business. Havenova provides structured cleaning support for apartments, offices, and shared properties with clear communication, dependable scheduling, and consistent quality from request to completion.',
        },
        authAlert: {
          title: 'Account required to submit a cleaning request',
          description:
            'To send a cleaning service request, you need an active Havenova account and an active session. Please log in if you already have an account, or create one in a few steps.',
          closeLabel: 'Close account required notice',
          ctas: {
            login: { label: 'Go to login', href: '/user/login' },
            register: { label: 'Create account', href: '/user/register' },
          },
        },
        form: {
          process: {
            title: 'Complete your cleaning request in 4 steps',
            description:
              'Follow each step to provide the data we need for your first visit planning and service setup.',
            stepLabel: 'Step',
            steps: {
              customerFrequency: { heading: 'Customer and recurrence' },
              propertyDetails: { heading: 'Property details' },
              scheduling: { heading: 'First visit date and hour' },
              serviceAddress: { heading: 'Service address' },
            },
          },
          customerType: {
            label: 'Customer type',
            options: { private: 'Private', business: 'Business' },
          },
          frequency: {
            label: 'Preferred frequency',
            recommendedLabel: 'Most requested',
            options: {
              once: 'One-time',
              two_per_month: '2 times per month',
              three_per_month: '3 times per month',
              weekly: 'Weekly',
            },
            discounts: {
              once: '0% discount',
              two_per_month: '5% discount',
              three_per_month: '10% discount',
              weekly: '15% discount',
            },
          },
          property: {
            title: 'Property details',
            sizeRangeLabel: 'Property size range',
            sizeRangeOptions: {
              under_50: 'Under 50 m2',
              '50_80': '50 to 80 m2',
              '80_120': '80 to 120 m2',
              over_120: 'Over 120 m2',
            },
            roomsCountLabel: 'Number of rooms',
            hasBalconyLabel: 'Balcony',
            hasIndoorStairsLabel: 'Indoor stairs',
            hasPetsLabel: 'Pets in property',
            detailsLabel: 'Additional details (optional)',
            detailsPlaceholder:
              'Tell us about special cleaning needs, access notes, or preferences.',
          },
          common: {
            yes: 'Yes',
            no: 'No',
            next: 'Continue',
            back: 'Back',
            submit: 'Submit request',
          },
          errors: {
            required: 'This field is required.',
            invalid: 'Please enter a valid value.',
            roomsRange: 'Rooms count must be between 0 and 50.',
            detailsTooLong: 'Additional details must be 1500 characters or fewer.',
            unsafeInput: 'Please remove unsupported characters or scripts from this field.',
          },
          scheduling: {
            required: 'Please select a preferred date and time.',
            missingClientConfig: 'Client calendar configuration is unavailable right now.',
          },
          serviceAddress: {
            required: 'Please select or enter a work address.',
          },
        },
        submission: {
          loading: {
            title: 'Sending request',
            description: 'Your cleaning request is being processed securely.',
          },
          success: {
            title: 'Request sent',
            description:
              'Your cleaning request was submitted successfully. We will contact you with the next step.',
          },
          errors: {
            missingSession: {
              title: 'Login required',
              description:
                'Your session is missing required data. Please log in again and try once more.',
            },
            unexpected: {
              title: 'Unexpected error',
              description: 'Something went wrong. Please try again or contact support.',
            },
          },
        },
      }
    : {
        hero: {
          icon: {
            src: '/svg/cleaning.svg',
            alt: 'Symbol für Reinigungsservice',
          },
          title: 'Professioneller',
          accent: 'Reinigungsservice',
          title2: 'in Berlin',
          description:
            'Flexibel, zuverlässig und passend für Ihr Zuhause oder Ihr Unternehmen. Havenova bietet strukturierte Reinigungslösungen für Wohnungen, Büros und Gemeinschaftsflächen mit klarer Kommunikation, planbaren Terminen und gleichbleibender Qualität von der Anfrage bis zum Abschluss.',
        },
        authAlert: {
          title: 'Konto erforderlich, um eine Reinigungsanfrage zu senden',
          description:
            'Um eine Anfrage für den Reinigungsservice zu senden, benötigen Sie ein aktives Havenova-Konto und eine aktive Anmeldung. Melden Sie sich an, wenn Sie bereits ein Konto haben, oder erstellen Sie in wenigen Schritten ein neues Konto.',
          closeLabel: 'Hinweis zum erforderlichen Konto schließen',
          ctas: {
            login: { label: 'Zum Login', href: '/user/login' },
            register: { label: 'Konto erstellen', href: '/user/register' },
          },
        },
        form: {
          process: {
            title: 'Schließen Sie Ihre Reinigungsanfrage in 4 Schritten ab',
            description:
              'Folgen Sie den Schritten, damit wir alle Daten für die Erstbesichtigung und Einsatzplanung erhalten.',
            stepLabel: 'Schritt',
            steps: {
              customerFrequency: { heading: 'Kunde und Häufigkeit' },
              propertyDetails: { heading: 'Objektdetails' },
              scheduling: { heading: 'Erstbesuch: Datum und Uhrzeit' },
              serviceAddress: { heading: 'Einsatzadresse' },
            },
          },
          customerType: {
            label: 'Kundentyp',
            options: { private: 'Privat', business: 'Gewerblich' },
          },
          frequency: {
            label: 'Gewünschte Häufigkeit',
            recommendedLabel: 'Am meisten gefragt',
            options: {
              once: 'Einmalig',
              two_per_month: '2x pro Monat',
              three_per_month: '3x pro Monat',
              weekly: 'Wöchentlich',
            },
            discounts: {
              once: '0% Rabatt',
              two_per_month: '5% Rabatt',
              three_per_month: '10% Rabatt',
              weekly: '15% Rabatt',
            },
          },
          property: {
            title: 'Objektdetails',
            sizeRangeLabel: 'Flächenbereich',
            sizeRangeOptions: {
              under_50: 'Unter 50 m2',
              '50_80': '50 bis 80 m2',
              '80_120': '80 bis 120 m2',
              over_120: 'Über 120 m2',
            },
            roomsCountLabel: 'Anzahl der Räume',
            hasBalconyLabel: 'Balkon',
            hasIndoorStairsLabel: 'Innenliegende Treppen',
            hasPetsLabel: 'Haustiere im Objekt',
            detailsLabel: 'Zusätzliche Hinweise (optional)',
            detailsPlaceholder:
              'Teilen Sie uns besondere Reinigungswünsche, Zugangshinweise oder Präferenzen mit.',
          },
          common: {
            yes: 'Ja',
            no: 'Nein',
            next: 'Weiter',
            back: 'Zurück',
            submit: 'Anfrage absenden',
          },
          errors: {
            required: 'Dieses Feld ist erforderlich.',
            invalid: 'Bitte geben Sie einen gültigen Wert ein.',
            roomsRange: 'Die Raumanzahl muss zwischen 0 und 50 liegen.',
            detailsTooLong: 'Zusätzliche Hinweise dürfen maximal 1500 Zeichen enthalten.',
            unsafeInput: 'Bitte entfernen Sie nicht unterstützte Zeichen oder Skripte aus diesem Feld.',
          },
          scheduling: {
            required: 'Bitte wählen Sie ein bevorzugtes Datum und eine Uhrzeit aus.',
            missingClientConfig: 'Die Kalenderkonfiguration des Clients ist aktuell nicht verfügbar.',
          },
          serviceAddress: {
            required: 'Bitte wählen Sie eine Einsatzadresse aus oder geben Sie eine neue ein.',
          },
        },
        submission: {
          loading: {
            title: 'Anfrage wird gesendet',
            description: 'Ihre Reinigungsanfrage wird sicher verarbeitet.',
          },
          success: {
            title: 'Anfrage gesendet',
            description:
              'Ihre Reinigungsanfrage wurde erfolgreich gesendet. Wir melden uns mit dem nächsten Schritt bei Ihnen.',
          },
          errors: {
            missingSession: {
              title: 'Anmeldung erforderlich',
              description:
                'Ihre Sitzung enthält nicht alle erforderlichen Daten. Bitte melden Sie sich erneut an und versuchen Sie es noch einmal.',
            },
            unexpected: {
              title: 'Unerwarteter Fehler',
              description:
                'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support.',
            },
          },
        },
      };

export default function CleaningService() {
  const lang = useLang();
  const { auth } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { texts } = useI18n();
  const { showError, showLoading, showSuccess, closeAlert } = useGlobalAlert();
  const cleaning: CleaningServicePageTexts =
    texts?.pages?.client?.cleaning ?? getCleaningFallbackTexts(lang);
  const [isAlertClosed, setIsAlertClosed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);

  const popupTexts = texts?.popups ?? ({ ...fallbackPopups, button: fallbackButtons } as any);

  const handleMainFormSubmit = async (payload: CleaningRequestFormSubmission) => {
    if (!auth?.isLogged || !auth.clientId) {
      const sessionPopup = getPopup(
        popupTexts,
        'CLEANING_REQUEST_MISSING_SESSION',
        'AUTH_REQUIRED',
        cleaning.submission.errors.missingSession.title
          ? cleaning.submission.errors.missingSession
          : CLEANING_POPUP_FALLBACKS.CLEANING_REQUEST_MISSING_SESSION
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
      cleaning.submission.loading.title
        ? cleaning.submission.loading
        : CLEANING_POPUP_FALLBACKS.CLEANING_REQUEST_LOADING
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
        cleaning.submission.success.title
          ? cleaning.submission.success
          : CLEANING_POPUP_FALLBACKS.CLEANING_REQUEST_SUBMITTED
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
    } catch (error: any) {
      closeAlert();
      const errorKey = error?.response?.data?.errorCode || error?.response?.data?.code;
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
          status: error?.response?.status || 500,
          title: popupData.title,
          description:
            popupData.description ||
            error?.response?.data?.message ||
            error?.message ||
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
