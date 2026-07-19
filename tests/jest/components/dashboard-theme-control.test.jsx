import { fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { DashboardThemeControl } from '@/apps/dashboard/app/[lang]/(app)/components/shell/DashboardThemeControl';

const labels = {
  theme: 'Theme',
  lightMode: 'Light mode',
  darkMode: 'Dark mode',
  switchToLight: 'Switch to Light mode',
  switchToDark: 'Switch to Dark mode',
};

describe('DashboardThemeControl', () => {
  it('renders the native accessible light control and requests dark', () => {
    const onThemeChange = jest.fn();
    render(<DashboardThemeControl theme="light" labels={labels} onThemeChange={onThemeChange} />);

    const control = screen.getByRole('button', {
      name: 'Theme: Light mode. Switch to Dark mode',
    });
    expect(control).toHaveAttribute('type', 'button');
    expect(control).toHaveAttribute('aria-pressed', 'false');
    expect(control).toHaveAttribute('title', 'Theme: Light mode. Switch to Dark mode');
    expect(control.querySelector('span[aria-hidden="true"]')).toBeInTheDocument();

    control.focus();
    expect(control).toHaveFocus();
    fireEvent.click(control);
    expect(onThemeChange).toHaveBeenCalledWith('dark');
  });

  it('announces dark state and requests light', () => {
    const onThemeChange = jest.fn();
    render(<DashboardThemeControl theme="dark" labels={labels} onThemeChange={onThemeChange} />);

    const control = screen.getByRole('button', {
      name: 'Theme: Dark mode. Switch to Light mode',
    });
    expect(control).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(control);
    expect(onThemeChange).toHaveBeenCalledWith('light');
  });

  it('stays presentational and operationally scoped', () => {
    const root = process.cwd();
    const source = readFileSync(
      resolve(root, 'apps/dashboard/app/[lang]/(app)/components/shell/DashboardThemeControl.tsx'),
      'utf8'
    );
    const styles = readFileSync(
      resolve(
        root,
        'apps/dashboard/app/[lang]/(app)/components/shell/DashboardThemeControl.module.css'
      ),
      'utf8'
    );

    expect(source).not.toMatch(
      /AdminContext|ProfileContext|WorkerContext|ThemeToggler|NavbarShared|useEffect|document\.|window\.|localStorage/
    );
    expect(`${source}\n${styles}`).not.toMatch(/button--|className=\{['"]button/);
    expect(styles).toContain('--op-');
  });
});
