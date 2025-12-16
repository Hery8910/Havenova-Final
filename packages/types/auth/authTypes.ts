import { CookiePrefs } from '../cookies';

// ---------------------------
// AUTH USER (frontend session)
// ---------------------------

export type AuthRole = 'guest' | 'user' | 'worker' | 'admin';
export type AuthStatus = 'active' | 'invited' | 'blocked';

export interface AuthUser {
  userId: string;
  clientId: string;
  email: string;

  role: AuthRole;
  status?: AuthStatus;

  isVerified: boolean;
  isLogged: boolean;

  // para el flujo de perfil automático
  isNewUser?: boolean;

  // legales
  tosAccepted?: boolean;
  cookiePrefs?: CookiePrefs;
}

// ---------------------------
// REGISTER
// ---------------------------

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  language: string;
  clientId: string;
  tosAccepted: boolean;
}

export interface RegisterPayload extends RegisterFormData {
  frontendUrl: string;
  cookiePrefs?: CookiePrefs;
}

export interface RegisterResponse {
  success: boolean;
  code: string; // 'USER_REGISTER_SUCCESS'
  message?: string;
}

// ---------------------------
// LOGIN
// ---------------------------

export interface LoginPayload {
  clientId: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: AuthUser;
  code?: string;
}

// ---------------------------
// MAGIC LOGIN
// ---------------------------

export interface MagicLoginPayload {
  token: string;
}

export interface MagicLoginResponse {
  success: boolean;
  user: AuthUser;
  code?: string;
}

// ---------------------------
// PASSWORD CHANGE / RESET
// ---------------------------

export interface ChangePasswordPayload {
  userId: string;
  clientId: string;
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  code: string;
  message?: string;
}

export interface ForgotPasswordPayload {
  clientId: string;
  email: string;
  language?: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  code: string;
  message?: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  code: string;
  message?: string;
}

// ---------------------------
// VERIFY EMAIL
// ---------------------------

export interface VerifyEmailPayload {
  token: string;
}

export interface VerifyEmailResponse {
  status: 'success' | 'expired' | 'invalid';
  code: string;
  magicToken?: string;
  language?: string;
}

export type VerifyEmailResult = { ok: true; language: string; magicToken: string } | { ok: false };

// ---------------------------
// RESEND VERIFICATION EMAIL
// ---------------------------

export interface ResendVerificationEmailPayload {
  clientId: string;
  email: string;
  language: string;
}

export interface ResendVerificationEmailResponse {
  success: boolean;
  code: string;
  message?: string;
}
