import { fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import ThemeToggler from '@/packages/components/themeToggler/ThemeToggler';

const mockSetTheme = jest.fn();
let mockTheme = 'light';
let mockHasAdminContext = true;

jest.mock('@/packages/contexts/admin/AdminContext', () => ({
  useOptionalAdminContext: () =>
    mockHasAdminContext
      ? {
          admin: { theme: mockTheme },
          setTheme: mockSetTheme,
        }
      : undefined,
}));

jest.mock('@/packages/contexts/profile/ProfileContext', () => ({
  useOptionalProfileContext: () => undefined,
}));

jest.mock('@/packages/contexts/worker/WorkerContext', () => ({
  useOptionalWorkerContext: () => undefined,
}));

describe('ThemeToggler public contract', () => {
  beforeEach(() => {
    mockTheme = 'light';
    mockHasAdminContext = true;
    mockSetTheme.mockReset();
    localStorage.clear();
    document.documentElement.setAttribute('data-theme', 'light');
  });

  it('exposes a native, named binary control and requests the next theme', () => {
    render(<ThemeToggler ariaLabel="Theme: Light mode. Switch to Dark mode" />);

    const control = screen.getByRole('button', {
      name: 'Theme: Light mode. Switch to Dark mode',
    });
    expect(control).toHaveAttribute('type', 'button');
    expect(control).toHaveAttribute('aria-pressed', 'false');
    expect(control).toHaveAttribute('title', 'Theme: Light mode. Switch to Dark mode');
    expect(control).toHaveClass('button', 'button--ghost');

    control.focus();
    expect(control).toHaveFocus();
    fireEvent.click(control);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('announces dark state and its available light action', () => {
    mockTheme = 'dark';
    render(
      <ThemeToggler labels={{ buttonLabel: 'Theme', darkMode: 'Dark', lightMode: 'Light' }} />
    );

    const control = screen.getByRole('button', { name: 'Theme: Dark. Switch to Light' });
    expect(control).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(control);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('renders safely without an application theme provider', () => {
    mockHasAdminContext = false;
    document.documentElement.setAttribute('data-theme', 'dark');
    render(<ThemeToggler />);

    expect(
      screen.getByRole('button', { name: 'Theme: Light mode. Switch to Dark mode' })
    ).toBeEnabled();
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('remains a legacy binary control without system or matchMedia dependencies', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'packages/components/themeToggler/ThemeToggler.tsx'),
      'utf8'
    );
    const styles = readFileSync(
      resolve(process.cwd(), 'packages/components/themeToggler/ThemeToggler.module.css'),
      'utf8'
    );

    expect(source).not.toMatch(/matchMedia|prefers-color-scheme|system/);
    expect(source).not.toMatch(/document\.documentElement|localStorage\./);
    expect(source).toContain("'button--ghost'");
    expect(source).toContain('NavbarShared.module.css');
    expect(`${source}\n${styles}`).not.toContain('--op-');
  });

  it('keeps the current application owners and Dashboard bootstrap boundary separate', () => {
    const root = process.cwd();
    const dashboardHeader = readFileSync(
      resolve(root, 'apps/dashboard/app/[lang]/(app)/components/shell/DashboardShellHeader.tsx'),
      'utf8'
    );
    const dashboardLayout = readFileSync(
      resolve(root, 'apps/dashboard/app/[lang]/(app)/layout.tsx'),
      'utf8'
    );
    const dashboardBootstrap = readFileSync(
      resolve(root, 'apps/dashboard/app/[lang]/(app)/dashboardThemeBootstrap.ts'),
      'utf8'
    );
    const profileSettings = readFileSync(
      resolve(
        root,
        'packages/components/client/user/profile/userPreferencesCard/SettingsThemeControl.tsx'
      ),
      'utf8'
    );
    const clientNavbarViews = [
      'packages/components/client/navbar/NavbarDesktopView/NavbarDesktopView.tsx',
      'packages/components/client/navbar/NavbarTabletView/NavbarTabletView.tsx',
      'packages/components/client/navbar/NavbarMobileView/NavbarMobileView.tsx',
    ].map((path) => readFileSync(resolve(root, path), 'utf8'));
    const workerProfile = readFileSync(
      resolve(root, 'apps/worker/app/[lang]/(app)/profile/page.tsx'),
      'utf8'
    );
    const contextSources = [
      'packages/contexts/admin/AdminContext.tsx',
      'packages/contexts/profile/ProfileContext.tsx',
      'packages/contexts/worker/WorkerContext.tsx',
    ].map((path) => readFileSync(resolve(root, path), 'utf8'));

    expect(dashboardHeader).toContain('<ThemeToggler');
    expect(profileSettings).toContain('<ThemeToggler');
    expect(clientNavbarViews.every((source) => source.includes('<ThemeToggler'))).toBe(true);
    expect(workerProfile).toContain('<ThemeToggler');
    expect(dashboardLayout).toContain('createDashboardThemeBootstrapScript(params.lang)');
    expect(dashboardBootstrap).toContain("localStorage.getItem('theme')");
    expect(dashboardBootstrap).toContain(
      "document.documentElement.setAttribute('data-theme', theme)"
    );
    expect(dashboardBootstrap).not.toMatch(/matchMedia|prefers-color-scheme|system/);
    expect(contextSources.join('\n')).not.toContain('ThemeProvider');
  });
});
