export function normalizeNavbarAvatar(value?: string) {
  if (!value) return '';
  if (value.startsWith('/')) return value;
  if (value.startsWith('shared/')) return `/${value}`;
  if (value.startsWith('avatars/')) return `/${value}`;

  try {
    const parsed = new URL(value);
    if (
      parsed.pathname.startsWith('/avatars/') ||
      parsed.pathname.startsWith('/shared/avatars/')
    ) {
      return parsed.pathname;
    }
  } catch {
    // keep original value if it is not a valid URL
  }

  return value;
}
