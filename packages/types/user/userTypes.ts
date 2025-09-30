import { ServiceRequest } from '../services';

// src/types/User.ts
export interface User {
  clientId: string;
  _id: string;
  name: string;
  email: string;
  password: string;
  address: string;
  profileImage: string;
  phone: string;
  isVerified: boolean;
  role: string;
  isLogged: boolean;
  language: string;
  theme: 'light' | 'dark';
  requests: ServiceRequest[];
  createdAt: Date;
}
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  address: string;
  profileImage: string;
  phone: string;
  clientId: string;
}
export interface LoginPayload {
  email: string;
  password: string;
  clientId: string;
}
export interface VerifyEmailPayload {
  email: string;
  language: string;
  clientId: string;
}
export interface AvatarSelectorPayload {
  email: string;
  profileImage: string;
  clientId: string;
}
export interface UpdateUserPayload {
  name?: string;
  email: string;
  address?: string;
  phone?: string;
  profileImage?: string;
  theme?: 'light' | 'dark';
  language?: string;
  clientId: string;
}
export interface ChangePasswordPayload {
  email: string;
  password: string;
  newPassword: string;
  clientId: string;
}
export interface ForgotPasswordPayload {
  email: string;
  clientId: string;
  language?: string;
}
export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  clientId: string;
}
export interface GetUserPayload {
  clientId: string;
}
export interface FaqMessageData {
  name: string;
  email: string;
  message: string;
  language: string;
  clientId: string;
}
