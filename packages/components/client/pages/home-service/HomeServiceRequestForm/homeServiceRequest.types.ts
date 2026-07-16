import type {
  CreateServiceRequestInput,
  CustomerType,
  PropertySizeRange,
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
export type HomeServiceRequestStep = 1 | 2 | 3 | 4 | 5;

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
      review?: { heading: string; ariaLabel?: string };
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
    services: Record<
      HomeServiceKind,
      {
        title: string;
        description: string;
        detailsHint: string;
        statusNote?: string;
      }
    >;
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
  review: {
    title: string;
    description: string;
    sections: {
      customer: string;
      details: string;
      scheduling: string;
      address: string;
    };
    labels: {
      customerType: string;
      serviceType: string;
      serviceDetails: string;
      paintScope: string;
      roomsCount: string;
      sizeRange: string;
      visitDate: string;
      visitTime: string;
      address: string;
    };
    emptyDetails: string;
  };
  common: {
    next: string;
    back: string;
    review: string;
    submit: string;
  };
  errors: {
    required: string;
    detailsTooLong: string;
  };
}
