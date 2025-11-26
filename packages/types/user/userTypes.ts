// src/types/user/userTypes.ts

import { CookiePrefs } from '../cookies';

export interface BaseAuthUser {
  userId: string;
  clientId: string;
  email: string;
  isVerified: boolean;
  role: 'guest' | 'user' | 'worker' | 'admin';
  language: string;
  theme: 'light' | 'dark';
}

export interface UserClientProfile {
  name?: string;
  address?: string;
  phone?: string;
  profileImage?: string;
}

export interface WorkerProfile extends UserClientProfile {
  skills?: string[];
  zones?: string[];
  availability?: any;
}
export interface FrontendUser extends BaseAuthUser {
  userProfile?: UserClientProfile;
  workerProfile?: WorkerProfile;
  isLogged: boolean;
}

// Payloads para el frontend
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  language: string;
  clientId: string;
  tosAccepted: boolean;
  cookiePrefs?: CookiePrefs;
}

export interface LoginPayload {
  clientId: string;
  email: string;
  password: string;
}

export interface UpdateUserProfilePayload {
  clientId: string;
  role: 'guest' | 'user' | 'worker' | 'admin';
  name?: string;
  address?: string;
  phone?: string;
  language?: string;
  theme?: 'light' | 'dark';
}

export interface ChangePasswordPayload {
  userId: string;
  clientId: string;
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordPayload {
  clientId: string;
  email: string;
  language?: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface VerifyEmailPayload {
  userId: string;
  clientId: string;
  email: string;
  language?: string;
}

export interface ResendVerificationEmailPayload {
  clientId: string;
  email: string;
  language?: string;
}

export interface ContactMessageData {
  userId: string;
  clientId: string;
  name: string;
  email: string;
  message: string;
  language: string;
  originPath: string;
}
