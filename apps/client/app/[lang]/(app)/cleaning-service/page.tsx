'use client';

import { useState } from 'react';
import {
  AuthRequiredAlert,
  CleaningRequestForm,
  Hero,
} from '../../../../../../packages/components/client/pages/cleaning-service';
import { useLang } from '../../../../../../packages/hooks';
import { useAuth, useI18n } from '../../../../../../packages/contexts';
import { CleaningRequestDetailsInput, PropertySizeRange } from '../../../../../../packages/types';
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
          subheading: string;
        };
        propertyDetails: {
          heading: string;
          subheading: string;
        };
        scheduling: {
          heading: string;
          subheading: string;
        };
        serviceAddress: {
          heading: string;
          subheading: string;
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
  };
}

export default function CleaningService() {
  const lang = useLang();
  const { auth } = useAuth();
  const { texts } = useI18n();
  const cleaning: CleaningServicePageTexts = texts?.pages?.client?.cleaning;
  const [isAlertClosed, setIsAlertClosed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!cleaning) return null;

  const handleMainFormSubmit = async (_detailsStep: CleaningRequestDetailsInput) => {
    setIsSubmitting(true);
    try {
      // Next step: merge this object with address and scheduling sections before POST /api/home-services/cleaning-request.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      {!auth?.isLogged && !isAlertClosed && (
        <AuthRequiredAlert texts={cleaning.authAlert} lang={lang} onClose={() => setIsAlertClosed(true)} />
      )}
      <Hero texts={cleaning.hero} />
      <CleaningRequestForm
        texts={cleaning.form}
        loading={isSubmitting}
        canSubmit={Boolean(auth?.isLogged)}
        onRequireAuth={() => setIsAlertClosed(false)}
        onSubmit={handleMainFormSubmit}
      />
    </main>
  );
}
