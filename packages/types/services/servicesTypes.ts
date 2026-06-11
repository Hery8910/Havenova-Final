import type { UserAddress } from '../profile';

// --------------------------------------
// Shared service-request primitives
// --------------------------------------

export type ServiceType =
  | 'cleaning'
  | 'painting'
  | 'repairs_installations'
  | 'furniture_assembly'
  | 'kitchen_assembly'
  | 'moving_help';

export type CustomerType = 'private' | 'business';

export type ServiceRequestStatus =
  | 'submitted'
  | 'under_review'
  | 'visit_scheduled'
  | 'visit_completed'
  | 'converted_to_work_order'
  | 'cancelled';

export type WorkAddressSource = 'primary' | 'saved' | 'new';
export type CleaningFrequency = 'once' | 'two_per_month' | 'three_per_month' | 'weekly';
export type PropertySizeRange = 'under_50' | '50_80' | '80_120' | 'over_120';
export type PaintingPaintScope = 'single_room' | 'multiple_rooms' | 'full_property';
export type FurnitureAssemblyMountingType = 'floor' | 'wall';

export interface ServiceAddress extends UserAddress {}

export interface PreferredVisitSlot {
  start: string;
  end: string;
}

export interface WorkAddress {
  address: ServiceAddress;
  source?: WorkAddressSource;
}

// --------------------------------------
// Service-specific details
// --------------------------------------

export interface CleaningPropertyDetails {
  sizeRange: PropertySizeRange;
  roomsCount: number;
  hasBalcony: boolean;
  hasIndoorStairs: boolean;
  hasPets: boolean;
  details?: string;
}

export interface CleaningRequestDetails {
  frequency: CleaningFrequency;
  property: CleaningPropertyDetails;
}

export interface PaintingRequestDetails {
  paintScope: PaintingPaintScope;
  roomsCount?: number;
  sizeRange?: PropertySizeRange;
  description: string;
}

export interface RepairsInstallationsRequestDetails {
  category?: string;
  description: string;
  quantity?: number;
  materialsProvided?: boolean;
  accessNotes?: string;
}

export interface FurnitureAssemblyRequestDetails {
  itemType?: string;
  quantity?: number;
  mountingType?: FurnitureAssemblyMountingType;
  width?: string;
  height?: string;
  depth?: string;
  doors?: number;
  drawers?: number;
  description: string;
}

export interface KitchenAssemblyRequestDetails {
  layout?: string;
  length?: number;
  lowerCabinets?: number;
  upperCabinets?: number;
  appliances?: string[];
  island?: boolean;
  islandCabinetCount?: number;
  islandLength?: string;
  islandWidth?: string;
  disassemblyRequired?: boolean;
  provider?: string;
  description: string;
}

export interface MovingHelpRequestDetails {
  area?: string;
  length?: string;
  rooms?: number;
  floorType?: string;
  heavyItems?: string[];
  helpersNeeded?: number;
  description: string;
}

export interface ServiceRequestDetailsMap {
  cleaning: CleaningRequestDetails;
  painting: PaintingRequestDetails;
  repairs_installations: RepairsInstallationsRequestDetails;
  furniture_assembly: FurnitureAssemblyRequestDetails;
  kitchen_assembly: KitchenAssemblyRequestDetails;
  moving_help: MovingHelpRequestDetails;
}

export type ServiceRequestDetails<TServiceType extends ServiceType = ServiceType> =
  ServiceRequestDetailsMap[TServiceType];

// --------------------------------------
// Canonical service-request contracts
// --------------------------------------

export interface ServiceRequestBase<
  TServiceType extends ServiceType = ServiceType,
  TDetails extends ServiceRequestDetails = ServiceRequestDetails<TServiceType>,
> {
  id: string;
  clientId: string;
  userClientId: string;
  serviceType: TServiceType;
  customerType: CustomerType;
  status: ServiceRequestStatus;
  preferredVisitSlot: PreferredVisitSlot;
  workAddress: WorkAddress;
  details: TDetails;
  createdAt: string;
  updatedAt: string;
}

export type ServiceRequest<TServiceType extends ServiceType = ServiceType> = ServiceRequestBase<
  TServiceType,
  ServiceRequestDetails<TServiceType>
>;

export interface CreateServiceRequestInput<
  TServiceType extends ServiceType = ServiceType,
  TDetails extends ServiceRequestDetails = ServiceRequestDetails<TServiceType>,
> {
  serviceType: TServiceType;
  customerType: CustomerType;
  preferredVisitSlot: PreferredVisitSlot;
  workAddress: WorkAddress;
  details: TDetails;
}

export interface UpdateServiceRequestStatusInput {
  status: ServiceRequestStatus;
}

export interface ListServiceRequestsQuery {
  page?: number;
  limit?: number;
  status?: ServiceRequestStatus;
  serviceType?: ServiceType;
  customerType?: CustomerType;
  search?: string;
}

export interface ServiceRequestListMeta {
  total: number;
  page: number;
  limit: number;
}

// --------------------------------------
// Named request specializations
// --------------------------------------

export type CleaningServiceRequest = ServiceRequest<'cleaning'>;
export type PaintingServiceRequest = ServiceRequest<'painting'>;
export type RepairsInstallationsServiceRequest = ServiceRequest<'repairs_installations'>;
export type FurnitureAssemblyServiceRequest = ServiceRequest<'furniture_assembly'>;
export type KitchenAssemblyServiceRequest = ServiceRequest<'kitchen_assembly'>;
export type MovingHelpServiceRequest = ServiceRequest<'moving_help'>;
