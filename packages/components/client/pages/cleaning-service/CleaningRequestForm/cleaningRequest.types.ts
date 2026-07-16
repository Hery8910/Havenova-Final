import type {
  CleaningFrequency,
  CleaningRequestDetails,
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

export type CleaningRequestCustomerType = CustomerType;

export type CleaningWorkAddressSelection = ServiceRequestWorkAddressSelection;

export type CleaningRequestFieldKey =
  | 'customerType'
  | 'frequency'
  | 'sizeRange'
  | 'roomsCount'
  | 'details'
  | 'preferredVisitSlot'
  | 'workAddress';

export type CleaningRequestFieldErrors = Partial<Record<CleaningRequestFieldKey, string>>;

export type CleaningRequestDraftStep = 1 | 2 | 3 | 4 | 5;
export type CleaningRequestStep = 1 | 2 | 3 | 4 | 5;

export type CleaningRequestFormState = {
  customerType: CleaningRequestCustomerType | '';
  frequency: CleaningFrequency | '';
  sizeRange: PropertySizeRange | '';
  roomsCount: string;
  hasBalcony: boolean;
  hasIndoorStairs: boolean;
  hasPets: boolean;
  details: string;
  preferredVisitSlot: SelectedCalendarSlot | null;
  workAddress: CleaningWorkAddressSelection | null;
};

export interface CleaningRequestDraftPayload {
  step: CleaningRequestDraftStep;
  values: {
    customerType: CleaningRequestCustomerType | '';
    frequency: CleaningFrequency | '';
    sizeRange: PropertySizeRange | '';
    roomsCount: string;
    hasBalcony: boolean;
    hasIndoorStairs: boolean;
    hasPets: boolean;
    details: string;
    preferredVisitSlot: {
      start: string;
      end: string;
    } | null;
    workAddress: CleaningWorkAddressSelection | null;
  };
}

export interface CleaningRequestFormSubmission
  extends Omit<CreateServiceRequestInput<'cleaning'>, 'workAddress'> {
  workAddress: CleaningWorkAddressSelection;
}

export type CleaningRequestDetailsInput = CleaningRequestDetails;

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
    options: Record<CleaningRequestCustomerType, string>;
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
  scheduling?: ServiceRequestSchedulingTexts;
  serviceAddress?: ServiceRequestAddressTexts;
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

export const CLEANING_FREQUENCY_ORDER: CleaningFrequency[] = [
  'once',
  'two_per_month',
  'three_per_month',
  'weekly',
];
