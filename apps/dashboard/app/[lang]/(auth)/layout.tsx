import { ReactNode } from 'react';
import { AuthRouteLayout } from '../../../../../packages/components/client/user/auth';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthRouteLayout>{children}</AuthRouteLayout>;
}
