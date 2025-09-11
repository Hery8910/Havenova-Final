// utils/guestUserStorage.ts

import { User } from '../types/User';

const USER_KEY = 'havenova_user';

export function saveUserToStorage(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUserFromStorage(): User | null {
  const data = localStorage.getItem(USER_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
}

export function clearUserFromStorage() {
  localStorage.removeItem(USER_KEY);
}
