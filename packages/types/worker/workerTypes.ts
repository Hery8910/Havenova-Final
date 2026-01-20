// types/worker.ts
import { ThemeMode } from '../profile/profileTypes';

export type WorkerLanguage = 'de' | 'en';

export interface WorkerRecord {
  id?: string;
  userId: string;
  clientId: string;
  email?: string;
  name?: string;
  jobTitle?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  language?: WorkerLanguage;
  theme?: ThemeMode;
  extra?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  authCreated?: boolean;
  userClientCreated?: boolean;
}

export interface WorkerDetailData {
  id?: string;
  userId: string;
  clientId?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  jobTitle?: string;
  language?: WorkerLanguage;
  extra?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
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
}

export interface UpdateWorkerProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  jobTitle?: string;
  language?: WorkerLanguage;
  theme?: ThemeMode;
  extra?: Record<string, unknown>;
}

export interface WorkerListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface WorkerListItem {
  userId: string;
  clientId: string;
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  profileImage?: string;
  createdAt?: string;
}

export interface WorkerListMeta {
  total: number;
  page: number;
  limit: number;
}
