module.exports = {
  roots: ['<rootDir>/tests'],
  // modulePaths: ['<rootDir>'],
  // moduleDirectories: ['node_modules', '<rootDir>/server/node_modules'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': '@sucrase/jest-plugin',
  },
  // preset: 'ts-jest',
  // verbose: true,
  testRegex: '.(test|spec|steps).[j,t]s$',
  // coverageDirectory: '.coverage',
  // coverageReporters: ['text', 'text-summary'],
  // coverageThreshold: {
  //   global: { statements: 90, lines: 90, functions: 90 },
  // },
  testPathIgnorePatterns: ['/build/', '/node_modules/', '/testFixture/'],
  globals: {
    'ts-jest': {
      tsconfig: 'tests/tsconfig.json',
    },
  },
};
