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
  if (role === 'user') {
    console.log('Se disparo el user');

    // const backendUser = getUserClientProfile(clientId);
    // return backendUser;
  }

  if (role === 'worker') {
    console.log('Se disparo el worker');

    // const backendUser = getUserClientWorker(clientId);
    // return backendUser;
  }

  throw new Error('Unsupported role');
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

  return profileData;
}
