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
}

export interface UpdateUserProfileResponse {
  success: boolean;
  code: string;
  profile: UserClientProfile;
}

// ---------------------------
// CONTACT MESSAGE
// ---------------------------

export interface ContactMessagePayload {
  userId: string;
  clientId: string;
  name: string;
  email: string;
  message: string;
  language: string;
  originPath: string;
}

export interface ContactMessageResponse {
  success: boolean;
  code: string;
  message?: string;
  messageId?: string;
}
