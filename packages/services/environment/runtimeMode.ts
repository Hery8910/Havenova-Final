export type EnvironmentMode = 'development' | 'preview' | 'production' | 'test';

export const normalizeEnvironmentValue = (value?: string | null): string => (value ?? '').trim();

export const resolveEnvironmentMode = (nodeEnv?: string): EnvironmentMode => {
  switch (normalizeEnvironmentValue(nodeEnv)) {
    case 'production':
      return 'production';
    case 'test':
      return 'test';
    case 'development':
      return 'development';
    default:
      return 'preview';
  }
};
