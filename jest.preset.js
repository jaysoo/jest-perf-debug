const nxPreset = require('@nx/jest/preset').default;
const path = require('path');
const rootSetupFile = path.resolve(__dirname, './jest.setup.ts');

module.exports = {
  ...nxPreset,
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  resolver: '@nx/jest/plugins/resolver',
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverageFrom: [
    '**/*.{ts, js}',
    '!**/node_modules/**',
    '!**/index.ts',
    '!**/types.ts',
    '!**/main.ts',
    '!**/*.routes.ts',
    '!**/environments/*',
    '!**/*.const.ts',
    '!**/constants.ts',
    '!**/e2e/**',
    '!**/playwright/**',
    '!**/cypress/**',
    '!**/nib-e2e/**',
    '!**/e2e-utils/**',
    '!**/*.stories.{ts, js}',
    '!**/jest.config.ts',
    '!**/cypress.config.ts',
    '!**/playwright.config.ts',
  ],
  reporters: ['default'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  globals: {
    'ts-jest': {
      isolatedModules: true,
      tsconfig: '<rootDir>/tsconfig.spec.json',
      diagnostics: {
        warnOnly: false,
        pretty: !process.env.BUILD_ID,
      },
      stringifyContentPathRegex: '\\.html$',
    },
  },
  runInBand: true,
  maxWorkers: 3,
  logHeapUsage: true,
  setupFilesAfterEnv: [rootSetupFile],
  moduleNameMapper: {
    // Jest wires `fs` to `graceful-fs`, which causes a memory leak when
    // `graceful-fs` does `require('fs')`.
    // Ref: https://github.com/facebook/jest/issues/2179#issuecomment-355231418
    'graceful-fs': path.join(__dirname, '/tools/fs.ts'),
    // It indicates the listing where Jest must save the cached dependency details gathered from all throughout the tests
    cacheDirectory:
      process.env.JEST_CACHE_DIRECTORY || path.join(__dirname, '/cache'),
    // It suggests that the framework must automatically clean mock calls and instances between each test
    clearMocks: true,
    // This property suggests Jest to reset the module registry earlier than walking each person test
    resetModules: true,
  },
};
