import type { CleaningRequestDetails } from '../../../../../types/services';
import type {
  CleaningRequestDraftPayload,
  CleaningRequestDraftStep,
  CleaningRequestFieldErrors,
  CleaningRequestFormState,
  CleaningRequestFormTexts,
  CleaningRequestStep,
} from './cleaningRequest.types';

const INJECTION_PATTERN =
  /(<\s*script|<\/\s*script|javascript:|onerror\s*=|onload\s*=|union\s+select|drop\s+table|insert\s+into|delete\s+from|--|\/\*|\*\/)/i;

export const CLEANING_REQUEST_DRAFT_VERSION = 1;

export const sanitizeCleaningRequestText = (value: string) =>
  value.normalize('NFKC').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();

export const createInitialCleaningRequestState = (): CleaningRequestFormState => ({
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

export const isCleaningDraftStep = (value: unknown): value is CleaningRequestDraftStep =>
  value === 1 || value === 2 || value === 3 || value === 4 || value === 5;

export const serializeCleaningRequestDraft = (
  values: CleaningRequestFormState,
  step: CleaningRequestDraftStep
): CleaningRequestDraftPayload => ({
  step,
  values: {
    ...values,
    preferredVisitSlot: values.preferredVisitSlot
      ? {
          start: values.preferredVisitSlot.start.toISOString(),
          end: values.preferredVisitSlot.end.toISOString(),
        }
      : null,
  },
});

export const parseCleaningRequestDraft = (
  parsed: CleaningRequestDraftPayload | null
): { step: CleaningRequestDraftStep; values: CleaningRequestFormState } | null => {
  if (!parsed || !isCleaningDraftStep(parsed.step)) return null;

  return {
    step: parsed.step,
    values: {
      ...createInitialCleaningRequestState(),
      ...parsed.values,
      preferredVisitSlot: parsed.values?.preferredVisitSlot
        ? {
            start: new Date(parsed.values.preferredVisitSlot.start),
            end: new Date(parsed.values.preferredVisitSlot.end),
          }
        : null,
    },
  };
};

export const getCleaningRequestErrors = ({
  texts,
  values,
}: {
  texts: Pick<CleaningRequestFormTexts, 'errors' | 'scheduling' | 'serviceAddress'>;
  values: CleaningRequestFormState;
}): CleaningRequestFieldErrors => {
  const next: CleaningRequestFieldErrors = {};
  const detailsRaw = values.details || '';
  const details = sanitizeCleaningRequestText(detailsRaw);
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
};

export const getCleaningStepHeading = ({
  step,
  texts,
}: {
  step: CleaningRequestStep;
  texts: CleaningRequestFormTexts;
}): string => {
  switch (step) {
    case 1:
      return texts.process.steps.customerFrequency.heading;
    case 2:
      return texts.process.steps.propertyDetails.heading;
    case 3:
      return texts.process.steps.scheduling.heading;
    case 4:
      return texts.process.steps.serviceAddress.heading;
    case 5:
      return texts.process.steps.review?.heading ?? texts.review.title;
  }
};

export const getCleaningFooterValidationMessage = ({
  step,
  texts,
  errors,
  touched,
  submitted,
}: {
  step: CleaningRequestStep;
  texts: CleaningRequestFormTexts;
  errors: CleaningRequestFieldErrors;
  touched: Record<keyof CleaningRequestFormState, boolean>;
  submitted: boolean;
}): string => {
  const showError = (field: keyof CleaningRequestFieldErrors) =>
    Boolean((submitted || touched[field]) && errors[field]);

  if (step === 1) {
    if (showError('customerType') && errors.customerType) {
      return `${texts.customerType.label}: ${errors.customerType}`;
    }

    if (showError('frequency') && errors.frequency) {
      return `${texts.frequency.label}: ${errors.frequency}`;
    }

    return '';
  }

  if (step === 2) {
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
  }

  if (step === 3 && showError('preferredVisitSlot') && errors.preferredVisitSlot) {
    return `${texts.scheduling?.title ?? texts.process.steps.scheduling.heading}: ${errors.preferredVisitSlot}`;
  }

  if (step === 4 && showError('workAddress') && errors.workAddress) {
    return `${texts.serviceAddress?.title ?? texts.process.steps.serviceAddress.heading}: ${errors.workAddress}`;
  }

  return '';
};

export const markCleaningStepOneTouched = (
  current: Record<keyof CleaningRequestFormState, boolean>
): Record<keyof CleaningRequestFormState, boolean> => ({
  ...current,
  customerType: true,
  frequency: true,
});

export const markCleaningStepTwoTouched = (
  current: Record<keyof CleaningRequestFormState, boolean>
): Record<keyof CleaningRequestFormState, boolean> => ({
  ...current,
  sizeRange: true,
  roomsCount: true,
  details: true,
});

export const buildCleaningRequestDetails = (
  values: Pick<
    CleaningRequestFormState,
    | 'frequency'
    | 'sizeRange'
    | 'roomsCount'
    | 'hasBalcony'
    | 'hasIndoorStairs'
    | 'hasPets'
    | 'details'
  >
): CleaningRequestDetails | null => {
  if (!values.frequency || !values.sizeRange) {
    return null;
  }

  const roomsCount = Number(values.roomsCount);
  if (!Number.isInteger(roomsCount)) return null;

  return {
    frequency: values.frequency,
    property: {
      sizeRange: values.sizeRange,
      roomsCount,
      hasBalcony: values.hasBalcony,
      hasIndoorStairs: values.hasIndoorStairs,
      hasPets: values.hasPets,
      details: sanitizeCleaningRequestText(values.details) || undefined,
    },
  };
};
