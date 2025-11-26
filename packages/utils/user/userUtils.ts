// utils/guestUserStorage.ts
import {
  getUserClientProfile,
  getUserClientWorker,
  updateUserClientProfile,
  updateUserClientWorker,
} from '../../services';
import { BaseAuthUser, FrontendUser, UpdateUserProfilePayload } from '../../types';

const USER_KEY = 'havenova_user';

export function saveUserToStorage(user: FrontendUser | null) {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(USER_KEY);
    return;
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUserFromStorage(): FrontendUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as FrontendUser;
    return parsed;
  } catch {
    return null;
  }
}

export async function loadProfileByRoles(role: BaseAuthUser['role'], clientId: string) {
  let profileData: any = {};

  if (role === 'user') {
    const res = await getUserClientProfile(clientId);
    profileData = { userProfile: res.data };
  }

  if (role === 'worker') {
    const res = await getUserClientWorker(clientId);
    profileData = { ...profileData, workerProfile: res.data };
  }

  // Si en algún momento quieres que admin tenga perfil especial:
  // if (role === 'admin') { ... }

  return profileData;
}

export async function updateProfileByRoles(payload: UpdateUserProfilePayload) {
  let profileData: any = {};

  if (payload.role === 'user') {
    const res = await updateUserClientProfile(payload);
    profileData = { userProfile: res.data };
  }

  if (payload.role === 'worker') {
    const res = await updateUserClientWorker(payload);
    profileData = { ...profileData, workerProfile: res.data };
  }

  // admin -> decidir si reutiliza worker o tiene endpoint propio

  return profileData;
}
