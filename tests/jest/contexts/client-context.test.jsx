import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { useClient } from '../../../packages/contexts/client/ClientContext';
import {
  defaultTestClient,
  renderWithAppProviders,
} from '../utils/test-providers';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

function ClientConsumer() {
  const { client } = useClient();
  return <div data-testid="client-id">{client._id}</div>;
}

describe('ClientProvider', () => {
  afterEach(() => {
    pushMock.mockReset();
    jest.restoreAllMocks();
    window.sessionStorage.clear();
  });

  it('renders children when an initial client is available', async () => {
    renderWithAppProviders(<ClientConsumer />, {
      withClient: true,
      clientOptions: { initialClient: defaultTestClient },
    });

    expect(await screen.findByTestId('client-id')).toHaveTextContent('client_123');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows a navigation CTA for CLIENT_NOT_FOUND bootstrap errors', async () => {
    renderWithAppProviders(<ClientConsumer />, {
      language: 'en',
      withClient: true,
      clientOptions: {
        initialError: { status: 404, code: 'CLIENT_NOT_FOUND' },
        tenantKey: 'tnk_demo_havenova',
      },
    });

    expect(await screen.findByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Workspace not found')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Go to home' }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/en');
    });
  });

  it('shows a retry CTA for recoverable bootstrap errors', async () => {
    renderWithAppProviders(<ClientConsumer />, {
      language: 'en',
      withClient: true,
      clientOptions: {
        initialError: { status: 500, code: 'GLOBAL_INTERNAL_ERROR' },
        tenantKey: 'tnk_demo_havenova',
      },
    });

    expect(await screen.findByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Unexpected error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Go to home' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Continue' })).not.toBeInTheDocument();
  });

  it('shows only a dismiss action for non-retryable validation errors', async () => {
    renderWithAppProviders(<ClientConsumer />, {
      language: 'en',
      withClient: true,
      clientOptions: {
        initialError: { status: 400, code: 'VALIDATION_ERROR' },
        tenantKey: 'tnk_demo_havenova',
      },
    });

    expect(await screen.findByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Check your details')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Go to home' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('blocks retry after the configured number of bootstrap reload attempts', async () => {
    window.sessionStorage.setItem('hv-client-bootstrap-retries:tnk_demo_havenova', '3');

    renderWithAppProviders(<ClientConsumer />, {
      language: 'en',
      withClient: true,
      clientOptions: {
        initialError: { status: 500, code: 'GLOBAL_INTERNAL_ERROR' },
        tenantKey: 'tnk_demo_havenova',
      },
    });

    expect(await screen.findByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText(/Too many attempts were detected/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
