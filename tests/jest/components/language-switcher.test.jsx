import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import LanguageSwitcher from '../../../packages/components/languageSwitcher/LanguageSwitcher';

const mockPush = jest.fn();
const mockUsePathname = jest.fn();
const mockUseOptionalAdminContext = jest.fn();
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

jest.mock('../../../packages/contexts/admin/AdminContext', () => ({
  useOptionalAdminContext: () => mockUseOptionalAdminContext(),
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

function setup({
  adminContext = null,
  profileContext = null,
  workerContext = null,
  pathname = '/en/contact',
  ...props
} = {}) {
  mockPush.mockReset();
  mockCookieSet.mockReset();
  mockUsePathname.mockReturnValue(pathname);
  mockUseOptionalAdminContext.mockReturnValue(adminContext);
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

  it('closes with a second trigger click and restores trigger focus after Escape', async () => {
    setup();

    const trigger = screen.getByRole('button', { name: 'Current language: English' });
    fireEvent.click(trigger);
    const panel = await screen.findByLabelText('Language');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(trigger);
    await waitFor(() => expect(panel).toHaveAttribute('aria-hidden', 'true'));
    expect(trigger).not.toHaveFocus();

    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(panel).toHaveAttribute('aria-hidden', 'true');
      expect(trigger).toHaveFocus();
    });
  });

  it('closes without persistence or navigation when selecting the current language', async () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'Current language: English' }));
    const currentOption = await screen.findByRole('button', { name: 'English' });
    const panel = currentOption.closest('section');
    fireEvent.click(currentOption);

    await waitFor(() => expect(panel).toHaveAttribute('aria-hidden', 'true'));
    expect(mockCookieSet).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it.each([
    ['/en/contact', 'de', '/de/contact'],
    ['/de', 'es', '/es'],
    ['/en/profile/orders', 'de', '/de/profile/orders'],
    ['/contact', 'es', '/contact'],
  ])(
    'replaces only a supported pathname prefix for %s',
    async (pathname, nextLanguage, expected) => {
      setup({ pathname });

      const currentName = pathname.startsWith('/en')
        ? 'Current language: English'
        : 'Current language: Deutsch';
      fireEvent.click(screen.getByRole('button', { name: currentName }));
      const nextLabel =
        nextLanguage === 'de' ? 'Switch language to German' : 'Switch language to Spanish';
      fireEvent.click(await screen.findByRole('button', { name: nextLabel }));

      await waitFor(() => expect(mockPush).toHaveBeenCalledWith(expected));
    }
  );

  it('uses Admin before Profile and Worker when contexts coexist', async () => {
    const adminSetLanguage = jest.fn().mockResolvedValue(undefined);
    const profileSetLanguage = jest.fn().mockResolvedValue(undefined);
    const workerSetLanguage = jest.fn().mockResolvedValue(undefined);
    setup({
      adminContext: { setLanguage: adminSetLanguage },
      profileContext: { setLanguage: profileSetLanguage },
      workerContext: { setLanguage: workerSetLanguage },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Current language: English' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Switch language to German' }));

    await waitFor(() => expect(adminSetLanguage).toHaveBeenCalledWith('de'));
    expect(profileSetLanguage).not.toHaveBeenCalled();
    expect(workerSetLanguage).not.toHaveBeenCalled();
  });

  it('keeps the shared legacy and portal ownership boundaries explicit', () => {
    const root = process.cwd();
    const source = readFileSync(
      resolve(root, 'packages/components/languageSwitcher/LanguageSwitcher.tsx'),
      'utf8'
    );
    const styles = readFileSync(
      resolve(root, 'packages/components/languageSwitcher/LanguageSwitcher.module.css'),
      'utf8'
    );
    const dashboardHeader = readFileSync(
      resolve(root, 'apps/dashboard/app/[lang]/(app)/components/shell/DashboardShellHeader.tsx'),
      'utf8'
    );
    const workerProfile = readFileSync(
      resolve(root, 'apps/worker/app/[lang]/(app)/profile/page.tsx'),
      'utf8'
    );
    const clientViews = [
      'packages/components/client/navbar/NavbarDesktopView/NavbarDesktopView.tsx',
      'packages/components/client/navbar/NavbarTabletView/NavbarTabletView.tsx',
      'packages/components/client/navbar/NavbarMobileView/NavbarMobileView.tsx',
      'packages/components/client/user/profile/userPreferencesCard/SettingsLanguageControl.tsx',
    ].map((path) => readFileSync(resolve(root, path), 'utf8'));

    expect(source).toMatch(/AdminContext[\s\S]*ProfileContext[\s\S]*WorkerContext/);
    expect(source).toContain("Cookies.set('lang', nextLanguage");
    expect(source).toContain('createPortal(switcherContent, document.body)');
    expect(source).toContain("router.push(segments.join('/'))");
    expect(`${source}\n${styles}`).not.toContain('--op-');
    expect(dashboardHeader).toContain('<LanguageSwitcher');
    expect(workerProfile).toContain('<LanguageSwitcher');
    expect(clientViews.every((view) => view.includes('<LanguageSwitcher'))).toBe(true);
  });
});
