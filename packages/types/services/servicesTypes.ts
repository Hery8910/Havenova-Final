// service.ts

// --------------------------------------
// Tipos generales
// --------------------------------------
export type ServiceStatus = 'submitted' | 'accepted' | 'in progress' | 'completed' | 'cancelled';

export type ServiceType =
  | 'house-service'
  | 'kitchen-cleaning'
  | 'kitchen-assembly'
  | 'house-cleaning'
  | 'furniture-assembly'
  | 'window-cleaning';

// --------------------------------------
// Base para todos los detalles de servicio
// --------------------------------------
export interface BaseServiceDetails {
  title: string;
  icon: string;
  notes?: string;
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
  type: string /*  */;
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
  id: string;
  serviceType: 'house-cleaning';
  price: number;
  estimatedDuration: number;
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

export interface HouseServiceRequest {
  id: string;
  serviceType: 'house-service';
  price: number;
  estimatedDuration: number;
  icon: string;
  details: BaseServiceDetails & {
    label: string;
    category: string;
    quantity: number;
    area: string;
    length: string;
    rooms: number;
    ceiling: string;
    floorType: string;
    removeOld?: string;
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
  | HouseServiceRequest;
