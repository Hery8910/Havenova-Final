export const formatCatalogDate = (value: string, locale: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const getCatalogStatusLabel = (
  isActive: boolean,
  labels: { active: string; inactive: string }
) => (isActive ? labels.active : labels.inactive);
