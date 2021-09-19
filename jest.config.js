module.exports = {
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: [
    'node_modules',
    '<rootDir>/server/node_modules'
  ],
  preset: 'ts-jest',
  verbose: true,
  testRegex: '.(test|spec|steps)\\.ts$',
  coverageDirectory: '.coverage',
  coverageReporters: ['text', 'text-summary'],
  coverageThreshold: {
    global: { statements: 90, lines: 90, functions: 90 },
  },
  testPathIgnorePatterns: ['/build/', '/node_modules/'],
  globals: {
    'ts-jest': {
      tsconfig: 'tests/tsconfig.json',
    },
  },
};
