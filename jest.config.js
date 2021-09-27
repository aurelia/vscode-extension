module.exports = {
  roots: ['<rootDir>'],
  // modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', '<rootDir>/server/node_modules'], // So server files also get watched
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': '@sucrase/jest-plugin',
    // '^.+\\.ts$': '@swc/jest',
    // '^.+\\.ts$': 'esbuild-jest',
  },
  // preset: 'ts-jest',
  // verbose: true,
  testRegex: '.[j,t]s$',
  // coverageDirectory: '.coverage',
  // coverageReporters: ['text', 'text-summary'],
  // coverageThreshold: {
  //   global: { statements: 90, lines: 90, functions: 90 },
  // },
  testPathIgnorePatterns: ['/build/', '/node_modules/', '/testFixture/'],
  // globals: {
  //   'ts-jest': {
  //     tsconfig: 'tests/tsconfig.json',
  //   },
  // },
};
