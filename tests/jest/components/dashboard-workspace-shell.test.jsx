import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { DashboardWorkspaceShell } from '@/apps/dashboard/app/[lang]/(app)/components/shell/DashboardWorkspaceShell';

let pathname = '/en/requests';
const selected = jest.fn();

jest.mock('next/navigation', () => ({ usePathname: () => pathname }));
jest.mock('@/packages/hooks', () => ({ useLang: () => 'en' }));
jest.mock('@/apps/dashboard/app/[lang]/(app)/components/shell/DashboardShellHeader', () => ({
  DashboardShellHeader: () => <div>Header</div>,
}));
jest.mock('@/apps/dashboard/app/[lang]/(app)/components/shell/DashboardShellNav', () => ({
  DashboardShellNav: ({ presentation, onItemSelect, showCollapseControl = true }) => (
    <nav aria-label={presentation === 'drawer' ? 'Drawer navigation' : 'Desktop navigation'}>
      <button type="button" onClick={onItemSelect}>
        Route
      </button>
      {showCollapseControl ? <button type="button">Collapse navigation</button> : null}
    </nav>
  ),
}));

function installMedia(matches = true) {
  const listeners = new Set();
  const media = {
    matches,
    addEventListener: (_, listener) => listeners.add(listener),
    removeEventListener: (_, listener) => listeners.delete(listener),
    change: (next) => listeners.forEach((listener) => listener({ matches: next })),
  };
  window.matchMedia = jest.fn(() => media);
  return media;
}

describe('DashboardWorkspaceShell mobile drawer', () => {
  beforeEach(() => {
    pathname = '/en/requests';
    selected.mockReset();
    document.body.style.overflow = '';
    installMedia();
    jest.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([{}]);
  });

  it('toggles with its trigger, locks scroll, and restores focus after close mechanisms', async () => {
    render(
      <DashboardWorkspaceShell>
        <p>Workspace content</p>
      </DashboardWorkspaceShell>
    );
    const trigger = screen.getByRole('button', { name: 'Open navigation' });

    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: '/requests' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);
    expect(document.body.style.overflow).toBe('hidden');
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Close navigation' })).toHaveFocus()
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    expect(document.body.style.overflow).toBe('');
    expect(trigger).toHaveFocus();

    fireEvent.click(trigger);
    fireEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
  });

  it('closes through close button, backdrop, route selection, pathname and desktop viewport', async () => {
    const media = installMedia();
    const { rerender } = render(
      <DashboardWorkspaceShell>
        <p>Workspace content</p>
      </DashboardWorkspaceShell>
    );
    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    const open = () => fireEvent.click(trigger);

    open();
    fireEvent.click(screen.getByRole('button', { name: 'Close navigation' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    open();
    fireEvent.click(screen.getByRole('dialog').parentElement.firstElementChild);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    open();
    fireEvent.click(screen.getByRole('dialog').querySelector('button:last-child'));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    open();
    pathname = '/en/account';
    rerender(
      <DashboardWorkspaceShell>
        <p>Workspace content</p>
      </DashboardWorkspaceShell>
    );
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    open();
    act(() => media.change(false));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe('');
  });
});
