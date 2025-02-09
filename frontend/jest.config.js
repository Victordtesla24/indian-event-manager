export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.svg$': '<rootDir>/src/__mocks__/svgMock.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    // Add explicit mappings for source directories
    '^../../contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^../../stores/(.*)$': '<rootDir>/src/stores/$1',
    '^../../types/(.*)$': '<rootDir>/src/types/$1',
    '^../../../contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^../../../components/(.*)$': '<rootDir>/src/components/$1'
  },
  modulePaths: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.json',
        diagnostics: false
      }
    ]
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleDirectories: ['node_modules', 'src'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  resolver: 'ts-jest-resolver',
  rootDir: '.'
};
