import {
  normalizeTheme,
  readSessionStorageValue,
  readStoredTheme,
  removeSessionStorageValue,
  synchronizeDocumentTheme,
  writeSessionStorageValue,
} from '@/packages/contexts/sessionComplement/themeEffects';

describe('session theme effects', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('accepts only light and dark as persisted theme values', () => {
    expect(normalizeTheme('light')).toBe('light');
    expect(normalizeTheme('dark')).toBe('dark');
    expect(normalizeTheme('system')).toBeNull();
    expect(normalizeTheme(undefined)).toBeNull();
  });

  it('degrades safely when browser storage rejects reads, writes, or scoped-cache removal', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('read blocked');
    });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('write blocked');
    });
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('remove blocked');
    });

    expect(readStoredTheme()).toBeNull();
    expect(readSessionStorageValue('hv-admin:client:user')).toBeNull();
    expect(writeSessionStorageValue('hv-admin:client:user', '{}')).toBe(false);
    expect(removeSessionStorageValue('hv-admin:client:user')).toBe(false);

    synchronizeDocumentTheme('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });
});
