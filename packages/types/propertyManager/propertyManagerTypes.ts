import { ApiResponse } from '../api';

export type PropertyManagerStatus = 'active' | 'inactive';
export type PropertyManagerContactMethod = 'email' | 'phone' | 'none';

export interface PropertyManager {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  status: PropertyManagerStatus;
  buildingCount: number;
  preferredContactMethod?: PropertyManagerContactMethod;
  notes?: string;
  extra?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyManagerBuildingCounts {
  total: number;
  active: number;
  inactive: number;
}

export interface PropertyManagerDetail {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  status: PropertyManagerStatus;
  preferredContactMethod?: PropertyManagerContactMethod;
  notes?: string;
  extra?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  buildingCounts: PropertyManagerBuildingCounts;
}

export interface PropertyManagersQuery {
  clientId?: string;
  status?: PropertyManagerStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PropertyManagersMeta {
  total: number;
  page: number;
  limit: number;
}

export interface PropertyManagerLookupItem {
  id: string;
  name: string;
  email?: string;
}

export interface PropertyManagerLookupQuery {
  clientId?: string;
  search?: string;
  limit?: number;
}

export type PropertyManagersListResponse = ApiResponse<PropertyManager[]> & {
  meta: PropertyManagersMeta;
};

export type PropertyManagerDetailResponse = ApiResponse<PropertyManagerDetail>;
export type PropertyManagerLookupResponse = ApiResponse<PropertyManagerLookupItem[]>;

export interface PropertyManagerCreatePayload {
  clientId: string;
  name: string;
  email?: string;
  phone?: string;
  status?: PropertyManagerStatus;
  address?: string;
  preferredContactMethod?: PropertyManagerContactMethod;
  notes?: string;
  extra?: Record<string, unknown>;
}

export interface PropertyManagerUpdatePayload {
  name?: string;
  email?: string;
  phone?: string;
  status?: PropertyManagerStatus;
  buildingCount?: number;
  address?: string;
  preferredContactMethod?: PropertyManagerContactMethod;
  notes?: string;
  extra?: Record<string, unknown>;
}

export type PropertyManagerCreateResponse = ApiResponse<{ id: string }>;
export type PropertyManagerUpdateResponse = ApiResponse<{ id: string }>;
