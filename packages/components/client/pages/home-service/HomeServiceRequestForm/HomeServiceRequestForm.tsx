'use client';

import { useId, useMemo, useState } from 'react';
import { useClientCalendarSettings } from '../../../../../hooks';
import {
  ProcessStepsHeader,
  ServiceRequestAddressStep,
  ServiceRequestSchedulingStep,
  ServiceRequestShell,
  serviceRequestShellStyles as shellStyles,
} from '../../shared';
import CustomerServiceTypeStep from './CustomerServiceTypeStep/CustomerServiceTypeStep';
import ReviewStep from './ReviewStep/ReviewStep';
import type {
  HomeServiceRequestFieldErrors,
  HomeServiceRequestFormState,
  HomeServiceRequestFormSubmission,
  HomeServiceRequestFormTexts,
  HomeServiceRequestStep,
  HomeServiceRequestTouchedFields,
} from './homeServiceRequest.types';
import {
  applyHomeServiceDetailsChange,
  applyHomeServiceTypeSelection,
  applyPaintingRoomsDelta,
  applyPaintingScopeChange,
  applyPaintingSizeRangeChange,
  createInitialHomeServiceRequestState,
  getHomeServiceRequestErrors,
  getHomeServiceFooterValidationMessage,
  getHomeServiceStepHeading,
  markHomeServiceStepOneTouched,
  markHomeServiceStepTwoTouched,
  buildHomeServiceDetails,
  mapHomeServiceKindToCanonicalType,
} from './homeServiceRequest.helpers';
import ServiceDetailsRouter from './ServiceDetailsRouter/ServiceDetailsRouter';

export default function HomeServiceRequestForm({
  texts,
  loading = false,
  canSubmit = true,
  onRequireAuth,
  onSubmit,
}: {
  texts: HomeServiceRequestFormTexts;
  loading?: boolean;
  canSubmit?: boolean;
  onRequireAuth?: () => void;
  onSubmit: (data: HomeServiceRequestFormSubmission) => Promise<boolean> | boolean;
}) {
  const sectionTitleId = useId();
  const stepTitleId = useId();
  const validationMessageId = useId();
  const clientCalendarSettings = useClientCalendarSettings();
  const [values, setValues] = useState<HomeServiceRequestFormState>(createInitialHomeServiceRequestState);
  const [touched, setTouched] = useState<HomeServiceRequestTouchedFields>({
    customerType: false,
    serviceType: false,
    serviceDetails: false,
    paintingPaintScope: false,
    paintingSizeRange: false,
    preferredVisitSlot: false,
    workAddress: false,
  });
  const [step, setStep] = useState<HomeServiceRequestStep>(1);
  const [submitted, setSubmitted] = useState(false);

  const processTexts = useMemo(
    () => ({
      title: texts.process.title,
      description: texts.process.description,
      stepLabel: texts.process.stepLabel,
      steps: {
        customerFrequency: texts.process.steps.customerService,
        propertyDetails: texts.process.steps.details,
        scheduling: texts.process.steps.scheduling,
        serviceAddress: texts.process.steps.serviceAddress,
        review: texts.process.steps.review ?? {
          heading: texts.review.title,
          ariaLabel: texts.review.title,
        },
      },
    }),
    [texts.process, texts.review.title]
  );

  const errors = useMemo<HomeServiceRequestFieldErrors>(
    () =>
      getHomeServiceRequestErrors({
        texts,
        values,
      }),
    [texts, values]
  );

  const showError = (field: keyof HomeServiceRequestFieldErrors) =>
    Boolean((submitted || touched[field]) && errors[field]);
  const footerValidationMessage = getHomeServiceFooterValidationMessage({
    step,
    texts,
    values,
    errors,
    touched,
    submitted,
  });
  const currentStepHeading = getHomeServiceStepHeading({
    step,
    texts,
    values,
  });
  const isStepOneValid = Boolean(
    values.customerType && values.serviceType && !errors.customerType && !errors.serviceType
  );
  const isStepTwoValid = Boolean(
    values.serviceType &&
    !errors.serviceDetails &&
    !errors.paintingPaintScope &&
    !errors.paintingSizeRange
  );
  const isStepThreeValid = Boolean(values.preferredVisitSlot && !errors.preferredVisitSlot);
  const canonicalServiceType = values.serviceType
    ? mapHomeServiceKindToCanonicalType(values.serviceType)
    : null;
  const requestDetails = values.serviceType
    ? buildHomeServiceDetails(values.serviceType, {
        serviceDetails: values.serviceDetails,
        paintingDetails: values.paintingDetails,
      })
    : null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      onRequireAuth?.();
      return;
    }

    if (step === 1) {
      setTouched((prev) => markHomeServiceStepOneTouched(prev));
      if (isStepOneValid) setStep(2);
      return;
    }

    if (step === 2) {
      setTouched((prev) => markHomeServiceStepTwoTouched({ current: prev, serviceType: values.serviceType }));
      if (isStepTwoValid) setStep(3);
      return;
    }

    if (step === 3) {
      setTouched((prev) => ({ ...prev, preferredVisitSlot: true }));
      if (isStepThreeValid) setStep(4);
      return;
    }

    if (step === 4) {
      setTouched((prev) => ({ ...prev, workAddress: true }));
      if (!errors.workAddress && values.workAddress) setStep(5);
      return;
    }

    setSubmitted(true);
    setTouched((prev) => ({ ...prev, preferredVisitSlot: true, workAddress: true }));
    if (errors.workAddress || !values.workAddress || errors.preferredVisitSlot) return;

    if (!values.customerType || !canonicalServiceType || !values.preferredVisitSlot || !requestDetails) {
      return;
    }

    const success = await onSubmit({
      serviceType: canonicalServiceType,
      customerType: values.customerType,
      preferredVisitSlot: {
        start: values.preferredVisitSlot.start.toISOString(),
        end: values.preferredVisitSlot.end.toISOString(),
      },
      workAddress: values.workAddress,
      details: requestDetails,
    });

    if (!success) return;
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
        <CustomerServiceTypeStep
          texts={texts}
          values={{
            customerType: values.customerType,
            serviceType: values.serviceType,
          }}
          errors={{
            customerType: showError('customerType') ? errors.customerType : '',
            serviceType: showError('serviceType') ? errors.serviceType : '',
          }}
          onCustomerTypeChange={(customerType) => {
            setValues((prev) => ({ ...prev, customerType }));
            setTouched((prev) => ({ ...prev, customerType: true }));
          }}
          onServiceTypeChange={(serviceType) => {
            setValues((prev) => applyHomeServiceTypeSelection({ current: prev, serviceType }));
            setTouched((prev) => ({ ...prev, serviceType: true }));
          }}
        />
      ) : step === 2 && values.serviceType ? (
        <ServiceDetailsRouter
          showHeader={false}
          serviceType={values.serviceType}
          texts={texts.serviceDetails}
          requiredText={texts.errors.required}
          serviceDetails={values.serviceDetails}
          serviceDetailsError={showError('serviceDetails') ? errors.serviceDetails : ''}
          paintingDetails={values.paintingDetails}
          paintingErrors={{
            paintScope: showError('paintingPaintScope') ? errors.paintingPaintScope : '',
            sizeRange: showError('paintingSizeRange') ? errors.paintingSizeRange : '',
          }}
          onServiceDetailsChange={(description) =>
            setValues((prev) => applyHomeServiceDetailsChange({ current: prev, description }))
          }
          onServiceDetailsBlur={() => setTouched((prev) => ({ ...prev, serviceDetails: true }))}
          onPaintingPaintScopeChange={(paintScope) => {
            setValues((prev) => applyPaintingScopeChange({ current: prev, paintScope }));
          }}
          onPaintingPaintScopeBlur={() =>
            setTouched((prev) => ({
              ...prev,
              paintingPaintScope: true,
            }))
          }
          onPaintingRoomsDecrement={() => {
            setValues((prev) => applyPaintingRoomsDelta({ current: prev, delta: -1 }));
          }}
          onPaintingRoomsIncrement={() => {
            setValues((prev) => applyPaintingRoomsDelta({ current: prev, delta: 1 }));
          }}
          onPaintingSizeRangeChange={(sizeRange) => {
            setValues((prev) => applyPaintingSizeRangeChange({ current: prev, sizeRange }));
          }}
          onPaintingSizeRangeBlur={() =>
            setTouched((prev) => ({
              ...prev,
              paintingSizeRange: true,
            }))
          }
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
        values.serviceType &&
        values.preferredVisitSlot &&
        values.workAddress &&
        canonicalServiceType &&
        requestDetails ? (
        <ReviewStep
          showHeader={false}
          texts={texts.review}
          customerType={{
            selected: values.customerType,
            options: texts.customerType.options,
          }}
          serviceType={{
            selected: canonicalServiceType,
            label: texts.serviceType.options[values.serviceType].title,
          }}
          serviceDetails={requestDetails.description}
          paintingDetails={{
            ...values.paintingDetails,
            paintScopeLabel: values.paintingDetails.paintScope
              ? texts.serviceDetails.painting.paintScopeOptions[values.paintingDetails.paintScope]
              : texts.review.emptyDetails,
          }}
          sizeRangeOptions={texts.serviceDetails.painting.sizeRangeOptions}
          scheduling={values.preferredVisitSlot}
          workAddress={values.workAddress}
        />
      ) : null}
    </ServiceRequestShell>
  );
}
