// service.ts
import type { UserAddress } from '../profile';

// --------------------------------------
// Tipos generales
// --------------------------------------
export type ServiceStatus = 'submitted' | 'accepted' | 'in progress' | 'completed' | 'cancelled';

export type ServiceType =
  | 'painting'
  | 'repairs-installations'
  | 'kitchen-cleaning'
  | 'kitchen-assembly'
  | 'house-cleaning'
  | 'furniture-assembly'
  | 'window-cleaning'
  | 'moving-help';

// --------------------------------------
// Base para todos los detalles de servicio
// --------------------------------------
export interface BaseServiceDetails {
  title: string;
  icon: string;
  notes?: string;
  images?: string[];
}

// --------------------------------------
// Estructura de solicitud general
// --------------------------------------
export interface ServiceRequest {
  id: string;
  userId: string;
  createdAt: string;
  serviceAddress: string;
  preferredDate: string;
  preferredTime: string;
  status: ServiceStatus;
  totalPrice: number;
  totalEstimatedDuration: number;
  services: ServiceRequestItem[];
}

// --------------------------------------
// Definición de cada tipo de servicio
// --------------------------------------
export interface FurnitureAssemblyDetails {
  title: string;
  icon: string;
  notes?: string;
  type: string;
  location: string;
  quantity: number;
  position: 'floor' | 'wall';
  width?: string;
  height?: string;
  depth?: string;
  doors?: number;
  drawers?: number;
}

export interface FurnitureAssemblyRequest {
  id: string;
  serviceType: 'furniture-assembly';
  price: number;
  estimatedDuration: number;
  icon: string;
  details: FurnitureAssemblyDetails;
}

export interface KitchenAssemblyRequest {
  id: string;
  serviceType: 'kitchen-assembly';
  price: number;
  estimatedDuration: number;
  icon: string;
  details: BaseServiceDetails & {
    length: number;
    lowerCabinets: number;
    upperCabinets: number;
    layout: string;
    appliances: string[];
    island?: string;
    islandCabinet?: number;
    islandLength?: string;
    islandWidth?: string;
    disassemblyNeed?: string;
    provider?: string;
  };
}

export interface KitchenCleaningRequest {
  id: string;
  serviceType: 'kitchen-cleaning';
  price: number;
  estimatedDuration: number;
  icon: string;
  details: BaseServiceDetails & {
    appliances: string[];
    size: number;
  };
}

export interface HouseCleaningRequest {
  serviceType: 'house-cleaning';
  icon: string;
  details: BaseServiceDetails & {
    surface: number;
    livingRoom: number;
    bedRooms: number;
    badRooms: number;
    balcon?: number;
    kitchen: string;
    stairs?: string;
  };
}

export interface WindowCleaningRequest {
  id: string;
  serviceType: 'window-cleaning';
  price: number;
  estimatedDuration: number;
  icon: string;
  details: BaseServiceDetails & {
    windows: number;
    doors: number;
    access: string;
  };
}

export interface PaintingRequest {
  id: string;
  serviceType: 'painting';
  price: number;
  estimatedDuration: number;
  icon: string;
  details: BaseServiceDetails & {
    area: string;
    surfaces: string[];
    colorPreferences?: string;
    removeOldPaint?: string;
  };
}

export interface RepairsInstallationsRequest {
  id: string;
  serviceType: 'repairs-installations';
  price: number;
  estimatedDuration: number;
  icon: string;
  details: BaseServiceDetails & {
    category: string;
    quantity?: number;
    materialsProvided?: string;
    accessNotes?: string;
  };
}

export interface MovingHelpRequest {
  id: string;
  serviceType: 'moving-help';
  price: number;
  estimatedDuration: number;
  icon: string;
  details: BaseServiceDetails & {
    area: string;
    length: string;
    rooms: number;
    floorType?: string;
    heavyItems?: string[];
    helpersNeeded?: number;
  };
}

// --------------------------------------
// Unión de todos los servicios
// --------------------------------------
export type ServiceRequestItem =
  | FurnitureAssemblyRequest
  | KitchenAssemblyRequest
  | KitchenCleaningRequest
  | HouseCleaningRequest
  | WindowCleaningRequest
  | PaintingRequest
  | RepairsInstallationsRequest
  | MovingHelpRequest;

// --------------------------------------
// Cleaning request domain (new backend)
// --------------------------------------

export type CleaningServiceType = 'cleaning';
export type CleaningCustomerType = 'private' | 'business' | 'property_management';
export type CleaningRequestStatus =
  | 'submitted'
  | 'date_confirmed'
  | 'alternative_date_proposed'
  | 'visit_completed'
  | 'task_created'
  | 'cancelled';
export type CleaningFrequency = 'once' | 'two_per_month' | 'three_per_month' | 'weekly';
export type PropertySizeRange = 'under_50' | '50_80' | '80_120' | 'over_120';

export interface CleaningPropertyDetails {
  sizeRange: PropertySizeRange;
  roomsCount: number;
  hasBalcony: boolean;
  hasIndoorStairs: boolean;
  hasPets: boolean;
  details?: string;
}

export interface CleaningRequestDetailsInput {
  frequency: CleaningFrequency;
  property: CleaningPropertyDetails;
}

export type WorkAddressSource = 'primary' | 'saved' | 'new';

export interface WorkAddressSelection {
  address: UserAddress;
  source: WorkAddressSource;
  saveToProfile?: boolean;
  label?: string;
}

export interface CleaningRequestSubmission {
  customerType: CleaningCustomerType;
  details: CleaningRequestDetailsInput;
  preferredVisitSlot: {
    start: Date;
    end: Date;
  };
  workAddress: WorkAddressSelection;
}
