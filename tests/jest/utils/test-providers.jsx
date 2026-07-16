import React from 'react';
import { render } from '@testing-library/react';

import { AlertProvider } from '../../../packages/contexts/alert/AlertContext';
import { AlertViewport } from '../../../packages/components/alert';
import { ClientProvider } from '../../../packages/contexts/client/ClientContext';
import { I18nProvider } from '../../../packages/contexts/i18n/I18nContext';

export const defaultTestClient = {
  _id: 'client_123',
  identity: { name: 'Havenova' },
  operations: {},
  modules: {},
};

export function TestProviders({
  children,
  language = 'en',
  withAlert = true,
  withClient = false,
  clientOptions = {},
}) {
  const content = withClient ? (
    <ClientProvider
      initialClient={clientOptions.initialClient ?? null}
      initialError={clientOptions.initialError ?? null}
      tenantKey={clientOptions.tenantKey ?? null}
    >
      {children}
    </ClientProvider>
  ) : (
    children
  );

  const alertWrapped = withAlert ? (
    <AlertProvider>
      <AlertViewport />
      {content}
    </AlertProvider>
  ) : (
    content
  );

  return <I18nProvider initialLanguage={language}>{alertWrapped}</I18nProvider>;
}

export function renderWithAppProviders(ui, options = {}) {
  const {
    language = 'en',
    withAlert = true,
    withClient = false,
    clientOptions = {},
    renderOptions = {},
  } = options;

  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders
        language={language}
        withAlert={withAlert}
        withClient={withClient}
        clientOptions={clientOptions}
      >
        {children}
      </TestProviders>
    ),
    ...renderOptions,
  });
}
