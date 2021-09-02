module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testRegex: '\.(test|spec|steps)\\.ts$',
  coverageDirectory: ".coverage",
  coverageReporters: ['text', 'text-summary'],
  coverageThreshold: {
    global: { statements: 90, lines: 90, functions: 90 }
  },
  testPathIgnorePatterns: [
    '/build/',
    '/node_modules/'
  ]
}
