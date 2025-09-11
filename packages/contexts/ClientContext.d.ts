import { ReactNode } from 'react';
import { ClientConfig, ClientContextProps } from '../types/client';
export declare function ClientProvider({ children, initialClient, }: {
    children: ReactNode;
    initialClient: ClientConfig;
}): import("react/jsx-runtime").JSX.Element;
export declare function useClient(): ClientContextProps;
//# sourceMappingURL=ClientContext.d.ts.map