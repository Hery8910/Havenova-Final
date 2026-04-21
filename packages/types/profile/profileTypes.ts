export type AppLanguage = 'de' | 'en';
export type ThemeMode = 'light' | 'dark';

export interface UserAddress {
  street: string;
  streetNumber: string;
  postalCode: string;
  district: string;
  floor?: string;
}

export interface UserSavedAddress {
  label?: string;
  address: UserAddress;
}

export interface UserRequiredNotificationChannel {
  enabled: true;
  required: true;
}

export interface UserOptionalNotificationChannel {
  enabled: boolean;
}

export interface UserNotificationPreferences {
  inApp: UserRequiredNotificationChannel;
  email: {
    important: UserRequiredNotificationChannel;
    reminders: UserOptionalNotificationChannel;
    promotional: UserOptionalNotificationChannel;
  };
}

export interface UserNotificationPreferencesInput {
  email?: {
    reminders?: UserOptionalNotificationChannel;
    promotional?: UserOptionalNotificationChannel;
  };
}

export interface UserClientProfile {
  _id: string;
  userClientId: string;
  userId: string;
  clientId: string;
  contactEmail?: string;
  name?: string;
  phone?: string;
  primaryAddress?: UserAddress;
  savedAddresses: UserSavedAddress[];
  profileImage?: string;
  language: AppLanguage;
  theme: ThemeMode;
  notificationPreferences: UserNotificationPreferences;
  extra?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserClientProfileInput {
  name?: string;
  phone?: string;
  primaryAddress?: UserAddress;
  savedAddresses?: UserSavedAddress[];
  profileImage?: string;
  language: AppLanguage;
  theme: ThemeMode;
  notificationPreferences?: UserNotificationPreferencesInput;
  extra?: Record<string, unknown>;
}

export interface UpdateUserClientProfileInput {
  name?: string;
  phone?: string;
  primaryAddress?: UserAddress;
  savedAddresses?: UserSavedAddress[];
  profileImage?: string;
  language?: AppLanguage;
  theme?: ThemeMode;
  notificationPreferences?: UserNotificationPreferencesInput;
  extra?: Record<string, unknown>;
}

/**
 * Representa los valores del formulario de edición de perfil del usuario.
 * Este contrato está diseñado para ser utilizado por componentes de formulario
 * y desacopla la UI de la estructura de la API (`UpdateUserClientProfileInput`).
 */
export interface ProfileFormValues {
  name: string;
  phone: string;
  notificationPreferences: {
    email: {
      reminders: { enabled: boolean };
      promotional: { enabled: boolean };
    };
  };
}

export interface UserClientProfileMutationResponse {
  success: boolean;
  code: string;
  profile: UserClientProfile;
}

export interface DeleteUserClientProfileResponse {
  success: boolean;
  code: string;
  data: {
    userId: string;
    clientId: string;
  };
}

export function formatUserAddress(address?: UserAddress): string {
  if (!address) return '';

  return [
    `${address.street} ${address.streetNumber}`.trim(),
    address.postalCode,
    address.district,
    address.floor ? `Floor ${address.floor}` : '',
  ]
    .filter(Boolean)
    .join(', ');
}
