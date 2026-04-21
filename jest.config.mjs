import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './apps/client',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  testMatch: ['<rootDir>/tests/jest/**/*.test.jsx'],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': '<rootDir>/tests/__mocks__/styleModuleMock.js',
    '^.+\\.(css|sass|scss)$': '<rootDir>/tests/__mocks__/styleMock.js',
    '^@/packages/components/(.*)$': '<rootDir>/packages/components/$1',
    '^@/packages/contexts/(.*)$': '<rootDir>/packages/contexts/$1',
    '^@/packages/hooks/(.*)$': '<rootDir>/packages/hooks/$1',
    '^@/packages/services/(.*)$': '<rootDir>/packages/services/$1',
    '^@/packages/types/(.*)$': '<rootDir>/packages/types/$1',
    '^@/packages/utils/(.*)$': '<rootDir>/packages/utils/$1',
    '^@/packages/i18n$': '<rootDir>/packages/i18n/index.ts',
    '^@/packages/i18n/(.*)$': '<rootDir>/packages/i18n/$1',
    '^@/apps/(.*)$': '<rootDir>/apps/$1',
    '^@/(.*)$': '<rootDir>/$1',
    '^@havenova/components$': '<rootDir>/packages/components/index.ts',
    '^@havenova/components/(.*)$': '<rootDir>/packages/components/$1',
    '^@havenova/contexts$': '<rootDir>/packages/contexts/index.ts',
    '^@havenova/contexts/(.*)$': '<rootDir>/packages/contexts/$1',
    '^@havenova/services$': '<rootDir>/packages/services/index.ts',
    '^@havenova/services/(.*)$': '<rootDir>/packages/services/$1',
    '^@havenova/types$': '<rootDir>/packages/types/index.ts',
    '^@havenova/types/(.*)$': '<rootDir>/packages/types/$1',
    '^@havenova/utils$': '<rootDir>/packages/utils/index.ts',
    '^@havenova/utils/(.*)$': '<rootDir>/packages/utils/$1',
    '^@havenova/i18n$': '<rootDir>/packages/i18n/index.ts',
    '^@havenova/i18n/(.*)$': '<rootDir>/packages/i18n/$1',
  },
};

export default createJestConfig(customJestConfig);
