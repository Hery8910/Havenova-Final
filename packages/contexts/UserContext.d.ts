import { ReactNode } from 'react';
import { User } from '../types/User';
interface UserContextProps {
    user: User | null;
    loading: boolean;
    setUser: (user: User) => void;
    refreshUser: (onSessionExpired?: () => void) => Promise<void>;
    logout: () => void;
    updateUserLanguage: (lang: string) => Promise<void>;
    updateUserTheme: (theme: 'light' | 'dark') => Promise<void>;
    registerSessionCallback: (cb: () => void) => void;
}
interface DashboardProviderProps {
    children: ReactNode;
}
export declare const DashboardProvider: ({ children }: DashboardProviderProps) => import("react/jsx-runtime").JSX.Element | null;
export declare const useUser: () => UserContextProps;
export {};
//# sourceMappingURL=UserContext.d.ts.map