import type { PropertySizeRange } from '../../../../../types/services';
import type {
  FurnitureAssemblyRequestDetails,
  KitchenAssemblyRequestDetails,
  MovingHelpRequestDetails,
  PaintingRequestDetails,
  RepairsInstallationsRequestDetails,
} from '../../../../../types/services';
import type {
  HomeServiceCanonicalType,
  HomeServiceRequestFieldErrors,
  HomeServiceRequestFormState,
  HomeServiceRequestFormTexts,
  HomeServiceRequestStep,
  HomeServiceRequestTouchedFields,
} from './homeServiceRequest.types';
import type { HomeServiceKind } from './homeServiceTypes';
import type { PaintingPaintScope as PaintingFormPaintScope } from './PaintingDetailsStep/PaintingDetailsStep';

export const HOME_SERVICE_TYPE_ORDER: HomeServiceKind[] = [
  'painting',
  'repairs-installations',
  'furniture-assembly',
  'kitchen-assembly',
  'moving-help',
];

export const createInitialHomeServiceRequestState = (): HomeServiceRequestFormState => ({
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

export const getHomeServiceRequestErrors = ({
  texts,
  values,
}: {
  texts: Pick<HomeServiceRequestFormTexts, 'errors' | 'scheduling' | 'serviceAddress'>;
  values: HomeServiceRequestFormState;
}): HomeServiceRequestFieldErrors => {
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
};

export const getHomeServiceStepHeading = ({
  step,
  texts,
  values,
}: {
  step: HomeServiceRequestStep;
  texts: HomeServiceRequestFormTexts;
  values: Pick<HomeServiceRequestFormState, 'serviceType'>;
}): string => {
  switch (step) {
    case 1:
      return texts.process.steps.customerService.heading;
    case 2:
      return values.serviceType === 'painting'
        ? texts.serviceDetails.painting.title
        : texts.serviceDetails.title;
    case 3:
      return texts.scheduling?.title ?? texts.process.steps.scheduling.heading;
    case 4:
      return texts.serviceAddress?.title ?? texts.process.steps.serviceAddress.heading;
    case 5:
      return texts.process.steps.review?.heading ?? texts.review.title;
  }
};

export const getHomeServiceFooterValidationMessage = ({
  step,
  texts,
  values,
  errors,
  touched,
  submitted,
}: {
  step: HomeServiceRequestStep;
  texts: HomeServiceRequestFormTexts;
  values: Pick<HomeServiceRequestFormState, 'serviceType'>;
  errors: HomeServiceRequestFieldErrors;
  touched: HomeServiceRequestTouchedFields;
  submitted: boolean;
}): string => {
  const showError = (field: keyof HomeServiceRequestFieldErrors) =>
    Boolean((submitted || touched[field]) && errors[field]);

  if (step === 1) {
    if (showError('customerType') && errors.customerType) {
      return `${texts.customerType.label}: ${errors.customerType}`;
    }

    if (showError('serviceType') && errors.serviceType) {
      return `${texts.serviceType.label}: ${errors.serviceType}`;
    }

    return '';
  }

  if (step === 2) {
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
  }

  if (step === 3 && showError('preferredVisitSlot') && errors.preferredVisitSlot) {
    return `${texts.scheduling?.title ?? texts.process.steps.scheduling.heading}: ${errors.preferredVisitSlot}`;
  }

  if (step === 4 && showError('workAddress') && errors.workAddress) {
    return `${texts.serviceAddress?.title ?? texts.process.steps.serviceAddress.heading}: ${errors.workAddress}`;
  }

  return '';
};

export const markHomeServiceStepOneTouched = (
  current: HomeServiceRequestTouchedFields
): HomeServiceRequestTouchedFields => ({
  ...current,
  customerType: true,
  serviceType: true,
});

export const markHomeServiceStepTwoTouched = ({
  current,
  serviceType,
}: {
  current: HomeServiceRequestTouchedFields;
  serviceType: HomeServiceRequestFormState['serviceType'];
}): HomeServiceRequestTouchedFields => ({
  ...current,
  serviceDetails: true,
  paintingPaintScope: serviceType === 'painting' ? true : current.paintingPaintScope,
  paintingSizeRange: serviceType === 'painting' ? true : current.paintingSizeRange,
});

export const applyHomeServiceTypeSelection = ({
  current,
  serviceType,
}: {
  current: HomeServiceRequestFormState;
  serviceType: HomeServiceKind;
}): HomeServiceRequestFormState => ({
  ...current,
  serviceType,
  serviceDetails:
    serviceType === 'painting' ? current.paintingDetails.description : current.serviceDetails,
});

export const applyHomeServiceDetailsChange = ({
  current,
  description,
}: {
  current: HomeServiceRequestFormState;
  description: string;
}): HomeServiceRequestFormState => ({
  ...current,
  serviceDetails: description,
  paintingDetails:
    current.serviceType === 'painting'
      ? { ...current.paintingDetails, description }
      : current.paintingDetails,
});

export const applyPaintingScopeChange = ({
  current,
  paintScope,
}: {
  current: HomeServiceRequestFormState;
  paintScope: HomeServiceRequestFormState['paintingDetails']['paintScope'];
}): HomeServiceRequestFormState => ({
  ...current,
  paintingDetails: { ...current.paintingDetails, paintScope },
});

export const applyPaintingRoomsDelta = ({
  current,
  delta,
}: {
  current: HomeServiceRequestFormState;
  delta: -1 | 1;
}): HomeServiceRequestFormState => ({
  ...current,
  paintingDetails: {
    ...current.paintingDetails,
    roomsCount: Math.max(1, current.paintingDetails.roomsCount + delta),
  },
});

export const applyPaintingSizeRangeChange = ({
  current,
  sizeRange,
}: {
  current: HomeServiceRequestFormState;
  sizeRange: HomeServiceRequestFormState['paintingDetails']['sizeRange'];
}): HomeServiceRequestFormState => ({
  ...current,
  paintingDetails: { ...current.paintingDetails, sizeRange },
});

export const mapHomeServiceKindToCanonicalType = (
  serviceType: HomeServiceKind
): HomeServiceCanonicalType => {
  switch (serviceType) {
    case 'painting':
      return 'painting';
    case 'repairs-installations':
      return 'repairs_installations';
    case 'furniture-assembly':
      return 'furniture_assembly';
    case 'kitchen-assembly':
      return 'kitchen_assembly';
    case 'moving-help':
      return 'moving_help';
  }
};

export const mapPaintingScopeToRequestScope = (
  paintScope: PaintingFormPaintScope
): PaintingRequestDetails['paintScope'] => {
  switch (paintScope) {
    case 'one_wall':
    case 'one_room':
      return 'single_room';
    case 'multiple_rooms':
      return 'multiple_rooms';
    case 'entire_apartment':
      return 'full_property';
  }
};

export const buildHomeServiceDetails = (
  serviceType: HomeServiceKind,
  input: {
    serviceDetails: string;
    paintingDetails: {
      paintScope: PaintingFormPaintScope | '';
      roomsCount: number;
      sizeRange: PropertySizeRange | '';
      description: string;
    };
  }
):
  | PaintingRequestDetails
  | RepairsInstallationsRequestDetails
  | FurnitureAssemblyRequestDetails
  | KitchenAssemblyRequestDetails
  | MovingHelpRequestDetails => {
  const description = input.serviceDetails.trim();

  switch (serviceType) {
    case 'painting':
      return {
        paintScope: mapPaintingScopeToRequestScope(input.paintingDetails.paintScope || 'one_room'),
        roomsCount: input.paintingDetails.roomsCount,
        sizeRange: input.paintingDetails.sizeRange || undefined,
        description: input.paintingDetails.description.trim(),
      };
    case 'repairs-installations':
      return { description };
    case 'furniture-assembly':
      return { description };
    case 'kitchen-assembly':
      return { description };
    case 'moving-help':
      return { description };
  }
};
