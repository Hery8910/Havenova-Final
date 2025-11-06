import { BaseServiceDetails } from '../../../../types';

export interface FurnitureAssemblyDetails extends BaseServiceDetails {
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

export interface FurnitureServiceInput {
  width: boolean;
  height: boolean;
  depth: boolean;
  doors: boolean;
  drawers: boolean;
  wall: boolean;
}
