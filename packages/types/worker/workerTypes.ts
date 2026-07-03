// types/worker.ts
import { ThemeMode } from '../profile/profileTypes';

export type WorkerLanguage = 'de' | 'en' | 'es';
export type WorkerRole =
  | 'cleaner'
  | 'inspector'
  | 'maintenance_technician'
  | 'repair_technician'
  | 'electrician'
  | 'plumber'
  | 'painter'
  | 'gardener'
  | 'supervisor'
  | 'team_lead';

export interface WorkerRecord {
  id?: string;
  userClientId: string;
  clientId: string;
  email?: string;
  name?: string;
  jobTitle?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  language?: WorkerLanguage;
  theme?: ThemeMode;
  roles?: WorkerRole[];
  extra?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  authCreated?: boolean;
  userClientCreated?: boolean;
  status?: string;
  isVerified?: boolean;
}

export interface WorkerDetailData {
  id?: string;
  userClientId: string;
  clientId?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  jobTitle?: string;
  language?: WorkerLanguage;
  roles?: WorkerRole[];
  extra?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  isVerified?: boolean;
}

export interface CreateWorkerProfilePayload {
  clientId: string;
  email: string;
  name: string;
  jobTitle?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  language?: WorkerLanguage;
  theme?: ThemeMode;
  roles?: WorkerRole[];
}

export interface UpdateWorkerProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  jobTitle?: string;
  language?: WorkerLanguage;
  theme?: ThemeMode;
  roles?: WorkerRole[];
  extra?: Record<string, unknown>;
}

export interface WorkerListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface WorkerListItem {
  userClientId: string;
  clientId: string;
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  profileImage?: string;
  roles?: WorkerRole[];
  createdAt?: string;
  status?: string;
}

export interface WorkerListMeta {
  total: number;
  page: number;
  limit: number;
}

export interface ResendWorkerInvitePayload {
  clientId: string;
  email: string;
  language?: WorkerLanguage;
}

export interface ResendWorkerInviteResponse {
  success: boolean;
  code: string;
  message?: string;
  data?: {
    userClientId: string;
    clientId: string;
    email: string;
    name?: string;
    language?: WorkerLanguage;
  };
}
