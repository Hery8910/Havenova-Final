import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import LanguageSwitcher from '../../../packages/components/languageSwitcher/LanguageSwitcher';

const mockPush = jest.fn();
const mockUsePathname = jest.fn();
const mockUseOptionalProfileContext = jest.fn();
const mockUseOptionalWorkerContext = jest.fn();
const mockCookieSet = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockUsePathname(),
}));

jest.mock('js-cookie', () => ({
  __esModule: true,
  default: {
    set: (...args) => mockCookieSet(...args),
  },
}));

jest.mock('../../../packages/contexts/profile/ProfileContext', () => ({
  useOptionalProfileContext: () => mockUseOptionalProfileContext(),
}));

jest.mock('../../../packages/contexts/worker/WorkerContext', () => ({
  useOptionalWorkerContext: () => mockUseOptionalWorkerContext(),
}));

const labels = {
  title: 'Language',
  openButtonLabel: 'Open language selector',
  closeButtonLabel: 'Close language selector',
  currentLanguageLabel: 'Current language',
  options: {
    de: { label: 'Deutsch', shortLabel: 'DE', switchLabel: 'Switch language to German' },
    en: { label: 'English', shortLabel: 'EN', switchLabel: 'Switch language to English' },
    es: { label: 'Español', shortLabel: 'ES', switchLabel: 'Switch language to Spanish' },
  },
};

function setup({ profileContext = null, workerContext = null, ...props } = {}) {
  mockPush.mockReset();
  mockCookieSet.mockReset();
  mockUsePathname.mockReturnValue('/en/contact');
  mockUseOptionalProfileContext.mockReturnValue(profileContext);
  mockUseOptionalWorkerContext.mockReturnValue(workerContext);

  return render(<LanguageSwitcher labels={labels} {...props} />);
}

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens the dropdown without unmounting it and hides it again on outside click', async () => {
    setup();

    const trigger = screen.getByRole('button', { name: 'Current language: English' });
    fireEvent.click(trigger);

    const panel = await screen.findByLabelText('Language');
    expect(panel).toHaveAttribute('aria-hidden', 'false');
    expect(screen.getByRole('button', { name: 'Switch language to German' })).toBeInTheDocument();

    fireEvent.pointerDown(document.body);

    await waitFor(() => {
      expect(panel).toHaveAttribute('aria-hidden', 'true');
    });

    expect(screen.queryByRole('button', { name: 'Deutsch' })).not.toBeInTheDocument();
  });

  it('switches language and navigates to the same path with the new locale prefix', async () => {
    const setLanguage = jest.fn().mockResolvedValue(undefined);
    setup({ profileContext: { setLanguage } });

    fireEvent.click(screen.getByRole('button', { name: 'Current language: English' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Switch language to German' }));

    await waitFor(() => {
      expect(mockCookieSet).toHaveBeenCalledWith('lang', 'de', { path: '/', expires: 365 });
      expect(setLanguage).toHaveBeenCalledWith('de');
      expect(mockPush).toHaveBeenCalledWith('/de/contact');
    });
  });

  it('renders modal presentation and closes it through the backdrop', async () => {
    setup({ presentation: 'modal', triggerDisplay: 'icon-with-value' });

    fireEvent.click(screen.getByRole('button', { name: 'Current language: English' }));

    const dialog = await screen.findByRole('dialog', { name: 'Language' });
    expect(dialog).toHaveAttribute('aria-hidden', 'false');

    fireEvent.click(screen.getAllByRole('button', { name: 'Close language selector' })[1]);

    await waitFor(() => {
      expect(dialog).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
