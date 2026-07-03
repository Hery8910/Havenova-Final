let csrfTokenMemory = '';
export const getCsrfToken = (): string => csrfTokenMemory;

export const setCsrfToken = (value?: string | null) => {
  csrfTokenMemory = value?.trim() || '';
};

export const clearCsrfToken = () => {
  csrfTokenMemory = '';
};

export const getCsrfDebugState = () => ({
  hasInMemoryCsrfToken: Boolean(csrfTokenMemory),
});
