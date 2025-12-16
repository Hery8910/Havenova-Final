// ---------------------------
// PERFIL USER
// ---------------------------

import { AuthRole } from '../auth';

export type ThemeMode = 'light' | 'dark';

export interface UserClientProfile {
  name?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  createdAt?: string;
  isVerified?: boolean;

  language: string;
  theme: ThemeMode;
}

// ---------------------------
// WORKER PROFILE
// ---------------------------

export interface WorkerProfile extends UserClientProfile {
  skills?: string[];
  zones?: string[];
  availability?: any; // Tipar más adelante
}

// ---------------------------
// UPDATE PROFILE
// ---------------------------

export interface UpdateUserProfilePayload {
  clientId: string;
  role: AuthRole;

  name?: string;
  address?: string;
  phone?: string;
  language?: string;
  theme?: ThemeMode;
  profileImage?: string;
}

export interface UpdateUserProfileResponse {
  success: boolean;
  code: string;
  profile: UserClientProfile;
}

export interface CreateUserProfileResponse extends UpdateUserProfileResponse {}
