import api from '../api/api';
import { ApiResponse } from '@/packages/types/api';
import {
  AuthUser,
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
} from '@/packages/types/auth/authTypes';

// ---------------------------
// REFRESH
// ---------------------------

export const refreshToken = async (): Promise<void> => {
  await api.post('/api/auth/refresh-token', null, { withCredentials: true });
};

// ---------------------------
// REGISTER
// ---------------------------

export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const { data } = await api.post<RegisterResponse>('/api/auth/register', payload);
  return data;
};

// ---------------------------
// LOGIN
// ---------------------------

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/api/auth/login', payload, {
    withCredentials: true,
  });
  return data;
};

// ---------------------------
// AUTH ME (AuthUser)
// ---------------------------

export const getAuthUser = async (): Promise<AuthUser> => {
  const { data } = await api.get<ApiResponse<AuthUser>>('/api/auth/me', {
    withCredentials: true,
  });
  return data.user;
};

// ---------------------------
// PASSWORD / RESET
// ---------------------------

export const changePassword = async (
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> => {
  const { data } = await api.post<ChangePasswordResponse>('/api/auth/change-password', payload, {
    withCredentials: true,
  });
  return data;
};

export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> => {
  const { data } = await api.post<ForgotPasswordResponse>('/api/auth/forgot-password', payload);
  return data;
};

export const resetPassword = async (
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> => {
  const { data } = await api.post<ResetPasswordResponse>('/api/auth/reset-password', payload);
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
  const { data } = await api.post<MagicLoginResponse>('/api/auth/magic-login', payload, {
    withCredentials: true,
  });
  return data;
};
