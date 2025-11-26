// src/services/user/userService.ts

import api from '../api/api';
import { ApiResponse } from '../../types/api/apiTypes';
import {
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ChangePasswordPayload,
  UpdateUserProfilePayload,
  FrontendUser,
  VerifyEmailPayload,
  ContactMessageData,
  BaseAuthUser,
  ResendVerificationEmailPayload,
} from '../../types/user/userTypes';

// REGISTER
export const registerUser = async (payload: RegisterPayload): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>('/api/users/register', payload);
  return response.data;
};

// LOGIN
export const loginUser = async (payload: LoginPayload): Promise<ApiResponse<FrontendUser>> => {
  const response = await api.post<ApiResponse<FrontendUser>>('/api/users/login', payload, {
    withCredentials: true,
  });
  return response.data;
};

// GET USER-CLIENT (User + AuthUser fusionado para el cliente actual)
export const getUserClient = async (clientId: string): Promise<ApiResponse<BaseAuthUser>> => {
  const response = await api.get<ApiResponse<BaseAuthUser>>(
    `/api/users/profile?clientId=${clientId}`,
    { withCredentials: true }
  );
  return response.data;
};

// GET USER-CLIENT-PROFILE (User + AuthUser fusionado para el cliente actual)
export const getUserClientProfile = async (
  clientId: string
): Promise<ApiResponse<FrontendUser>> => {
  const response = await api.get<ApiResponse<FrontendUser>>(
    `/api/users/profile?clientId=${clientId}`,
    { withCredentials: true }
  );
  return response.data;
};

// GET USER-CLIENT-WORKER (User + AuthUser fusionado para el cliente actual)
export const getUserClientWorker = async (clientId: string): Promise<ApiResponse<FrontendUser>> => {
  const response = await api.get<ApiResponse<FrontendUser>>(
    `/api/users/profile?clientId=${clientId}`,
    { withCredentials: true }
  );
  return response.data;
};

// UPDATE USER-CLIENT-PROFILE (nombre, dirección, teléfono, idioma, tema, etc.)
export const updateUserClientProfile = async (
  payload: UpdateUserProfilePayload
): Promise<ApiResponse<FrontendUser>> => {
  const response = await api.patch<ApiResponse<FrontendUser>>('/api/users/profile', payload, {
    withCredentials: true,
  });
  return response.data;
};

// UPDATE USER-CLIENT-WORKER (nombre, dirección, teléfono, idioma, tema, etc.)
export const updateUserClientWorker = async (
  payload: UpdateUserProfilePayload
): Promise<ApiResponse<FrontendUser>> => {
  const response = await api.patch<ApiResponse<FrontendUser>>('/api/users/profile', payload, {
    withCredentials: true,
  });
  return response.data;
};

// CHANGE PASSWORD
export const changePassword = async (
  payload: ChangePasswordPayload
): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>('/api/users/change-password', payload, {
    withCredentials: true,
  });
  return response.data;
};

// FORGOT PASSWORD
export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>('/api/users/forgot-password', payload);
  return response.data;
};

// RESET PASSWORD (a partir del token enviado por email)
export const resetPassword = async (payload: ResetPasswordPayload): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>('/api/users/reset-password', payload);
  return response.data;
};

// LOGOUT
export const logoutUser = async (): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>(
    '/api/users/logout',
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// RESEND VERIFICATION
export const resendVerificationEmail = async (
  payload: ResendVerificationEmailPayload
): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>('/api/users/resend-verification', payload);
  return response.data;
};

// CONTACT MESSAGE
export const sendContactMessage = async (
  payload: ContactMessageData
): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>('/api/contact', payload);
  return response.data;
};
