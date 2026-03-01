'use client';

import { useMemo, useState } from 'react';
import styles from './CleaningRequestForm.module.css';
import CustomerFrequencyStep from './CustomerFrequencyStep/CustomerFrequencyStep';
import PropertyDetailsStep from './PropertyDetailsStep/PropertyDetailsStep';
import ProcessStepsHeader from './ProcessStepsHeader/ProcessStepsHeader';
import {
  CleaningCustomerType,
  CleaningFrequency,
  CleaningRequestDetailsInput,
  PropertySizeRange,
} from '../../../../../types/services';

type FieldErrors = Partial<
  Record<'customerType' | 'frequency' | 'sizeRange' | 'roomsCount' | 'details', string>
>;

type FormState = {
  customerType: CleaningCustomerType | '';
  frequency: CleaningFrequency | '';
  sizeRange: PropertySizeRange | '';
  roomsCount: string;
  hasBalcony: boolean;
  hasIndoorStairs: boolean;
  hasPets: boolean;
  details: string;
};

export interface CleaningRequestFormTexts {
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
    options: Record<CleaningCustomerType, string>;
  };
  frequency: {
    label: string;
    options: Record<CleaningFrequency, string>;
    discounts: Record<CleaningFrequency, string>;
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
    submit: string;
    next: string;
    back: string;
  };
  errors: {
    required: string;
    invalid: string;
    roomsRange: string;
    detailsTooLong: string;
    unsafeInput: string;
  };
}

const INJECTION_PATTERN =
  /(<\s*script|<\/\s*script|javascript:|onerror\s*=|onload\s*=|union\s+select|drop\s+table|insert\s+into|delete\s+from|--|\/\*|\*\/)/i;

const FREQUENCY_ORDER: CleaningFrequency[] = ['once', 'two_per_month', 'three_per_month', 'weekly'];

const sanitizeText = (value: string) =>
  value.normalize('NFKC').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();

export default function CleaningRequestForm({
  texts,
  loading = false,
  canSubmit = true,
  onRequireAuth,
  onSubmit,
}: {
  texts: CleaningRequestFormTexts;
  loading?: boolean;
  canSubmit?: boolean;
  onRequireAuth?: () => void;
  onSubmit: (data: CleaningRequestDetailsInput) => Promise<void> | void;
}) {
  const [values, setValues] = useState<FormState>({
    customerType: 'private',
    frequency: '',
    sizeRange: '',
    roomsCount: '',
    hasBalcony: false,
    hasIndoorStairs: false,
    hasPets: false,
    details: '',
  });
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    customerType: false,
    frequency: false,
    sizeRange: false,
    roomsCount: false,
    hasBalcony: false,
    hasIndoorStairs: false,
    hasPets: false,
    details: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const errors = useMemo<FieldErrors>(() => {
    const next: FieldErrors = {};
    const detailsRaw = values.details || '';
    const details = sanitizeText(detailsRaw);
    const roomsNumber = Number(values.roomsCount);

    if (!values.customerType) next.customerType = texts.errors.required;
    if (!values.frequency) next.frequency = texts.errors.required;
    if (!values.sizeRange) next.sizeRange = texts.errors.required;

    if (values.roomsCount.trim() === '') {
      next.roomsCount = texts.errors.required;
    } else if (!Number.isInteger(roomsNumber)) {
      next.roomsCount = texts.errors.invalid;
    } else if (roomsNumber < 0 || roomsNumber > 50) {
      next.roomsCount = texts.errors.roomsRange;
    }

    if (detailsRaw.trim()) {
      if (INJECTION_PATTERN.test(detailsRaw)) {
        next.details = texts.errors.unsafeInput;
      } else if (details.length > 1500) {
        next.details = texts.errors.detailsTooLong;
      }
    }

    return next;
  }, [texts.errors, values]);

  const hasErrors = Object.keys(errors).length > 0;
  const showError = (field: keyof FieldErrors) => Boolean((submitted || touched[field]) && errors[field]);

  const isStepOneValid = Boolean(values.customerType && values.frequency && !errors.customerType && !errors.frequency);

  const goToStepTwo = () => {
    setTouched((prev) => ({ ...prev, customerType: true, frequency: true }));
    if (isStepOneValid) setStep(2);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step === 1) {
      goToStepTwo();
      return;
    }

    if (!canSubmit) {
      onRequireAuth?.();
      return;
    }

    setSubmitted(true);

    if (hasErrors) return;
    if (!values.customerType || !values.frequency || !values.sizeRange) return;

    const roomsCount = Number(values.roomsCount);
    if (!Number.isInteger(roomsCount)) return;

    const payload: CleaningRequestDetailsInput = {
      customerType: values.customerType,
      frequency: values.frequency,
      property: {
        sizeRange: values.sizeRange,
        roomsCount,
        hasBalcony: values.hasBalcony,
        hasIndoorStairs: values.hasIndoorStairs,
        hasPets: values.hasPets,
        details: sanitizeText(values.details) || undefined,
      },
    };

    await onSubmit(payload);
  };

  return (
    <section className={styles.section} aria-labelledby="cleaning-process-title">
      <ProcessStepsHeader currentStep={step} texts={texts.process} />

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {step === 1 ? (
          <CustomerFrequencyStep
            customerType={texts.customerType}
            frequency={texts.frequency}
            values={{ customerType: values.customerType, frequency: values.frequency }}
            errors={{ customerType: showError('customerType') ? errors.customerType : '', frequency: showError('frequency') ? errors.frequency : '' }}
            frequencyOrder={FREQUENCY_ORDER}
            onCustomerTypeChange={(customerType) => {
              setValues((prev) => ({ ...prev, customerType }));
              setTouched((prev) => ({ ...prev, customerType: true }));
            }}
            onFrequencyChange={(frequency) => {
              setValues((prev) => ({ ...prev, frequency }));
              setTouched((prev) => ({ ...prev, frequency: true }));
            }}
          />
        ) : (
          <PropertyDetailsStep
            property={texts.property}
            common={texts.common}
            requiredText={texts.errors.required}
            values={{
              sizeRange: values.sizeRange,
              roomsCount: values.roomsCount,
              hasBalcony: values.hasBalcony,
              hasIndoorStairs: values.hasIndoorStairs,
              hasPets: values.hasPets,
              details: values.details,
            }}
            errors={{
              sizeRange: showError('sizeRange') ? errors.sizeRange : '',
              roomsCount: showError('roomsCount') ? errors.roomsCount : '',
              details: showError('details') ? errors.details : '',
            }}
            onSizeRangeChange={(sizeRange) => setValues((prev) => ({ ...prev, sizeRange }))}
            onSizeRangeBlur={() => setTouched((prev) => ({ ...prev, sizeRange: true }))}
            onRoomsDecrement={() => {
              const current = Number(values.roomsCount || '0');
              const next = Math.max(0, Math.min(50, Number.isNaN(current) ? 0 : current - 1));
              setValues((prev) => ({ ...prev, roomsCount: String(next) }));
              setTouched((prev) => ({ ...prev, roomsCount: true }));
            }}
            onRoomsIncrement={() => {
              const current = Number(values.roomsCount || '0');
              const next = Math.max(0, Math.min(50, Number.isNaN(current) ? 0 : current + 1));
              setValues((prev) => ({ ...prev, roomsCount: String(next) }));
              setTouched((prev) => ({ ...prev, roomsCount: true }));
            }}
            onBalconyToggle={() => setValues((prev) => ({ ...prev, hasBalcony: !prev.hasBalcony }))}
            onIndoorStairsToggle={() =>
              setValues((prev) => ({ ...prev, hasIndoorStairs: !prev.hasIndoorStairs }))
            }
            onPetsToggle={() => setValues((prev) => ({ ...prev, hasPets: !prev.hasPets }))}
            onDetailsChange={(details) => setValues((prev) => ({ ...prev, details }))}
            onDetailsBlur={() => setTouched((prev) => ({ ...prev, details: true }))}
          />
        )}

        <div className={styles.actions}>
          {step === 2 && (
            <button
              type="button"
              className={`button button_ghost ${styles.backButton}`}
              onClick={() => setStep(1)}
            >
              {texts.common.back}
            </button>
          )}

          <button
            className={`button ${!canSubmit && step === 2 ? styles.submitDisabled : ''}`}
            type={step === 2 && !canSubmit ? 'button' : 'submit'}
            aria-disabled={step === 2 && !canSubmit}
            disabled={loading}
            onClick={() => {
              if (step === 2 && !canSubmit) onRequireAuth?.();
            }}
          >
            {step === 1 ? texts.common.next : texts.common.submit}
          </button>
        </div>
      </form>
    </section>
  );
}
