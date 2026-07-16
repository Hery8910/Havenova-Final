# Dashboard Set Password Flow

## Objective

Declare only the dashboard-specific layer of the shared invitation/reset `set-password` page.

Shared flow contract:

- [INVITATION_AUTH_SHARED_PAGE_FLOWS.md](/home/heriberto/Escritorio/Havenova/havenova/docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md:155)

Sources:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/set-password/page.tsx:1)
- [InvitationSetPasswordPage.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/invitationSetPassword/InvitationSetPasswordPage.tsx:1)

## Dashboard-Specific Contract

- this route supports both reset by `token` and invitation activation by `inviteToken`
- for dashboard onboarding, invitation activation is the primary contract
- when invite resolution returns masked email data, the page should reassure the invited dashboard user that the correct access setup is being completed
- successful completion always hands off to normal login; it does not create a dashboard session by itself

## UX Notes

- invitation mode should feel like controlled admin/staff onboarding, not generic consumer reset
- after success, the next normal step is standard dashboard login
