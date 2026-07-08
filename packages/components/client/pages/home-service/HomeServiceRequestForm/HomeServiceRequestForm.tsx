'use client';

import { useId, useMemo, useState } from 'react';
import { useClientCalendarSettings } from '../../../../../hooks';
import {
  AvailabilityCalendar,
  ChoiceButtonField,
  CustomerTypeSelector,
  ProcessStepsHeader,
  ServiceRequestShell,
  WorkAddressSelector,
  serviceRequestShellStyles as shellStyles,
} from '../../shared';
import serviceTypeSelectorStyles from './ServiceTypeSelector/ServiceTypeSelector.module.css';
import type {
  HomeServiceRequestFieldErrors,
  HomeServiceRequestFormState,
  HomeServiceRequestFormSubmission,
  HomeServiceRequestFormTexts,
  HomeServiceRequestTouchedFields,
  HOME_SERVICE_TYPE_ORDER,
} from './homeServiceRequest.types';
import {
  buildHomeServiceDetails,
  mapHomeServiceKindToCanonicalType,
} from './homeServiceRequest.types';
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
  const [values, setValues] = useState<HomeServiceRequestFormState>({
    customerType: 'private',
    serviceType: '',
    serviceDetails: '',
    paintingDetails: {
      paintScope: '',
      roomsCount: 1,
      sizeRange: '',
      description: '',
    },
    preferredVisitSlot: null,
    workAddress: null,
  });
  const [touched, setTouched] = useState<HomeServiceRequestTouchedFields>({
    customerType: false,
    serviceType: false,
    serviceDetails: false,
    paintingPaintScope: false,
    paintingSizeRange: false,
    preferredVisitSlot: false,
    workAddress: false,
  });
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
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
      },
    }),
    [texts.process]
  );

  const errors = useMemo<HomeServiceRequestFieldErrors>(() => {
    const next: HomeServiceRequestFieldErrors = {};

    if (!values.customerType) next.customerType = texts.errors.required;
    if (!values.serviceType) next.serviceType = texts.errors.required;

    if (values.serviceType === 'painting') {
      if (!values.paintingDetails.paintScope) {
        next.paintingPaintScope = texts.errors.required;
      }

      if (!values.paintingDetails.sizeRange) {
        next.paintingSizeRange = texts.errors.required;
      }

      if (!values.paintingDetails.description.trim()) {
        next.serviceDetails = texts.errors.required;
      } else if (values.paintingDetails.description.trim().length > 1500) {
        next.serviceDetails = texts.errors.detailsTooLong;
      }
    } else if (!values.serviceDetails.trim()) {
      next.serviceDetails = texts.errors.required;
    } else if (values.serviceDetails.trim().length > 1500) {
      next.serviceDetails = texts.errors.detailsTooLong;
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

  const showError = (field: keyof HomeServiceRequestFieldErrors) =>
    Boolean((submitted || touched[field]) && errors[field]);
  const stepOneError = (() => {
    if (showError('customerType') && errors.customerType) {
      return `${texts.customerType.label}: ${errors.customerType}`;
    }

    if (showError('serviceType') && errors.serviceType) {
      return `${texts.serviceType.label}: ${errors.serviceType}`;
    }

    return '';
  })();
  const stepTwoError = (() => {
    if (showError('paintingPaintScope') && errors.paintingPaintScope) {
      return `${texts.serviceDetails.painting.paintScopeLabel}: ${errors.paintingPaintScope}`;
    }

    if (showError('paintingSizeRange') && errors.paintingSizeRange) {
      return `${texts.serviceDetails.painting.sizeRangeLabel}: ${errors.paintingSizeRange}`;
    }

    if (showError('serviceDetails') && errors.serviceDetails) {
      const detailsLabel =
        values.serviceType === 'painting'
          ? texts.serviceDetails.painting.descriptionLabel
          : texts.serviceDetails.detailsLabel;
      return `${detailsLabel}: ${errors.serviceDetails}`;
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
      ? texts.process.steps.customerService.heading
      : step === 2
        ? values.serviceType === 'painting'
          ? texts.serviceDetails.painting.title
          : texts.serviceDetails.title
        : step === 3
          ? (texts.scheduling?.title ?? texts.process.steps.scheduling.heading)
          : (texts.serviceAddress?.title ?? texts.process.steps.serviceAddress.heading);
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      onRequireAuth?.();
      return;
    }

    if (step === 1) {
      setTouched((prev) => ({ ...prev, customerType: true, serviceType: true }));
      if (isStepOneValid) setStep(2);
      return;
    }

    if (step === 2) {
      setTouched((prev) => ({
        ...prev,
        serviceDetails: true,
        paintingPaintScope: values.serviceType === 'painting' ? true : prev.paintingPaintScope,
        paintingSizeRange: values.serviceType === 'painting' ? true : prev.paintingSizeRange,
      }));
      if (isStepTwoValid) setStep(3);
      return;
    }

    if (step === 3) {
      setTouched((prev) => ({ ...prev, preferredVisitSlot: true }));
      if (isStepThreeValid) setStep(4);
      return;
    }

    setSubmitted(true);
    setTouched((prev) => ({ ...prev, workAddress: true }));
    if (errors.workAddress || !values.workAddress) return;

    if (!values.customerType || !values.serviceType || !values.preferredVisitSlot) return;

    const success = await onSubmit({
      serviceType: mapHomeServiceKindToCanonicalType(values.serviceType),
      customerType: values.customerType,
      preferredVisitSlot: {
        start: values.preferredVisitSlot.start.toISOString(),
        end: values.preferredVisitSlot.end.toISOString(),
      },
      workAddress: values.workAddress,
      details: buildHomeServiceDetails(values.serviceType, {
        serviceDetails: values.serviceDetails,
        paintingDetails: values.paintingDetails,
      }),
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
      totalSteps={4}
      validationMessage={footerValidationMessage}
      onSubmit={handleSubmit}
      backAction={
        step > 1
          ? {
              label: texts.common.back,
              onClick: () => setStep((prev) => (prev === 4 ? 3 : prev === 3 ? 2 : 1)),
            }
          : undefined
      }
      primaryAction={{
        label: step === 4 ? texts.common.submit : texts.common.next,
        type: step === 4 && !canSubmit ? 'button' : 'submit',
        ariaDisabled: step === 4 && !canSubmit,
        disabled: loading,
        className: !canSubmit ? shellStyles.submitDisabled : undefined,
        onClick: () => {
          if (step === 4 && !canSubmit) onRequireAuth?.();
        },
      }}
    >
      {step === 1 ? (
        <section
          className={shellStyles.stepStack}
          aria-label={
            texts.process.steps.customerService.ariaLabel ??
            texts.process.steps.customerService.heading
          }
        >
          <CustomerTypeSelector
            label={texts.customerType.label}
            options={texts.customerType.options}
            value={values.customerType}
            error={showError('customerType') ? errors.customerType : ''}
            onChange={(customerType) => {
              setValues((prev) => ({ ...prev, customerType }));
              setTouched((prev) => ({ ...prev, customerType: true }));
            }}
          />
          <ChoiceButtonField
            legend={texts.serviceType.label}
            options={HOME_SERVICE_TYPE_ORDER.map((type) => ({
              value: type,
              label: texts.serviceType.options[type].title,
            }))}
            value={values.serviceType}
            error={showError('serviceType') ? errors.serviceType : ''}
            listClassName={serviceTypeSelectorStyles.serviceGrid}
            itemClassName={serviceTypeSelectorStyles.serviceItem}
            buttonClassName={serviceTypeSelectorStyles.serviceButton}
            labelClassName={serviceTypeSelectorStyles.serviceTitle}
            onChange={(serviceType) => {
              setValues((prev) => ({
                ...prev,
                serviceType,
                serviceDetails:
                  serviceType === 'painting'
                    ? prev.paintingDetails.description
                    : prev.serviceDetails,
              }));
              setTouched((prev) => ({ ...prev, serviceType: true }));
            }}
          />
        </section>
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
            setValues((prev) => ({
              ...prev,
              serviceDetails: description,
              paintingDetails:
                values.serviceType === 'painting'
                  ? { ...prev.paintingDetails, description }
                  : prev.paintingDetails,
            }))
          }
          onServiceDetailsBlur={() => setTouched((prev) => ({ ...prev, serviceDetails: true }))}
          onPaintingPaintScopeChange={(paintScope) => {
            setValues((prev) => ({
              ...prev,
              paintingDetails: { ...prev.paintingDetails, paintScope },
            }));
          }}
          onPaintingPaintScopeBlur={() =>
            setTouched((prev) => ({
              ...prev,
              paintingPaintScope: true,
            }))
          }
          onPaintingRoomsDecrement={() => {
            setValues((prev) => ({
              ...prev,
              paintingDetails: {
                ...prev.paintingDetails,
                roomsCount: Math.max(1, prev.paintingDetails.roomsCount - 1),
              },
            }));
          }}
          onPaintingRoomsIncrement={() => {
            setValues((prev) => ({
              ...prev,
              paintingDetails: {
                ...prev.paintingDetails,
                roomsCount: prev.paintingDetails.roomsCount + 1,
              },
            }));
          }}
          onPaintingSizeRangeChange={(sizeRange) => {
            setValues((prev) => ({
              ...prev,
              paintingDetails: { ...prev.paintingDetails, sizeRange },
            }));
          }}
          onPaintingSizeRangeBlur={() =>
            setTouched((prev) => ({
              ...prev,
              paintingSizeRange: true,
            }))
          }
        />
      ) : step === 3 && clientCalendarSettings ? (
        <section
          className={shellStyles.stepPane}
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
          className={shellStyles.stepPane}
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
      ) : (
        <section className={shellStyles.missingConfig} aria-live="polite">
          <p className={shellStyles.errorText}>
            {texts.scheduling?.missingClientConfig ??
              'Client calendar configuration is unavailable right now.'}
          </p>
        </section>
      )}
    </ServiceRequestShell>
  );
}
