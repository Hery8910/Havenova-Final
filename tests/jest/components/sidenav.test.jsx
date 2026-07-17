import { act, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SideNav } from '@/packages/components/sideNav';
import { getDashboardNavSections } from '@/apps/dashboard/app/[lang]/(app)/dashboardShell';
import {
  buildDefaultProfileNavMainItems,
  resolveProfileNavLabels,
} from '@/packages/components/client/user/profile/profileNav/profileNav.helpers';

let pathname = '/en/requests';

jest.mock('next/navigation', () => ({
  usePathname: () => pathname,
}));

jest.mock('next/link', () => ({ children, href, ...props }) => (
  <a href={href} {...props}>
    {children}
  </a>
));

function createMatchMedia(matches = false) {
  const listeners = new Set();
  return {
    matches,
    addEventListener: jest.fn((_, listener) => listeners.add(listener)),
    removeEventListener: jest.fn((_, listener) => listeners.delete(listener)),
    change(next) {
      this.matches = next;
      listeners.forEach((listener) => listener({ matches: next }));
    },
  };
}

function renderSideNav(props = {}) {
  return render(
    <SideNav
      mainItems={[{ key: 'requests', label: 'Requests', href: '/en/requests', icon: <span /> }]}
      mainSections={[
        {
          key: 'workspace',
          label: 'Workspace',
          items: [{ key: 'requests', label: 'Requests', href: '/en/requests', icon: <span /> }],
        },
      ]}
      onLogout={jest.fn()}
      logoutLabel="Logout"
      navigationLabel="Main navigation"
      collapseLabel="Collapse"
      expandLabel="Expand"
      {...props}
    />
  );
}

describe('SideNav characterization', () => {
  beforeEach(() => {
    pathname = '/en/requests';
  });

  it('marks the active route and exposes names when collapsed', () => {
    const media = createMatchMedia(false);
    window.matchMedia = jest.fn(() => media);
    renderSideNav({ isCollapsed: true });
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Requests' })).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByText('Requests')).not.toBeInTheDocument();
  });

  it('keeps the active section expanded and preserves aria contracts', () => {
    const media = createMatchMedia(false);
    window.matchMedia = jest.fn(() => media);
    renderSideNav();
    const section = screen.getByRole('button', { name: /workspace/i });
    expect(section).toHaveAttribute('type', 'button');
    expect(section).toHaveAttribute('aria-expanded', 'true');
    expect(section).toHaveAttribute('aria-controls');
    fireEvent.click(section);
    expect(section).toHaveAttribute('aria-expanded', 'true');
  });

  it('synchronizes uncontrolled collapse with matchMedia and cleans listeners', () => {
    const media = createMatchMedia(false);
    window.matchMedia = jest.fn(() => media);
    const { unmount } = renderSideNav();
    expect(screen.getByRole('button', { name: 'Collapse' })).toBeInTheDocument();
    act(() => media.change(true));
    expect(screen.getByRole('button', { name: 'Expand' })).toBeInTheDocument();
    unmount();
    expect(media.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('delegates controlled collapse and item selection to its consumer', () => {
    const media = createMatchMedia(false);
    const onCollapsedChange = jest.fn();
    const onItemSelect = jest.fn();
    window.matchMedia = jest.fn(() => media);
    renderSideNav({ isCollapsed: false, onCollapsedChange, onItemSelect });

    fireEvent.click(screen.getByRole('button', { name: 'Collapse' }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: 'Collapse' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', { name: 'Requests' }));
    expect(onItemSelect).toHaveBeenCalledTimes(1);
  });

  it('does not fail when matchMedia is unavailable', () => {
    const original = window.matchMedia;
    delete window.matchMedia;
    expect(() => renderSideNav()).not.toThrow();
    window.matchMedia = original;
  });
});

describe('consumer models remain isolated', () => {
  it('builds localized Dashboard sections with an active-compatible requests route', () => {
    const dashboard = getDashboardNavSections('de');
    const requests = dashboard.mainSections
      .flatMap((section) => section.items)
      .find((item) => item.key === 'requests');
    expect(requests).toMatchObject({ href: '/requests', match: 'prefix', label: 'Anfragen' });
  });

  it('builds ProfileNav routes independently from the Dashboard model', () => {
    const labels = resolveProfileNavLabels({});
    const profile = buildDefaultProfileNavMainItems('en', labels);
    expect(profile.map((item) => item.href)).toEqual([
      '/en/profile',
      '/en/profile/orders',
      '/en/profile/requests',
      '/en/profile/notifications',
    ]);
    expect(profile.some((item) => item.href === '/requests')).toBe(false);
  });

  it('keeps operational style tokens outside the shared SideNav compatibility island', () => {
    const repositoryRoot = resolve(process.cwd());
    const sideNavSource = readFileSync(
      resolve(repositoryRoot, 'packages/components/sideNav/SideNav.tsx'),
      'utf8'
    );
    const sideNavStyles = readFileSync(
      resolve(repositoryRoot, 'packages/components/sideNav/SideNav.module.css'),
      'utf8'
    );

    expect(`${sideNavSource}\n${sideNavStyles}`).not.toContain('--op-');
  });
});
