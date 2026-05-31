export function normalizeNavbarAvatar(value?: string) {
  if (!value) return '';
  if (value.startsWith('/')) return value;

  try {
    const parsed = new URL(value);
    if (parsed.pathname.startsWith('/avatars/')) return parsed.pathname;
  } catch {
    // keep original value if it is not a valid URL
  }

  return value;
}
