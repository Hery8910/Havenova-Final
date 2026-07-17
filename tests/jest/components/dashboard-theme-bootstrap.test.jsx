import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { createDashboardThemeBootstrapScript } from '@/apps/dashboard/app/[lang]/(app)/dashboardThemeBootstrap';

function runBootstrap(storedTheme, lang = 'en') {
  jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(storedTheme);
  Function(createDashboardThemeBootstrapScript(lang))();
}

describe('Dashboard theme bootstrap', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('lang');
  });

  it.each([
    ['dark', 'dark'],
    ['light', 'light'],
    [null, 'light'],
    ['system', 'light'],
  ])('applies %s as %s before hydration', (storedTheme, expectedTheme) => {
    runBootstrap(storedTheme, 'de');
    expect(document.documentElement).toHaveAttribute('lang', 'de');
    expect(document.documentElement).toHaveAttribute('data-theme', expectedTheme);
  });

  it('falls back to light when storage access throws', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });

    Function(createDashboardThemeBootstrapScript('es'))();
    expect(document.documentElement).toHaveAttribute('lang', 'es');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });

  it('keeps the bootstrap as valid body content ahead of the Dashboard tree', () => {
    const root = process.cwd();
    const layoutSource = readFileSync(
      resolve(root, 'apps/dashboard/app/[lang]/(app)/layout.tsx'),
      'utf8'
    );
    const bootstrapSource = readFileSync(
      resolve(root, 'apps/dashboard/app/[lang]/(app)/dashboardThemeBootstrap.ts'),
      'utf8'
    );

    expect(layoutSource.indexOf('<body')).toBeLessThan(layoutSource.indexOf('<script'));
    expect(layoutSource.indexOf('<script')).toBeLessThan(layoutSource.indexOf('<I18nProvider'));
    expect(bootstrapSource).not.toMatch(/matchMedia|prefers-color-scheme|system/);
  });
});
