# Dashboard Forgot Password Flow

## Objective

Declare only the dashboard-specific layer of the shared invitation-only `forgot-password` page.

Shared flow contract:

- [INVITATION_AUTH_SHARED_PAGE_FLOWS.md](/home/heriberto/Escritorio/Havenova/havenova/docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md:92)

Sources:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/forgot-password/page.tsx:1)
- [InvitationForgotPasswordPage.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/invitationForgotPassword/InvitationForgotPasswordPage.tsx:1)

## Dashboard-Specific Contract

- this page is for already activated dashboard users who need to recover access
- it is not part of invitation onboarding
- the success path stays intentionally ambiguous and returns the user to normal login, never to registration or verification

## UX Notes

- the route should feel like controlled access recovery for invited staff/admin users
- the next safe step after success remains standard dashboard login
