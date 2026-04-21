import api from '../api/api';
import { ApiResponse } from '@/packages/types/api';
import {
  AuthUser,
  AuthSessionApiUser,
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
  MagicLoginPayload,
  MagicLoginResponse,
  VerifyEmailPayload,
  VerifyEmailResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
  ResendVerificationEmailPayload,
  ResendVerificationEmailResponse,
  ChangeEmailPayload,
  ChangeEmailResponse,
  ChangeEmailConfirmPayload,
  ChangeEmailConfirmResponse,
} from '@/packages/types/auth/authTypes';

type AuthEnvelope<TUser> = {
  success: boolean;
  code?: string;
  message?: string;
  user?: TUser;
};

const normalizeAuthUser = (user: AuthSessionApiUser): AuthUser => ({
  authId: user.authId,
  userClientId: user.userClientId,
  clientId: user.clientId,
  email: user.email,
  role: user.role,
  status: user.status,
  isVerified: user.isVerified,
  isNewUser: user.isNewUser,
  isLogged: true,
  // compatibilidad transitoria para el resto del frontend
  userId: user.userClientId,
});

const requireAuthUser = (
  user: AuthSessionApiUser | undefined,
  fallbackMessage: string
): AuthSessionApiUser => {
  if (!user) {
    throw new Error(fallbackMessage);
  }

  return user;
};

// ---------------------------
// REFRESH
// ---------------------------

export const refreshToken = async (): Promise<void> => {
  await api.post('/api/auth/refresh-token', {}, { withCredentials: true });
};

// ---------------------------
// REGISTER
// ---------------------------

export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const { data } = await api.post<RegisterResponse>('/api/auth/register', payload, {
    withCredentials: true,
  });
  return data;
};

// ---------------------------
// LOGIN
// ---------------------------

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api.post<AuthEnvelope<AuthSessionApiUser>>('/api/auth/login', payload, {
    withCredentials: true,
  });

  return {
    success: data.success,
    code: data.code,
    user: data.user ? normalizeAuthUser(data.user) : undefined,
  };
};

// ---------------------------
// AUTH ME (AuthUser)
// ---------------------------

export const getAuthUser = async (): Promise<AuthUser> => {
  const { data } = await api.get<AuthEnvelope<AuthSessionApiUser>>('/api/auth/me', {
    withCredentials: true,
  });
  return normalizeAuthUser(requireAuthUser(data.user, 'Auth session payload is missing user data.'));
};

// ---------------------------
// PASSWORD / RESET
// ---------------------------

export const changePassword = async (
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> => {
  const { data } = await api.post<ChangePasswordResponse>('/api/auth/update-password', payload, {
    withCredentials: true,
  });
  return data;
};

export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> => {
  const { data } = await api.post<ForgotPasswordResponse>('/api/auth/forgot-password', payload, {
    withCredentials: true,
  });
  return data;
};

export const resetPassword = async (
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> => {
  const { data } = await api.post<ResetPasswordResponse>(
    '/api/auth/reset-password-confirm',
    payload
  );
  return data;
};

// ---------------------------
// LOGOUT
// ---------------------------

export const logoutUser = async (): Promise<ApiResponse<null>> => {
  const { data } = await api.post<ApiResponse<null>>(
    '/api/auth/logout',
    {},
    { withCredentials: true }
  );
  return data;
};

export const logoutAllSessions = async (): Promise<ApiResponse<null>> => {
  const { data } = await api.post<ApiResponse<null>>(
    '/api/auth/logout-all-sessions',
    {},
    { withCredentials: true }
  );
  return data;
};

// ---------------------------
// EMAIL VERIFICATION
// ---------------------------

export const verifyEmailRequest = async (
  payload: VerifyEmailPayload
): Promise<VerifyEmailResponse> => {
  const { data } = await api.post<VerifyEmailResponse>('/api/auth/verify-email', payload);
  return data;
};

export const resendVerificationEmail = async (
  payload: ResendVerificationEmailPayload
): Promise<ResendVerificationEmailResponse> => {
  const { data } = await api.post<ResendVerificationEmailResponse>(
    '/api/auth/resend-verification',
    payload,
    {
      withCredentials: true,
    }
  );
  return data;
};

export const changeEmail = async (payload: ChangeEmailPayload): Promise<ChangeEmailResponse> => {
  const { data } = await api.post<ChangeEmailResponse>('/api/auth/change-email', payload, {
    withCredentials: true,
  });
  return data;
};

export const confirmChangeEmail = async (
  payload: ChangeEmailConfirmPayload
): Promise<ChangeEmailConfirmResponse> => {
  const { data } = await api.post<ChangeEmailConfirmResponse>(
    '/api/auth/change-email/confirm',
    payload
  );
  return data;
};

// ---------------------------
// MAGIC LOGIN
// ---------------------------

export const magicLoginRequest = async (
  payload: MagicLoginPayload
): Promise<MagicLoginResponse> => {
  const { data } = await api.post<AuthEnvelope<AuthSessionApiUser>>('/api/auth/magic-login', payload, {
    withCredentials: true,
  });

  return {
    success: data.success,
    code: data.code,
    user: data.user ? normalizeAuthUser(data.user) : undefined,
  };
};
