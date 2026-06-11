import type {
  CleaningRequestDetails,
  CreateServiceRequestInput,
  CustomerType,
} from '../../../../../types/services';
import type { ServiceRequestWorkAddressSelection } from '../../shared/serviceRequest/serviceRequestUi.types';

export type CleaningRequestCustomerType = CustomerType;

export type CleaningWorkAddressSelection = ServiceRequestWorkAddressSelection;

export interface CleaningRequestFormSubmission
  extends Omit<CreateServiceRequestInput<'cleaning'>, 'workAddress'> {
  workAddress: CleaningWorkAddressSelection;
}

export type CleaningRequestDetailsInput = CleaningRequestDetails;
