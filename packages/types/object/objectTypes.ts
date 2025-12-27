import { ApiResponse } from '../api';

export type ObjectStatus = 'active' | 'inactive';

export interface BuildingListItem {
  id: string;
  propertyManagerId?: string;
  propertyManagerName?: string;
  objectNumber: string;
  address: string;
  entrancesCount?: string;
  status: ObjectStatus;
}

export interface BuildingListMeta {
  total: number;
  page: number;
  limit: number;
  activeCount: number;
  inactiveCount: number;
}

export interface BuildingListQuery {
  page?: number;
  limit?: number;
  status?: ObjectStatus;
  search?: string;
}

export type CleaningDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface ObjectFormValues {
  propertyManagerId: string;
  objectNumber: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  district: string;
  entrancesCount: string;
  floorCount: string;
  preferredCleaningDay: CleaningDay | '';
  preferredCleaningWindowDay: CleaningDay | '';
  cleaningSuppliesRoom: string;
  keyAccess: string;
  waterAccess: string;
  waterDisposal: string;
  ladderAvailable: string;
  electricityAccess: string;
  lightBulbChangeRequired: string;
  flooringType: string;
  onSiteContact: string;
  decisionMaker: string;
  cleaningInfo: string;
  status: ObjectStatus;
  notes: string;
}

export interface BuildingDetail {
  id: string;
  propertyManagerId?: string;
  propertyManagerName?: string;
  objectNumber: string;
  address: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  district: string;
  entrancesCount?: string;
  floorCount?: string;
  preferredCleaningDay: CleaningDay | '';
  preferredCleaningWindowDay: CleaningDay | '';
  cleaningSuppliesRoom?: string;
  keyAccess?: string;
  waterAccess?: string;
  waterDisposal?: string;
  ladderAvailable?: string;
  electricityAccess?: string;
  lightBulbChangeRequired?: string;
  flooringType?: string;
  onSiteContact?: string;
  decisionMaker?: string;
  cleaningInfo?: string;
  status: ObjectStatus;
  notes?: string;
  extra?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface BuildingCreatePayload {
  clientId: string;
  propertyManagerId: string;
  objectNumber: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  district: string;
  entrancesCount?: string;
  floorCount?: string;
  preferredCleaningDay: CleaningDay | '';
  preferredCleaningWindowDay: CleaningDay | '';
  cleaningSuppliesRoom?: string;
  keyAccess?: string;
  waterAccess?: string;
  waterDisposal?: string;
  ladderAvailable?: string;
  electricityAccess?: string;
  lightBulbChangeRequired?: string;
  flooringType?: string;
  onSiteContact?: string;
  decisionMaker?: string;
  cleaningInfo?: string;
  status?: ObjectStatus;
  notes?: string;
  extra?: Record<string, unknown>;
}

export interface BuildingUpdatePayload {
  propertyManagerId?: string;
  objectNumber?: string;
  street?: string;
  streetNumber?: string;
  postalCode?: string;
  district?: string;
  entrancesCount?: string;
  floorCount?: string;
  preferredCleaningDay: CleaningDay | '';
  preferredCleaningWindowDay: CleaningDay | '';
  cleaningSuppliesRoom?: string;
  keyAccess?: string;
  waterAccess?: string;
  waterDisposal?: string;
  ladderAvailable?: string;
  electricityAccess?: string;
  lightBulbChangeRequired?: string;
  flooringType?: string;
  onSiteContact?: string;
  decisionMaker?: string;
  cleaningInfo?: string;
  status?: ObjectStatus;
  notes?: string;
  extra?: Record<string, unknown>;
}

export type BuildingListResponse = ApiResponse<BuildingListItem[]> & {
  meta: BuildingListMeta;
};

export type BuildingDetailResponse = ApiResponse<BuildingDetail>;
export type BuildingCreateResponse = ApiResponse<{
  id: string;
  objectNumber: string;
  status: ObjectStatus;
}>;
export type BuildingUpdateResponse = ApiResponse<{
  id: string;
  objectNumber: string;
  status: ObjectStatus;
}>;
