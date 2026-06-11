export const resolvePreferredContactEmail = (
  ...candidates: Array<string | null | undefined>
): string => {
  for (const candidate of candidates) {
    const normalized = candidate?.trim();
    if (normalized) {
      return normalized;
    }
  }

  return '';
};
