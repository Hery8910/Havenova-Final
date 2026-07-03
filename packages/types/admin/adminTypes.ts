import { ThemeMode } from '../profile/profileTypes';
import { WorkerRole } from '../worker/workerTypes';

export type AdminOperationalRole = WorkerRole;

export interface AdminRecord {
  id?: string;
  userClientId: string;
  clientId: string;
  email?: string;
  name?: string;
  jobTitle?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  language?: 'de' | 'en' | 'es';
  theme?: ThemeMode;
  roles?: AdminOperationalRole[];
  extra?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  authCreated?: boolean;
  userClientCreated?: boolean;
  adminCreated?: boolean;
  adminUpdated?: boolean;
  inviteSent?: boolean;
  status?: string;
  isVerified?: boolean;
}

export interface CreateAdminProfilePayload {
  clientId: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  jobTitle?: string;
  language?: 'de' | 'en' | 'es';
  theme?: ThemeMode;
  roles?: AdminOperationalRole[];
}

export interface UpdateAdminProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  jobTitle?: string;
  language?: 'de' | 'en' | 'es';
  theme?: ThemeMode;
  roles?: AdminOperationalRole[];
  extra?: Record<string, unknown>;
}

export interface ResendAdminInvitePayload {
  clientId: string;
  email: string;
  language?: 'de' | 'en' | 'es';
}

export interface ResendAdminInviteResponse {
  success: boolean;
  code: string;
  message?: string;
  data?: {
    userClientId: string;
    clientId: string;
    email: string;
    name?: string;
    language?: 'de' | 'en' | 'es';
  };
}
