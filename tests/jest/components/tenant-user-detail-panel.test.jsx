import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { TenantUserDetailPanel } from '@/apps/dashboard/app/[lang]/(app)/components/people/users';
import { usersPageCopy } from '@/apps/dashboard/app/[lang]/(app)/people/users/page.copy';
import { tenantUserDirectoryFixtures } from '../../fixtures/tenantUserDirectory';

const renderPanel = (props = {}) => {
  const onReturnToDirectory = jest.fn();
  const onRetry = jest.fn();
  const rendered = render(
    <TenantUserDetailPanel
      copy={usersPageCopy.panels.detail}
      locale="en"
      entryId="user:ada"
      detail={tenantUserDirectoryFixtures.userWithCompleteProfile}
      onReturnToDirectory={onReturnToDirectory}
      onRetry={onRetry}
      {...props}
    />
  );
  return { ...rendered, onReturnToDirectory, onRetry };
};

describe('TenantUserDetailPanel', () => {
  it('renders an explicit empty panel without a selection', () => {
    renderPanel({ entryId: undefined, detail: null });
    expect(screen.getByRole('heading', { name: 'Choose a customer' })).toBeInTheDocument();
  });

  it('renders confirmed identity and the available Profile fields', () => {
    renderPanel();
    expect(screen.getByRole('heading', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText(/A very long street name/)).toBeInTheDocument();
  });

  it('makes partial and absent Profiles explicit instead of inventing values', () => {
    const { rerender } = render(
      <TenantUserDetailPanel
        copy={usersPageCopy.panels.detail}
        locale="en"
        entryId="user:partial"
        detail={tenantUserDirectoryFixtures.userWithPartialProfile}
        onReturnToDirectory={jest.fn()}
      />
    );
    expect(screen.getByText('Some Profile information has not been provided yet.')).toBeInTheDocument();
    expect(screen.getByText('Not provided')).toBeInTheDocument();

    rerender(
      <TenantUserDetailPanel
        copy={usersPageCopy.panels.detail}
        locale="en"
        entryId="user:no-profile"
        detail={tenantUserDirectoryFixtures.userWithoutProfile}
        onReturnToDirectory={jest.fn()}
      />
    );
    expect(screen.getByText('This customer has not created a Profile yet.')).toBeInTheDocument();
  });

  it('labels invitation data as proposed and distinguishes pending from expired', () => {
    const { rerender } = renderPanel({
      entryId: 'invitation:pending',
      detail: tenantUserDirectoryFixtures.pendingInvitation,
    });
    expect(screen.getByText('Proposed contact')).toBeInTheDocument();
    expect(screen.getByText(/not a confirmed profile/)).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Profile' })).not.toBeInTheDocument();

    rerender(
      <TenantUserDetailPanel
        copy={usersPageCopy.panels.detail}
        locale="en"
        entryId="invitation:expired"
        detail={tenantUserDirectoryFixtures.expiredInvitation}
        onReturnToDirectory={jest.fn()}
      />
    );
    expect(screen.getByText('Expired')).toBeInTheDocument();
  });

  it('announces detail errors, retries, and preserves the accessible mobile return action', () => {
    const { onRetry, onReturnToDirectory } = renderPanel({ error: 'Detail request failed', detail: null });
    expect(screen.getByText('Detail request failed')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    const returned = renderPanel();
    const backButtons = screen.getAllByRole('button', { name: 'Back to directory' });
    fireEvent.click(backButtons[backButtons.length - 1]);
    expect(returned.onReturnToDirectory).toHaveBeenCalledTimes(1);
  });

  it('does not reintroduce deferred account, permissions, activity, request, note, or mutation sections', () => {
    renderPanel({ detail: tenantUserDirectoryFixtures.pendingInvitation });
    expect(screen.queryByText(/Account|Permissions|Activity|Requests|Notes/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /resend|revoke|invite/i })).not.toBeInTheDocument();
  });
});
