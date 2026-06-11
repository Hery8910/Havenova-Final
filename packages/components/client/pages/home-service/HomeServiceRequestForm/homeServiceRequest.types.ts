import type {
  CreateServiceRequestInput,
  CustomerType,
  FurnitureAssemblyRequestDetails,
  KitchenAssemblyRequestDetails,
  MovingHelpRequestDetails,
  PaintingRequestDetails,
  RepairsInstallationsRequestDetails,
} from '../../../../../types/services';
import type { ServiceRequestWorkAddressSelection } from '../../shared/serviceRequest/serviceRequestUi.types';
import type { HomeServiceKind } from './homeServiceTypes';
import type { PaintingPaintScope as PaintingFormPaintScope } from './PaintingDetailsStep/PaintingDetailsStep';

export type HomeServiceCustomerType = CustomerType;
export type HomeServiceWorkAddressSelection = ServiceRequestWorkAddressSelection;

export type HomeServiceCanonicalType =
  | 'painting'
  | 'repairs_installations'
  | 'furniture_assembly'
  | 'kitchen_assembly'
  | 'moving_help';

export type HomeServiceRequestFormSubmission = CreateServiceRequestInput<HomeServiceCanonicalType> & {
  workAddress: HomeServiceWorkAddressSelection;
};

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
      sizeRange: PaintingRequestDetails['sizeRange'] | '';
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
