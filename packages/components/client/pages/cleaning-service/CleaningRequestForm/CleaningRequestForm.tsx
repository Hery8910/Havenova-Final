'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import CustomerFrequencyStep from './CustomerFrequencyStep/CustomerFrequencyStep';
import PropertyDetailsStep from './PropertyDetailsStep/PropertyDetailsStep';
import ReviewStep from './ReviewStep/ReviewStep';
import {
  ProcessStepsHeader,
  ServiceRequestAddressStep,
  ServiceRequestSchedulingStep,
  ServiceRequestShell,
  serviceRequestShellStyles as shellStyles,
} from '../../shared';
import { useClientCalendarSettings, usePersistentDraft } from '../../../../../hooks';
import {
  CleaningRequestDetails,
} from '../../../../../types/services';
import { CLEANING_FREQUENCY_ORDER } from './cleaningRequest.types';
import type {
  CleaningRequestDraftPayload,
  CleaningRequestDraftStep,
  CleaningRequestFieldErrors,
  CleaningRequestFormState,
  CleaningRequestFormSubmission,
  CleaningRequestFormTexts,
  CleaningRequestStep,
} from './cleaningRequest.types';
import {
  buildCleaningRequestDetails,
  CLEANING_REQUEST_DRAFT_VERSION,
  createInitialCleaningRequestState,
  getCleaningFooterValidationMessage,
  getCleaningRequestErrors,
  getCleaningStepHeading,
  markCleaningStepOneTouched,
  markCleaningStepTwoTouched,
  parseCleaningRequestDraft,
  serializeCleaningRequestDraft,
  sanitizeCleaningRequestText,
} from './cleaningRequest.helpers';
export type { CleaningRequestFormSubmission } from './cleaningRequest.types';

export default function CleaningRequestForm({
  texts,
  loading = false,
  canSubmit = true,
  draftStorageKey,
  draftOwnerKey = 'guest',
  onRequireAuth,
  onSubmit,
}: {
  texts: CleaningRequestFormTexts;
  loading?: boolean;
  canSubmit?: boolean;
  draftStorageKey?: string;
  draftOwnerKey?: string;
  onRequireAuth?: () => void;
  onSubmit: (data: CleaningRequestFormSubmission) => Promise<boolean> | boolean;
}) {
  const sectionTitleId = useId();
  const stepTitleId = useId();
  const validationMessageId = useId();
  const clientCalendarSettings = useClientCalendarSettings();
  const { clearDraft, persistDraft, storedDraft } = usePersistentDraft<CleaningRequestDraftPayload>({
    ownerKey: draftOwnerKey,
    storageKey: draftStorageKey,
    version: CLEANING_REQUEST_DRAFT_VERSION,
  });
  const [values, setValues] = useState<CleaningRequestFormState>(createInitialCleaningRequestState);
  const [touched, setTouched] = useState<Record<keyof CleaningRequestFormState, boolean>>({
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
  const [step, setStep] = useState<CleaningRequestStep>(1);

  useEffect(() => {
    const parsedDraft = parseCleaningRequestDraft(storedDraft);
    if (!parsedDraft) return;

    setValues(parsedDraft.values);
    setStep(parsedDraft.step);
  }, [storedDraft]);

  useEffect(() => {
    if (!draftStorageKey) return;

    persistDraft(serializeCleaningRequestDraft(values, step));
  }, [draftStorageKey, persistDraft, step, values]);
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

  const errors = useMemo<CleaningRequestFieldErrors>(
    () =>
      getCleaningRequestErrors({
        texts,
        values,
      }),
    [texts, values]
  );

  const showError = (field: keyof CleaningRequestFieldErrors) =>
    Boolean((submitted || touched[field]) && errors[field]);
  const footerValidationMessage = getCleaningFooterValidationMessage({
    step,
    texts,
    errors,
    touched,
    submitted,
  });
  const currentStepHeading = getCleaningStepHeading({
    step,
    texts,
  });

  const isStepOneValid = Boolean(
    values.customerType && values.frequency && !errors.customerType && !errors.frequency
  );
  const isStepTwoValid = Boolean(
    values.sizeRange && !errors.sizeRange && !errors.roomsCount && !errors.details
  );
  const isStepThreeValid = Boolean(values.preferredVisitSlot && !errors.preferredVisitSlot);
  const requestDetails = buildCleaningRequestDetails(values);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      onRequireAuth?.();
      return;
    }

    if (step === 1) {
      setTouched((prev) => markCleaningStepOneTouched(prev));
      if (isStepOneValid) {
        setStep(2);
      }
      return;
    }

    if (step === 2) {
      setTouched((prev) => markCleaningStepTwoTouched(prev));
      if (isStepTwoValid) {
        setStep(3);
      }
      return;
    }

    if (step === 3) {
      setTouched((prev) => ({ ...prev, preferredVisitSlot: true }));
      if (isStepThreeValid) {
        setStep(4);
      }
      return;
    }

    if (step === 4) {
      setTouched((prev) => ({ ...prev, workAddress: true }));
      if (!errors.workAddress && values.workAddress) {
        setStep(5);
      }
      return;
    }

    setSubmitted(true);
    setTouched((prev) => ({ ...prev, preferredVisitSlot: true, workAddress: true }));

    if (
      !values.customerType ||
      !values.preferredVisitSlot ||
      !values.workAddress ||
      !requestDetails
    ) {
      return;
    }

    const success = await onSubmit({
      serviceType: 'cleaning',
      customerType: values.customerType,
      details: requestDetails,
      preferredVisitSlot: {
        start: values.preferredVisitSlot.start.toISOString(),
        end: values.preferredVisitSlot.end.toISOString(),
      },
      workAddress: values.workAddress,
    });

    if (success && draftStorageKey) {
      clearDraft();
    }
  };

  return (
    <ServiceRequestShell
      sectionTitleId={sectionTitleId}
      stepTitleId={stepTitleId}
      validationMessageId={validationMessageId}
      processHeader={
        <ProcessStepsHeader currentStep={step} texts={processTexts} titleId={sectionTitleId} />
      }
      currentStepHeading={currentStepHeading}
      currentStepValue={step}
      totalSteps={5}
      validationMessage={footerValidationMessage}
      onSubmit={handleSubmit}
      backAction={
        step > 1
          ? {
              label: texts.common.back,
              onClick: () =>
                setStep((prev) => (prev === 5 ? 4 : prev === 4 ? 3 : prev === 3 ? 2 : 1)),
            }
          : undefined
      }
      primaryAction={{
        label:
          step === 5 ? texts.common.submit : step === 4 ? texts.common.review : texts.common.next,
        type: step === 5 && !canSubmit ? 'button' : 'submit',
        ariaDisabled: step === 5 && !canSubmit,
        disabled: loading,
        className: !canSubmit ? shellStyles.submitDisabled : undefined,
        onClick: () => {
          if (step === 5 && !canSubmit) onRequireAuth?.();
        },
      }}
    >
      {step === 1 ? (
        <CustomerFrequencyStep
          customerType={texts.customerType}
          frequency={texts.frequency}
          values={{ customerType: values.customerType, frequency: values.frequency }}
          errors={{
            customerType: showError('customerType') ? errors.customerType : '',
            frequency: showError('frequency') ? errors.frequency : '',
          }}
          frequencyOrder={CLEANING_FREQUENCY_ORDER}
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
      ) : step === 3 ? (
        <ServiceRequestSchedulingStep
          clientCalendarSettings={clientCalendarSettings}
          fallbackHeading={texts.process.steps.scheduling.heading}
          texts={texts.scheduling}
          value={values.preferredVisitSlot}
          onChange={(preferredVisitSlot) => {
            setValues((prev) => ({ ...prev, preferredVisitSlot }));
            setTouched((prev) => ({ ...prev, preferredVisitSlot: true }));
          }}
        />
      ) : step === 4 ? (
        <section
          className={shellStyles.stepPane}
          aria-label={
            texts.serviceAddress?.stepAriaLabel ?? texts.process.steps.serviceAddress.heading
          }
        >
          <ServiceRequestAddressStep
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
            details: sanitizeCleaningRequestText(values.details) || undefined,
          }}
          scheduling={values.preferredVisitSlot}
          workAddress={values.workAddress}
          common={texts.common}
        />
      ) : null}
    </ServiceRequestShell>
  );
}
