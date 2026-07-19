import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import PeopleUsersPageController from '@/apps/dashboard/app/[lang]/(app)/people/users/page.controller';
import { I18nProvider } from '@/packages/contexts/i18n/I18nContext';
import {
  getTenantUserDirectoryDetail,
  getTenantUsersDirectoryPage,
  getTenantUsersDirectorySummary,
} from '@/packages/services';
import { tenantUserDirectoryFixtures } from '../../fixtures/tenantUserDirectory';

let queryString = '';
const replace = jest.fn((href) => {
  queryString = href.split('?')[1] ?? '';
});

jest.mock('next/navigation', () => ({
  usePathname: () => '/en/people/users',
  useRouter: () => ({ replace }),
  useSearchParams: () => new URLSearchParams(queryString),
}));

jest.mock('@/packages/hooks', () => ({ useLang: () => 'en' }));
jest.mock('@/packages/services', () => ({
  getTenantUserDirectoryDetail: jest.fn(),
  getTenantUsersDirectoryPage: jest.fn(),
  getTenantUsersDirectorySummary: jest.fn(),
}));

const mockedDirectory = jest.mocked(getTenantUsersDirectoryPage);
const mockedSummary = jest.mocked(getTenantUsersDirectorySummary);
const mockedDetail = jest.mocked(getTenantUserDirectoryDetail);

const emptyPage = { items: [], hasNextPage: false, nextCursor: null };
const summary = { totalUsers: 2, pendingInvites: 1, needsAttention: 0 };

const entry = (entryId, displayName) => ({
  entryId,
  kind: 'user',
  userClientId: entryId,
  invitationId: null,
  displayName,
  email: `${entryId}@example.com`,
  phone: null,
  accountStatus: null,
  verificationStatus: null,
  invitationStatus: null,
  invitationExpiresAt: null,
  attentionReasons: [],
  relationshipSummary: {
    requests: { active: 0, total: 0 },
    workOrders: null,
    nextAppointmentAt: null,
    lastCompletedServiceAt: null,
  },
  businessActivityAt: '2026-01-01T00:00:00.000Z',
});

function renderController() {
  return render(
    <I18nProvider initialLanguage="en">
      <PeopleUsersPageController
        initialMode="empty"
        initialSearchState={{ search: '', status: 'all' }}
      />
    </I18nProvider>
  );
}

async function settleInitialDirectory() {
  await waitFor(() => expect(mockedDirectory).toHaveBeenCalled());
  await waitFor(() => expect(mockedSummary).toHaveBeenCalled());
  mockedDirectory.mockClear();
  replace.mockClear();
}

describe('PeopleUsersPageController query ownership', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    queryString = '';
    replace.mockClear();
    mockedDirectory.mockReset();
    mockedSummary.mockReset();
    mockedDetail.mockReset();
    mockedDirectory.mockResolvedValue(emptyPage);
    mockedSummary.mockResolvedValue(summary);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('keeps one character visible without issuing a remote search', async () => {
    renderController();
    await settleInitialDirectory();

    const search = screen.getByLabelText('Search customers');
    fireEvent.change(search, { target: { value: 'a' } });

    expect(search).toHaveValue('a');
    await act(async () => jest.advanceTimersByTime(300));

    expect(mockedDirectory).not.toHaveBeenCalled();
    expect(screen.getByText('Enter at least two characters to search.')).toBeInTheDocument();
  });

  it('issues one stabilized query for two characters without rolling back to the empty query', async () => {
    renderController();
    await settleInitialDirectory();

    const search = screen.getByLabelText('Search customers');
    fireEvent.change(search, { target: { value: 'ab' } });
    expect(search).toHaveValue('ab');

    await act(async () => jest.advanceTimersByTime(300));
    await waitFor(() =>
      expect(mockedDirectory).toHaveBeenCalledWith(
        expect.objectContaining({ q: 'ab', status: 'all' })
      )
    );

    expect(mockedDirectory.mock.calls).toHaveLength(1);
    expect(replace).toHaveBeenLastCalledWith('/en/people/users?search=ab', { scroll: false });
  });

  it('keeps All and Invitations stable through both the select and summary', async () => {
    renderController();
    await settleInitialDirectory();

    const select = screen.getByLabelText('Status');
    fireEvent.change(select, { target: { value: 'invitations' } });

    expect(select).toHaveValue('invitations');
    await waitFor(() =>
      expect(mockedDirectory).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'invitations' })
      )
    );
    expect(mockedDirectory.mock.calls).toHaveLength(1);
    expect(replace).toHaveBeenLastCalledWith('/en/people/users?status=invitations', {
      scroll: false,
    });

    mockedDirectory.mockClear();
    fireEvent.change(select, { target: { value: 'all' } });

    expect(select).toHaveValue('all');
    await waitFor(() =>
      expect(mockedDirectory).toHaveBeenCalledWith(expect.objectContaining({ status: 'all' }))
    );
    expect(mockedDirectory.mock.calls).toHaveLength(1);
    expect(replace).toHaveBeenLastCalledWith('/en/people/users', { scroll: false });

    mockedDirectory.mockClear();
    fireEvent.click(screen.getByRole('button', { name: /Pending invites/i }));

    expect(select).toHaveValue('invitations');
    await waitFor(() =>
      expect(mockedDirectory).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'invitations' })
      )
    );
    expect(mockedDirectory.mock.calls).toHaveLength(1);
  });

  it('ignores a late response from a superseded search', async () => {
    renderController();
    await settleInitialDirectory();

    let resolveOld;
    let resolveCurrent;
    mockedDirectory
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveOld = resolve;
          })
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveCurrent = resolve;
          })
      );

    const search = screen.getByLabelText('Search customers');
    fireEvent.change(search, { target: { value: 'ab' } });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.change(search, { target: { value: 'ac' } });
    await act(async () => jest.advanceTimersByTime(300));

    await waitFor(() => expect(mockedDirectory).toHaveBeenCalledTimes(2));
    await act(async () =>
      resolveCurrent({ ...emptyPage, items: [entry('current', 'Current result')] })
    );
    await waitFor(() => expect(screen.getByText('Current result')).toBeInTheDocument());

    await act(async () => resolveOld({ ...emptyPage, items: [entry('old', 'Old result')] }));
    expect(screen.getByText('Current result')).toBeInTheDocument();
    expect(screen.queryByText('Old result')).not.toBeInTheDocument();
  });

  it('does not render a stale detail response after the selected entry changes', async () => {
    queryString = 'mode=detail&selected=user:old';
    let resolveOld;
    let resolveCurrent;
    mockedDetail
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveOld = resolve;
          })
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveCurrent = resolve;
          })
      );

    const view = renderController();
    await waitFor(() => expect(mockedDetail).toHaveBeenCalledWith('user:old', expect.anything()));

    queryString = 'mode=detail&selected=user:current';
    view.rerender(
      <I18nProvider initialLanguage="en">
        <PeopleUsersPageController
          initialMode="empty"
          initialSearchState={{ search: '', status: 'all' }}
        />
      </I18nProvider>
    );
    await waitFor(() => expect(mockedDetail).toHaveBeenCalledWith('user:current', expect.anything()));

    await act(async () => resolveCurrent(tenantUserDirectoryFixtures.userWithCompleteProfile));
    await waitFor(() => expect(screen.getByText('Ada Lovelace')).toBeInTheDocument());

    await act(async () =>
      resolveOld({ ...tenantUserDirectoryFixtures.userWithoutProfile, identity: { displayName: 'Old detail', email: 'old@example.com', phone: null, profileImage: null } })
    );
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.queryByText('Old detail')).not.toBeInTheDocument();
  });
});
