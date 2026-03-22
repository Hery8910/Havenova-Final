'use client';

import { useMemo, useState } from 'react';
import {
  AvailabilityCalendar,
  WorkAddressSelector,
} from '../../cleaning-service';
import ProcessStepsHeader from '../../cleaning-service/CleaningRequestForm/ProcessStepsHeader/ProcessStepsHeader';
import { useClientCalendarSettings } from '../../../../../hooks';
import {
  CleaningCustomerType,
  PropertySizeRange,
  WorkAddressSelection,
} from '../../../../../types/services';
import type { SelectedCalendarSlot } from '../../../../../types/calendar';
import CustomerTypeSelector from '../../shared/CustomerTypeSelector/CustomerTypeSelector';
import type { PaintingPaintScope } from './PaintingDetailsStep/PaintingDetailsStep';
import ServiceDetailsRouter from './ServiceDetailsRouter/ServiceDetailsRouter';
import ServiceTypeSelector from './ServiceTypeSelector/ServiceTypeSelector';
import type { HomeServiceKind } from './homeServiceTypes';
import styles from './HomeServiceRequestForm.module.css';

type FieldErrors = Partial<
  Record<
    | 'customerType'
    | 'serviceType'
    | 'serviceDetails'
    | 'paintingPaintScope'
    | 'paintingSizeRange'
    | 'preferredVisitSlot'
    | 'workAddress',
    string
  >
>;

type TouchedFields = Record<
  | 'customerType'
  | 'serviceType'
  | 'serviceDetails'
  | 'paintingPaintScope'
  | 'paintingSizeRange'
  | 'preferredVisitSlot'
  | 'workAddress',
  boolean
>;

type PaintingDetails = {
  paintScope: PaintingPaintScope | '';
  roomsCount: number;
  sizeRange: PropertySizeRange | '';
  description: string;
};

type FormState = {
  customerType: CleaningCustomerType | '';
  serviceType: HomeServiceKind | '';
  serviceDetails: string;
  paintingDetails: PaintingDetails;
  preferredVisitSlot: SelectedCalendarSlot | null;
  workAddress: WorkAddressSelection | null;
};

export interface HomeServiceRequestFormTexts {
  process: {
    title: string;
    description: string;
    stepLabel: string;
    steps: {
      customerService: { heading: string; ariaLabel?: string };
      details: { heading: string; ariaLabel?: string };
      scheduling: { heading: string; ariaLabel?: string };
      serviceAddress: { heading: string; ariaLabel?: string };
    };
  };
  customerType: {
    label: string;
    helper: string;
    options: Record<CleaningCustomerType, string>;
  };
  serviceType: {
    label: string;
    helper: string;
    options: Record<HomeServiceKind, { title: string; description: string }>;
  };
  serviceDetails: {
    title: string;
    description: string;
    selectedServiceLabel: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    helper: string;
    services: Record<HomeServiceKind, { title: string; description: string; detailsHint: string }>;
    painting: {
      title: string;
      description: string;
      paintScopeLabel: string;
      paintScopeOptions: Record<PaintingPaintScope, string>;
      roomsCountLabel: string;
      roomsCountDecrementAriaLabel?: string;
      roomsCountIncrementAriaLabel?: string;
      sizeRangeLabel: string;
      sizeRangeOptions: Record<PropertySizeRange, string>;
      descriptionLabel: string;
      descriptionPlaceholder: string;
      descriptionHelper: string;
      photosLabel: string;
      photosDescription: string;
    };
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
  common: {
    next: string;
    back: string;
    submit: string;
  };
  errors: {
    required: string;
    detailsTooLong: string;
  };
}

const SERVICE_TYPE_ORDER: HomeServiceKind[] = [
  'painting',
  'repairs-installations',
  'furniture-assembly',
  'kitchen-assembly',
  'moving-help',
];

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
  onSubmit: (data: FormState) => Promise<void> | void;
}) {
  const clientCalendarSettings = useClientCalendarSettings();
  const [values, setValues] = useState<FormState>({
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
  const [touched, setTouched] = useState<TouchedFields>({
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

  const errors = useMemo<FieldErrors>(() => {
    const next: FieldErrors = {};

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
      next.preferredVisitSlot = texts.scheduling?.required ?? 'Please select a preferred date and time.';
    }

    if (!values.workAddress) {
      next.workAddress = texts.serviceAddress?.required ?? 'Please select or enter a work address.';
    }

    return next;
  }, [texts.errors, texts.scheduling, texts.serviceAddress, values]);

  const showError = (field: keyof FieldErrors) => Boolean((submitted || touched[field]) && errors[field]);
  const isStepOneValid = Boolean(values.customerType && values.serviceType && !errors.customerType && !errors.serviceType);
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

    await onSubmit(values);
  };

  return (
    <section className={styles.section} aria-labelledby="home-service-process-title">
      <ProcessStepsHeader currentStep={step} texts={processTexts} />

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {step === 1 ? (
          <section className={styles.step} aria-label={texts.process.steps.customerService.ariaLabel ?? texts.process.steps.customerService.heading}>
            <CustomerTypeSelector
              label={texts.customerType.label}
              helper={texts.customerType.helper}
              options={texts.customerType.options}
              value={values.customerType}
              error={showError('customerType') ? errors.customerType : ''}
              onChange={(customerType) => {
                setValues((prev) => ({ ...prev, customerType }));
                setTouched((prev) => ({ ...prev, customerType: true }));
              }}
            />
            <ServiceTypeSelector
              texts={texts.serviceType}
              value={values.serviceType}
              error={showError('serviceType') ? errors.serviceType : ''}
              serviceTypeOrder={SERVICE_TYPE_ORDER}
              onChange={(serviceType) => {
                setValues((prev) => ({
                  ...prev,
                  serviceType,
                  serviceDetails: serviceType === 'painting' ? prev.paintingDetails.description : prev.serviceDetails,
                }));
                setTouched((prev) => ({ ...prev, serviceType: true }));
              }}
            />
          </section>
        ) : step === 2 && values.serviceType ? (
          <ServiceDetailsRouter
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
            className={styles.step}
            aria-label={texts.process.steps.scheduling.ariaLabel ?? texts.process.steps.scheduling.heading}
          >
            <AvailabilityCalendar
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
            {showError('preferredVisitSlot') && <p className={styles.errorText}>{errors.preferredVisitSlot}</p>}
          </section>
        ) : step === 4 ? (
          <section
            className={styles.step}
            aria-label={texts.serviceAddress?.stepAriaLabel ?? texts.process.steps.serviceAddress.heading}
          >
            <WorkAddressSelector
              texts={texts.serviceAddress}
              value={values.workAddress}
              onChange={(workAddress) => {
                setValues((prev) => ({ ...prev, workAddress }));
                setTouched((prev) => ({ ...prev, workAddress: true }));
              }}
            />
            {showError('workAddress') && <p className={styles.errorText}>{errors.workAddress}</p>}
          </section>
        ) : (
          <section className={styles.missingConfig} aria-live="polite">
            <p className={styles.errorText}>
              {texts.scheduling?.missingClientConfig ?? 'Client calendar configuration is unavailable right now.'}
            </p>
          </section>
        )}

        <footer className={styles.actions}>
          {step > 1 && (
            <button
              type="button"
              className={`button button_ghost ${styles.backButton}`}
              onClick={() => setStep((prev) => (prev === 4 ? 3 : prev === 3 ? 2 : 1))}
            >
              {texts.common.back}
            </button>
          )}

          <button
            className={`button ${!canSubmit ? styles.submitDisabled : ''}`}
            type={step === 4 && !canSubmit ? 'button' : 'submit'}
            aria-disabled={step === 4 && !canSubmit}
            disabled={loading}
            onClick={() => {
              if (step === 4 && !canSubmit) onRequireAuth?.();
            }}
          >
            {step === 4 ? texts.common.submit : texts.common.next}
          </button>
        </footer>
      </form>
    </section>
  );
}
