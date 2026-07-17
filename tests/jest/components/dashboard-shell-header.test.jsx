import { fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { DashboardShellHeader } from '@/apps/dashboard/app/[lang]/(app)/components/shell/DashboardShellHeader';

const mockSetTheme = jest.fn();
let mockLang = 'en';
let mockTheme = 'light';

jest.mock('next/navigation', () => ({
  usePathname: () => '/en/dashboard',
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

jest.mock('@/packages/contexts', () => ({
  useAdmin: () => ({
    admin: { name: 'A very long operational administrator name', theme: mockTheme },
    setTheme: mockSetTheme,
  }),
  useAuth: () => ({ auth: { role: 'admin' } }),
}));

jest.mock('@/packages/hooks', () => ({
  useLang: () => mockLang,
}));

jest.mock('@/packages/components/languageSwitcher/LanguageSwitcher', () => ({
  __esModule: true,
  default: () => <button type="button">Legacy language switcher</button>,
}));

describe('DashboardShellHeader theme composition', () => {
  beforeEach(() => {
    mockLang = 'en';
    mockTheme = 'light';
    mockSetTheme.mockReset();
  });

  it.each([
    ['en', 'light', 'Theme: Light mode. Switch to Dark mode'],
    ['de', 'dark', 'Thema: Dunkelmodus. Zu Hellmodus wechseln'],
    ['es', 'light', 'Tema: Modo claro. Cambiar a modo oscuro'],
  ])('resolves %s labels from the Admin theme contract', (lang, theme, accessibleName) => {
    mockLang = lang;
    mockTheme = theme;
    render(<DashboardShellHeader />);

    expect(screen.getByRole('button', { name: accessibleName })).toHaveAttribute(
      'aria-pressed',
      String(theme === 'dark')
    );
  });

  it('requests the next Admin theme while leaving LanguageSwitcher in place', () => {
    render(<DashboardShellHeader />);
    fireEvent.click(screen.getByRole('button', { name: 'Theme: Light mode. Switch to Dark mode' }));

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(screen.getByRole('button', { name: 'Legacy language switcher' })).toBeInTheDocument();
  });

  it('does not consume the shared ThemeToggler', () => {
    const source = readFileSync(
      resolve(
        process.cwd(),
        'apps/dashboard/app/[lang]/(app)/components/shell/DashboardShellHeader.tsx'
      ),
      'utf8'
    );

    expect(source).toContain('<DashboardThemeControl');
    expect(source).not.toContain('ThemeToggler');
  });
});
