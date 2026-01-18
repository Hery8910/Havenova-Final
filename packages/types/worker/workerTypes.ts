// types/worker.ts
import { ThemeMode } from '../profile/profileTypes';

export type EmploymentType = 'EMPLOYEE' | 'CONTRACTOR';
export type PayType = 'HOURLY' | 'SALARIED';
export type Currency = 'EUR';

export interface CreateWorkerPayload {
  name: string;
  email: string;
  phone?: string;
  profileImage: string;
  password?: string;
  roles?: string[];
  language: string;
  clientId: string;
  employment?: {
    type: EmploymentType;
    startDate: string; // ISO (yyyy-mm-dd)
    endDate?: string | undefined;
  };
  pay?:
    | { type: 'HOURLY'; currency: Currency; hourlyRate: number }
    | { type: 'SALARIED'; currency: Currency; monthlySalary: number };
}

export type WorkerLanguage = 'de' | 'en';

export interface WorkerRecord {
  userId: string;
  clientId: string;
  email?: string;
  name: string;
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

export interface CreateWorkerProfilePayload {
  clientId: string;
  email: string;
  name: string;
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
  createdAt?: string;
}

export interface WorkerListMeta {
  total: number;
  page: number;
  limit: number;
}
