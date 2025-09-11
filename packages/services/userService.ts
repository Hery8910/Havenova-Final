import api from './api';
import { ApiResponse } from '../types/api';
import {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  ChangePasswordPayload,
  UpdateUserPayload,
  User,
  VerifyEmailPayload,
} from '../types/User';

// REGISTER
export const registerUser = async (payload: RegisterPayload): Promise<ApiResponse<User>> => {
  const response = await api.post<ApiResponse<User>>('/api/users/register', payload);
  return response.data;
};

// LOGIN
export const loginUser = async (payload: LoginPayload): Promise<ApiResponse<User>> => {
  const response = await api.post<ApiResponse<User>>('/api/users/login', payload);
  return response.data;
};

// UPDATE USER
export const updateUser = async (payload: UpdateUserPayload): Promise<ApiResponse<User>> => {
  const response = await api.post<ApiResponse<User>>('/api/users/update-user', payload);
  return response.data;
};

// UPDATE PASSWORD
export const chagePassword = async (payload: ChangePasswordPayload): Promise<ApiResponse<User>> => {
  const response = await api.post<ApiResponse<User>>('/api/users/update-password', payload);
  return response.data;
};

// FORGOT PASSWORD
export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<ApiResponse<User>> => {
  const response = await api.post<ApiResponse<User>>('/api/users/forgot-password', payload);
  return response.data;
};

// RESET PASSWORD
export const resetPassword = async (payload: ResetPasswordPayload): Promise<ApiResponse<User>> => {
  const response = await api.post<ApiResponse<User>>('/api/users/reset-password', payload);
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

// GET USER PROFILE
export const getUser = async (clientId: string): Promise<ApiResponse<User>> => {
  let url = `/api/users/profile?clientId=${clientId}`;
  const response = await api.get<ApiResponse<User>>(url);
  return response.data;
};

// RESEND VERIFICATION
export const resendVerificationEmail = async (
  payload: VerifyEmailPayload
): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>('/api/users/resend-verification', { payload });
  return response.data;
};
