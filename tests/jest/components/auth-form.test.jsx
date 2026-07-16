import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import { AuthProvider } from '../../../packages/contexts/auth/authContext';
import { FormWrapper } from '../../../packages/components/client/user/auth';
import { renderWithAppProviders, defaultTestClient } from '../utils/test-providers';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => '/en/user/login',
}));

jest.mock('@havenova/services', () => ({
  getAuthUser: jest.fn(),
  logoutUser: jest.fn(),
  refreshToken: jest.fn(),
}));

describe('Auth form', () => {
  beforeEach(() => {
    localStorage.clear();
    pushMock.mockReset();
  });

  it('renders only auth fields without requiring ProfileContext', async () => {
    renderWithAppProviders(
      <AuthProvider>
        <FormWrapper
          fields={['email', 'password', 'clientId']}
          onSubmit={jest.fn()}
          button="Login"
          showForgotPassword
          initialValues={{
            email: '',
            password: '',
            clientId: '',
          }}
          loading={false}
        />
      </AuthProvider>,
      {
        language: 'en',
        withClient: true,
        clientOptions: { initialClient: defaultTestClient },
      }
    );

    expect(await screen.findByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/phone/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/address/i)).not.toBeInTheDocument();
  });

  it('uses current-password autocomplete for login and navigates on forgot password', async () => {
    const onForgotPassword = jest.fn();

    renderWithAppProviders(
      <AuthProvider>
        <FormWrapper
          fields={['email', 'password', 'clientId']}
          onSubmit={jest.fn()}
          button="Login"
          showForgotPassword
          onForgotPassword={onForgotPassword}
          initialValues={{
            email: '',
            password: '',
            clientId: '',
          }}
          loading={false}
        />
      </AuthProvider>,
      {
        language: 'en',
        withClient: true,
        clientOptions: { initialClient: defaultTestClient },
      }
    );

    const passwordInput = await screen.findByLabelText(/^password$/i);
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /forgot/i }));
    expect(onForgotPassword).toHaveBeenCalledTimes(1);
  });

  it('uses new-password autocomplete and localized legal links for register flows', async () => {
    renderWithAppProviders(
      <AuthProvider>
        <FormWrapper
          fields={['email', 'password', 'language', 'clientId', 'tosAccepted']}
          onSubmit={jest.fn()}
          button="Register"
          showHintPassword
          initialValues={{
            email: '',
            password: '',
            language: '',
            clientId: '',
            tosAccepted: false,
          }}
          loading={false}
        />
      </AuthProvider>,
      {
        language: 'en',
        withClient: true,
        clientOptions: { initialClient: defaultTestClient },
      }
    );

    const passwordInput = await screen.findByLabelText(/^password$/i);
    expect(passwordInput).toHaveAttribute('autocomplete', 'new-password');

    expect(screen.getByRole('link', { name: /terms/i })).toHaveAttribute(
      'href',
      '/en/legal/terms-of-service'
    );
    expect(screen.getByRole('link', { name: /privacy/i })).toHaveAttribute(
      'href',
      '/en/legal/privacy-policy'
    );
  });

  it('moves focus to the first invalid field and exposes an error summary on submit', async () => {
    renderWithAppProviders(
      <AuthProvider>
        <FormWrapper
          fields={['email', 'password', 'clientId']}
          onSubmit={jest.fn()}
          button="Login"
          initialValues={{
            email: '',
            password: '',
            clientId: '',
          }}
          loading={false}
        />
      </AuthProvider>,
      {
        language: 'en',
        withClient: true,
        clientOptions: { initialClient: defaultTestClient },
      }
    );

    const submitButton = await screen.findByRole('button', { name: 'Login' });
    fireEvent.click(submitButton);

    const alerts = await screen.findAllByRole('alert');

    expect(alerts[0]).toHaveTextContent(
      /please review the highlighted fields/i
    );
    expect(alerts.some((node) => /email is required|required/i.test(node.textContent || ''))).toBe(
      true
    );
    expect(screen.getByLabelText(/email/i)).toHaveFocus();
  });
});
