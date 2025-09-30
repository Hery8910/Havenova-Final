'use client';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ServiceRequest, ServiceRequestItem } from '../../types/services/servicesTypes';
import { useClient } from '../client/ClientContext';
import { getUser, updateUser } from '../../services/userService';
import { User } from '@havenova/types';

// --- Local Storage keys ---
const USER_KEY = 'havenova_user';
const GUEST_AVATAR_KEY = 'guest_avatar';

// --- Utils ---
function getPersistentGuestAvatar(): string {
  if (typeof window === 'undefined') return '/svg/user.svg';
  const saved = localStorage.getItem(GUEST_AVATAR_KEY);
  if (saved) return saved;
  localStorage.setItem(GUEST_AVATAR_KEY, '/svg/user.svg');
  return '/svg/user.svg';
}

function saveUserToStorage(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getUserFromStorage(): User | null {
  const data = typeof window !== 'undefined' ? localStorage.getItem(USER_KEY) : null;
  if (!data) return null;
  try {
    const parsed = JSON.parse(data) as User;
    if (parsed?.createdAt) parsed.createdAt = new Date(parsed.createdAt);
    // Asegura defaults en migraciones antiguas
    if (typeof parsed.isLogged !== 'boolean') parsed.isLogged = parsed.role !== 'guest';
    if (!Array.isArray(parsed.requests)) parsed.requests = [];
    return parsed;
  } catch {
    return null;
  }
}

function clearUserFromStorage() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
  // No borres el avatar persistente si no quieres perder el ícono del invitado
}

// 🔎 Ayuda a unir requests locales con las del backend sin duplicar ids
function mergeRequests(local: ServiceRequest[], remote: ServiceRequest[]) {
  const map = new Map<string, ServiceRequest>();
  [...remote, ...local].forEach((r) => {
    map.set(r.id, r);
  });
  return Array.from(map.values());
}

// --- Context types ---
interface UserContextProps {
  user: User | null;
  loading: boolean;
  setUser: (user: User) => void;
  refreshUser: (onSessionExpired?: () => void) => Promise<void>;
  logout: () => void;
  // addRequestToUser: (newRequest: ServiceRequestItem) => void;
  // removeRequestFromUser: (id: string) => void;
  // clearAllRequests: () => void;
  updateUserLanguage: (lang: string) => Promise<void>;
  updateUserTheme: (theme: 'light' | 'dark') => Promise<void>;
  registerSessionCallback: (cb: () => void) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

// 👇 IMPORTA tu initialGuestUser real. Lo dejo inline para claridad:
const initialGuestUser: User = {
  _id: '',
  clientId: '',
  name: '',
  email: '',
  password: '',
  address: '',
  profileImage: '',
  phone: '',
  isVerified: false,
  role: 'guest',
  language: 'de',
  theme: 'light',
  requests: [],
  createdAt: new Date(),
  isLogged: false,
};

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const { client } = useClient();
  const clientId = client?._id || '';
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionCallbackRef = React.useRef<(() => void) | null>(null);

  // Carga inicial
  useEffect(() => {
    if (!clientId) return;
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  // Persistencia automática
  useEffect(() => {
    if (user) saveUserToStorage(user);
  }, [user]);

  // --- REFRESH USER ---
  const refreshUser = useCallback(
    async (onSessionExpired?: () => void) => {
      setLoading(true);
      const localUser = getUserFromStorage();

      try {
        const response = await getUser(clientId);
        if (response.data) {
          const remoteUser: User = response.data;

          // Merge requests: conserva las locales si no existen en backend aún
          const localRequests = localUser?.requests ?? [];
          const mergedRequests = mergeRequests(localRequests, remoteUser?.requests ?? []);

          const finalUser: User = {
            ...remoteUser,
            requests: mergedRequests,
            isLogged: true, // 👈 autenticado
            clientId: remoteUser.clientId || clientId,
            profileImage: remoteUser.profileImage || getPersistentGuestAvatar(),
          };

          setUser(finalUser);
          saveUserToStorage(finalUser);
        }
      } catch (error: any) {
        // Sin sesión válida → invitado
        const guestBase = {
          ...initialGuestUser,
          clientId,
          profileImage: getPersistentGuestAvatar(),
        };

        // Pero intenta mantener un invitado previamente guardado (para no perder solicitudes del carrito)
        const fallback = localUser
          ? { ...guestBase, ...localUser, isLogged: false, role: 'guest' as const }
          : guestBase;

        setUser(fallback);
        saveUserToStorage(fallback);

        // Si *antes* estaba logeado y ahora 401/403, notifica expiración
        const wasLoggedIn = !!localUser && localUser.isLogged && localUser.role !== 'guest';
        if (wasLoggedIn && (error?.response?.status === 401 || error?.response?.status === 403)) {
          if (onSessionExpired) {
            onSessionExpired();
          } else {
            sessionCallbackRef.current?.();
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [clientId]
  );

  const registerSessionCallback = useCallback((cb: () => void) => {
    sessionCallbackRef.current = cb;
  }, []);

  const updateUserLanguage = useCallback(
    async (newLang: string) => {
      if (!user || user.role === 'guest' || !user.isLogged) {
        const next = { ...(user ?? initialGuestUser), language: newLang, clientId };
        setUser(next);
        saveUserToStorage(next);
        return;
      }

      try {
        const response = await updateUser({
          clientId,
          email: user.email, // 👈 agrega el email
          language: newLang,
        });
        const updated = response.data as User;
        const next = { ...updated, isLogged: true };
        setUser(next);
        saveUserToStorage(next);
      } catch (err) {
        console.error('Failed to update user language:', err);
      }
    },
    [user, clientId]
  );

  const updateUserTheme = useCallback(
    async (newTheme: 'light' | 'dark') => {
      if (!user || user.role === 'guest' || !user.isLogged) {
        const next = { ...(user ?? initialGuestUser), theme: newTheme, clientId };
        setUser(next);
        saveUserToStorage(next);
        return;
      }

      try {
        const response = await updateUser({
          clientId,
          email: user.email,
          theme: newTheme,
        });
        const updated = response.data as User;
        const next = { ...updated, isLogged: true };
        setUser(next);
        saveUserToStorage(next);
      } catch (err) {
        console.error('Failed to update user theme:', err);
      }
    },
    [user, clientId]
  );

  const logout = useCallback(() => {
    // Ideal: llamar a /api/users/logout para borrar cookie httpOnly en server
    clearUserFromStorage();
    const guest = {
      ...initialGuestUser,
      clientId,
      profileImage: getPersistentGuestAvatar(),
    };
    setUser(guest);
    saveUserToStorage(guest);
  }, [clientId]);

  // const addRequestToUser = useCallback(
  //   (newRequest: ServiceRequestItem) => {
  //     const requestWithId = { ...newRequest, id: newRequest.id || uuidv4() };
  //     setUser((prev) => {
  //       const base = prev ?? {
  //         ...initialGuestUser,
  //         clientId,
  //         profileImage: getPersistentGuestAvatar(),
  //       };
  //       const updated: User = { ...base, requests: [...(base.requests ?? []), requestWithId] };
  //       saveUserToStorage(updated);
  //       return updated;
  //     });
  //   },
  //   [clientId]
  // );

  // const removeRequestFromUser = useCallback(
  //   (id: string) => {
  //     setUser((prev) => {
  //       const base = prev ?? {
  //         ...initialGuestUser,
  //         clientId,
  //         profileImage: getPersistentGuestAvatar(),
  //       };
  //       const updated: User = {
  //         ...base,
  //         requests: (base.requests ?? []).filter((r) => r.id !== id),
  //       };
  //       saveUserToStorage(updated);
  //       return updated;
  //     });
  //   },
  //   [clientId]
  // );

  // const clearAllRequests = useCallback(() => {
  //   setUser((prev) => {
  //     const base = prev ?? {
  //       ...initialGuestUser,
  //       clientId,
  //       profileImage: getPersistentGuestAvatar(),
  //     };
  //     const updated: User = { ...base, requests: [] };
  //     saveUserToStorage(updated);
  //     return updated;
  //   });
  // }, [clientId]);

  if (loading) return null;

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        setUser,
        refreshUser,
        logout,
        // addRequestToUser,
        // removeRequestFromUser,
        // clearAllRequests,
        updateUserLanguage,
        updateUserTheme,
        registerSessionCallback,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a DashboardProvider');
  return ctx;
};
