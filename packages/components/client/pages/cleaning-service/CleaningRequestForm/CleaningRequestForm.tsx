'use client';

import { useId, useMemo, useState } from 'react';
import styles from './CleaningRequestForm.module.css';
import CustomerFrequencyStep from './CustomerFrequencyStep/CustomerFrequencyStep';
import PropertyDetailsStep from './PropertyDetailsStep/PropertyDetailsStep';
import ProcessStepsHeader from './ProcessStepsHeader/ProcessStepsHeader';
import AvailabilityCalendar from './AvailabilityCalendar/AvailabilityCalendar';
import WorkAddressSelector from './WorkAddressSelector/WorkAddressSelector';
import ReviewStep from './ReviewStep/ReviewStep';
import { useClientCalendarSettings } from '../../../../../hooks';
import {
  CleaningCustomerType,
  CleaningFrequency,
  CleaningRequestDetailsInput,
  CleaningRequestSubmission,
  PropertySizeRange,
  WorkAddressSelection,
} from '../../../../../types/services';
import type { SelectedCalendarSlot } from '../../../../../types/calendar';

type FieldErrors = Partial<
  Record<
    | 'customerType'
    | 'frequency'
    | 'sizeRange'
    | 'roomsCount'
    | 'details'
    | 'preferredVisitSlot'
    | 'workAddress',
    string
  >
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
  preferredVisitSlot: SelectedCalendarSlot | null;
  workAddress: WorkAddressSelection | null;
};

export interface CleaningRequestFormSubmission extends CleaningRequestSubmission {}

export interface CleaningRequestFormTexts {
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
      review?: {
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
    options: Record<CleaningFrequency, string>;
    discounts: Record<CleaningFrequency, string>;
    recommendedLabel: string;
  };
  property: {
    title: string;
    sizeRangeLabel: string;
    sizeRangeOptions: Record<PropertySizeRange, string>;
    roomsCountLabel: string;
    roomsCountDecrementAriaLabel?: string;
    roomsCountIncrementAriaLabel?: string;
    hasBalconyLabel: string;
    hasIndoorStairsLabel: string;
    hasPetsLabel: string;
    detailsLabel: string;
    detailsPlaceholder: string;
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
    monthNavigationAriaLabel?: string;
    weekdayLabels?: string[];
    nonWorkday?: string;
    blockedDay?: string;
    availableDay?: string;
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
    manualSectionTitle?: string;
    addressDetailsAriaLabel?: string;
    sourceLabels?: {
      primary?: string;
      saved?: string;
    };
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
  common: {
    yes: string;
    no: string;
    submit: string;
    next: string;
    review: string;
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
  onSubmit: (data: CleaningRequestFormSubmission) => Promise<void> | void;
}) {
  const sectionTitleId = useId();
  const stepTitleId = useId();
  const validationMessageId = useId();
  const clientCalendarSettings = useClientCalendarSettings();
  const [values, setValues] = useState<FormState>({
    customerType: 'private',
    frequency: '',
    sizeRange: '',
    roomsCount: '1',
    hasBalcony: false,
    hasIndoorStairs: false,
    hasPets: false,
    details: '',
    preferredVisitSlot: null,
    workAddress: null,
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
    preferredVisitSlot: false,
    workAddress: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const processTexts = useMemo(
    () => ({
      ...texts.process,
      steps: {
        ...texts.process.steps,
        review: texts.process.steps.review ?? {
          heading: texts.review.title,
          ariaLabel: texts.review.title,
        },
      },
    }),
    [texts.process, texts.review.title]
  );

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
    } else if (roomsNumber < 1 || roomsNumber > 50) {
      next.roomsCount = texts.errors.roomsRange;
    }

    if (detailsRaw.trim()) {
      if (INJECTION_PATTERN.test(detailsRaw)) {
        next.details = texts.errors.unsafeInput;
      } else if (details.length > 1500) {
        next.details = texts.errors.detailsTooLong;
      }
    }

    if (!values.preferredVisitSlot) {
      next.preferredVisitSlot =
        texts.scheduling?.required ?? 'Please select a preferred date and time.';
    }

    if (!values.workAddress) {
      next.workAddress = texts.serviceAddress?.required ?? 'Please select or enter a work address.';
    }

    return next;
  }, [texts.errors, texts.scheduling, texts.serviceAddress, values]);

  const hasErrors = Object.keys(errors).length > 0;
  const showError = (field: keyof FieldErrors) =>
    Boolean((submitted || touched[field]) && errors[field]);
  const stepOneError = (() => {
    if (showError('customerType') && errors.customerType) {
      return `${texts.customerType.label}: ${errors.customerType}`;
    }

    if (showError('frequency') && errors.frequency) {
      return `${texts.frequency.label}: ${errors.frequency}`;
    }

    return '';
  })();
  const stepTwoError = (() => {
    if (showError('sizeRange') && errors.sizeRange) {
      return `${texts.property.sizeRangeLabel}: ${errors.sizeRange}`;
    }

    if (showError('roomsCount') && errors.roomsCount) {
      return `${texts.property.roomsCountLabel}: ${errors.roomsCount}`;
    }

    if (showError('details') && errors.details) {
      return `${texts.property.detailsLabel}: ${errors.details}`;
    }

    return '';
  })();
  const stepThreeError =
    showError('preferredVisitSlot') && errors.preferredVisitSlot
      ? `${texts.scheduling?.title ?? texts.process.steps.scheduling.heading}: ${errors.preferredVisitSlot}`
      : '';
  const stepFourError =
    showError('workAddress') && errors.workAddress
      ? `${texts.serviceAddress?.title ?? texts.process.steps.serviceAddress.heading}: ${errors.workAddress}`
      : '';
  const footerValidationMessage =
    (step === 1 && stepOneError) ||
    (step === 2 && stepTwoError) ||
    (step === 3 && stepThreeError) ||
    (step === 4 && stepFourError) ||
    '';
  const currentStepHeading =
    step === 1
      ? processTexts.steps.customerFrequency.heading
      : step === 2
        ? processTexts.steps.propertyDetails.heading
        : step === 3
          ? processTexts.steps.scheduling.heading
          : step === 4
            ? processTexts.steps.serviceAddress.heading
            : (processTexts.steps.review?.heading ?? texts.review.title);

  const isStepOneValid = Boolean(
    values.customerType && values.frequency && !errors.customerType && !errors.frequency
  );
  const isStepTwoValid = Boolean(
    values.sizeRange && !errors.sizeRange && !errors.roomsCount && !errors.details
  );
  const isStepThreeValid = Boolean(values.preferredVisitSlot && !errors.preferredVisitSlot);

  const goToStepTwo = () => {
    setTouched((prev) => ({ ...prev, customerType: true, frequency: true }));
    if (isStepOneValid) {
      setStep(2);
    }
  };

  const goToStepThree = () => {
    setTouched((prev) => ({
      ...prev,
      sizeRange: true,
      roomsCount: true,
      details: true,
    }));

    if (isStepTwoValid) {
      setStep(3);
    }
  };

  const goToStepFour = () => {
    setTouched((prev) => ({ ...prev, preferredVisitSlot: true }));

    if (isStepThreeValid) {
      setStep(4);
    }
  };

  const goToStepFive = () => {
    setTouched((prev) => ({ ...prev, workAddress: true }));

    if (!errors.workAddress && values.workAddress) {
      setStep(5);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      onRequireAuth?.();
      return;
    }

    if (step === 1) {
      goToStepTwo();
      return;
    }

    if (step === 2) {
      goToStepThree();
      return;
    }

    if (step === 3) {
      goToStepFour();
      return;
    }

    if (step === 4) {
      goToStepFive();
      return;
    }

    setSubmitted(true);
    setTouched((prev) => ({ ...prev, preferredVisitSlot: true, workAddress: true }));

    if (hasErrors) return;
    if (
      !values.customerType ||
      !values.frequency ||
      !values.sizeRange ||
      !values.preferredVisitSlot ||
      !values.workAddress
    ) {
      return;
    }

    const roomsCount = Number(values.roomsCount);
    if (!Number.isInteger(roomsCount)) return;

    const payload: CleaningRequestDetailsInput = {
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

    await onSubmit({
      customerType: values.customerType,
      details: payload,
      preferredVisitSlot: values.preferredVisitSlot,
      workAddress: values.workAddress,
    });
  };

  return (
    <section className={styles.section} aria-labelledby={sectionTitleId}>
      <ProcessStepsHeader currentStep={step} texts={processTexts} titleId={sectionTitleId} />

      <form
        className={`${styles.form} card card--primary`}
        onSubmit={handleSubmit}
        noValidate
        aria-labelledby={stepTitleId}
        aria-describedby={footerValidationMessage ? validationMessageId : undefined}
      >
        <header className={styles.stepHeader}>
          <h3 className={`${styles.stepTitle} type-title-sm`} id={stepTitleId}>
            {currentStepHeading}
          </h3>
          <span
            className={`${styles.stepNumber} card card--neutral type-body-sm`}
          >{`${step}/5`}</span>
        </header>
        <div className={styles.wrapper}>
          <article className={styles.stepContent}>
            {step === 1 ? (
              <CustomerFrequencyStep
                customerType={texts.customerType}
                frequency={texts.frequency}
                values={{ customerType: values.customerType, frequency: values.frequency }}
                errors={{
                  customerType: showError('customerType') ? errors.customerType : '',
                  frequency: showError('frequency') ? errors.frequency : '',
                }}
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
            ) : step === 2 ? (
              <PropertyDetailsStep
                showTitle={false}
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
                  const current = Number(values.roomsCount || '1');
                  const next = Math.max(1, Math.min(50, Number.isNaN(current) ? 1 : current - 1));
                  setValues((prev) => ({ ...prev, roomsCount: String(next) }));
                  setTouched((prev) => ({ ...prev, roomsCount: true }));
                }}
                onRoomsIncrement={() => {
                  const current = Number(values.roomsCount || '1');
                  const next = Math.max(1, Math.min(50, Number.isNaN(current) ? 1 : current + 1));
                  setValues((prev) => ({ ...prev, roomsCount: String(next) }));
                  setTouched((prev) => ({ ...prev, roomsCount: true }));
                }}
                onBalconyToggle={() =>
                  setValues((prev) => ({ ...prev, hasBalcony: !prev.hasBalcony }))
                }
                onIndoorStairsToggle={() =>
                  setValues((prev) => ({ ...prev, hasIndoorStairs: !prev.hasIndoorStairs }))
                }
                onPetsToggle={() => setValues((prev) => ({ ...prev, hasPets: !prev.hasPets }))}
                onDetailsChange={(details) => setValues((prev) => ({ ...prev, details }))}
                onDetailsBlur={() => setTouched((prev) => ({ ...prev, details: true }))}
              />
            ) : step === 3 && clientCalendarSettings ? (
              <section
                className={styles.stepPane}
                aria-label={
                  texts.process.steps.scheduling.ariaLabel ?? texts.process.steps.scheduling.heading
                }
              >
                <AvailabilityCalendar
                  showHeader={false}
                  clientId={clientCalendarSettings.clientId}
                  schedule={clientCalendarSettings.schedule}
                  slotDurationMinutes={clientCalendarSettings.slotDurationMinutes}
                  value={values.preferredVisitSlot}
                  onChange={(preferredVisitSlot) => {
                    setValues((prev) => ({ ...prev, preferredVisitSlot }));
                    setTouched((prev) => ({ ...prev, preferredVisitSlot: true }));
                  }}
                  texts={{
                    title: texts.scheduling?.title,
                    description: texts.scheduling?.description,
                    slotsTitle: texts.scheduling?.slotsTitle,
                    noDateSelected: texts.scheduling?.noDateSelected,
                    noAvailability: texts.scheduling?.noAvailability,
                    blockedBadge: texts.scheduling?.blockedBadge,
                    selectedBadge: texts.scheduling?.selectedBadge,
                    availableBadge: texts.scheduling?.availableBadge,
                    closeSlotsLabel: texts.scheduling?.closeSlotsLabel,
                    loading: texts.scheduling?.loading,
                    errorPrefix: texts.scheduling?.errorPrefix,
                    previousMonth: texts.scheduling?.previousMonth,
                    nextMonth: texts.scheduling?.nextMonth,
                    monthNavigationAriaLabel: texts.scheduling?.monthNavigationAriaLabel,
                    weekdayLabels: texts.scheduling?.weekdayLabels,
                    nonWorkday: texts.scheduling?.nonWorkday,
                    blockedDay: texts.scheduling?.blockedDay,
                    availableDay: texts.scheduling?.availableDay,
                  }}
                />
              </section>
            ) : step === 4 ? (
              <section
                className={styles.stepPane}
                aria-label={
                  texts.serviceAddress?.stepAriaLabel ?? texts.process.steps.serviceAddress.heading
                }
              >
                <WorkAddressSelector
                  showHeader={false}
                  texts={texts.serviceAddress}
                  value={values.workAddress}
                  onChange={(workAddress) => {
                    setValues((prev) => ({ ...prev, workAddress }));
                    setTouched((prev) => ({ ...prev, workAddress: true }));
                  }}
                />
              </section>
            ) : step === 5 &&
              values.customerType &&
              values.frequency &&
              values.sizeRange &&
              values.preferredVisitSlot &&
              values.workAddress ? (
              <ReviewStep
                showHeader={false}
                texts={texts.review}
                customerType={{
                  selected: values.customerType,
                  options: texts.customerType.options,
                }}
                frequency={{
                  selected: values.frequency,
                  options: texts.frequency.options,
                }}
                property={{
                  sizeRange: values.sizeRange,
                  sizeRangeOptions: texts.property.sizeRangeOptions,
                  roomsCount: Number(values.roomsCount),
                  hasBalcony: values.hasBalcony,
                  hasIndoorStairs: values.hasIndoorStairs,
                  hasPets: values.hasPets,
                  details: sanitizeText(values.details) || undefined,
                }}
                scheduling={values.preferredVisitSlot}
                workAddress={values.workAddress}
                common={texts.common}
              />
            ) : (
              <section className={styles.missingConfig} aria-live="polite">
                <p className={styles.errorText}>
                  {texts.scheduling?.missingClientConfig ??
                    'Client calendar configuration is unavailable right now.'}
                </p>
              </section>
            )}
          </article>

          <aside
            className={styles.stepValidationSlot}
            aria-live="polite"
            role={footerValidationMessage ? 'alert' : undefined}
          >
            {footerValidationMessage ? (
              <p className={styles.stepValidationMessage} id={validationMessageId}>
                {footerValidationMessage}
              </p>
            ) : null}
          </aside>
        </div>
        <footer className={styles.actions}>
          {step > 1 ? (
            <button
              type="button"
              className={`button button--outline ${styles.backButton}`}
              onClick={() =>
                setStep((prev) => (prev === 5 ? 4 : prev === 4 ? 3 : prev === 3 ? 2 : 1))
              }
            >
              {texts.common.back}
            </button>
          ) : (
            <span className={styles.actionsSpacer} aria-hidden="true" />
          )}

          <button
            className={`button button--primary ${!canSubmit ? styles.submitDisabled : ''}`}
            type={step === 5 && !canSubmit ? 'button' : 'submit'}
            aria-disabled={step === 5 && !canSubmit}
            disabled={loading}
            onClick={() => {
              if (step === 5 && !canSubmit) onRequireAuth?.();
            }}
          >
            {step === 5
              ? texts.common.submit
              : step === 4
                ? texts.common.review
                : texts.common.next}
          </button>
        </footer>
      </form>
    </section>
  );
}
