import type {
  CreateServiceRequestInput,
  CustomerType,
  FurnitureAssemblyRequestDetails,
  KitchenAssemblyRequestDetails,
  MovingHelpRequestDetails,
  PaintingRequestDetails,
  PropertySizeRange,
  RepairsInstallationsRequestDetails,
} from '../../../../../types/services';
import type { SelectedCalendarSlot } from '../../../../../types/calendar';
import type { ServiceRequestWorkAddressSelection } from '../../shared/serviceRequest/serviceRequestUi.types';
import type {
  ServiceRequestAddressTexts,
  ServiceRequestSchedulingTexts,
} from '../../shared/serviceRequest/serviceRequestUi.types';
import type { HomeServiceKind } from './homeServiceTypes';
import type { PaintingPaintScope as PaintingFormPaintScope } from './PaintingDetailsStep/PaintingDetailsStep';

export type HomeServiceCustomerType = CustomerType;
export type HomeServiceWorkAddressSelection = ServiceRequestWorkAddressSelection;
export type HomeServiceRequestFieldKey =
  | 'customerType'
  | 'serviceType'
  | 'serviceDetails'
  | 'paintingPaintScope'
  | 'paintingSizeRange'
  | 'preferredVisitSlot'
  | 'workAddress';

export type HomeServiceRequestFieldErrors = Partial<Record<HomeServiceRequestFieldKey, string>>;
export type HomeServiceRequestTouchedFields = Record<HomeServiceRequestFieldKey, boolean>;

export type HomeServicePaintingDetails = {
  paintScope: PaintingFormPaintScope | '';
  roomsCount: number;
  sizeRange: PropertySizeRange | '';
  description: string;
};

export type HomeServiceRequestFormState = {
  customerType: HomeServiceCustomerType | '';
  serviceType: HomeServiceKind | '';
  serviceDetails: string;
  paintingDetails: HomeServicePaintingDetails;
  preferredVisitSlot: SelectedCalendarSlot | null;
  workAddress: HomeServiceWorkAddressSelection | null;
};

export type HomeServiceCanonicalType =
  | 'painting'
  | 'repairs_installations'
  | 'furniture_assembly'
  | 'kitchen_assembly'
  | 'moving_help';

export type HomeServiceRequestFormSubmission = CreateServiceRequestInput<HomeServiceCanonicalType> & {
  workAddress: HomeServiceWorkAddressSelection;
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
    options: Record<HomeServiceCustomerType, string>;
  };
  serviceType: {
    label: string;
    options: Record<HomeServiceKind, { title: string }>;
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
      paintScopeOptions: Record<PaintingFormPaintScope, string>;
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
  scheduling?: ServiceRequestSchedulingTexts;
  serviceAddress?: ServiceRequestAddressTexts;
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

export const HOME_SERVICE_TYPE_ORDER: HomeServiceKind[] = [
  'painting',
  'repairs-installations',
  'furniture-assembly',
  'kitchen-assembly',
  'moving-help',
];

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
    paintingDetails: HomeServicePaintingDetails;
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
      return {
        description,
      };
    case 'furniture-assembly':
      return {
        description,
      };
    case 'kitchen-assembly':
      return {
        description,
      };
    case 'moving-help':
      return {
        description,
      };
  }
};
