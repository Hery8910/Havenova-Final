import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

type TenantUserInvitationRouteContext = {
  params: {
    invitationId: string;
  };
};

export const dynamic = 'force-dynamic';

export const POST = (request: NextRequest, context: TenantUserInvitationRouteContext) =>
  proxyBackendRoute(request, {
    methods: ['POST'],
    upstreamPath: `/api/home-services/dashboard/users/invitations/${encodeURIComponent(
      context.params.invitationId
    )}/revoke`,
  });
