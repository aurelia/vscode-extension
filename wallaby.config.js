module.exports = function (wallaby) {
  return {
    files: [
      'client/**/*.ts',
      'server/**/*.ts',
      { pattern: 'server/node_modules/parse5-sax-parser/**/*.{js,json}', instrument: false },
      { pattern: 'server/node_modules/parse5/**/*.{js,json}', instrument: false },
      { pattern: 'server/node_modules/@ts-morph/**/*.{d.ts}', instrument: false },
      '**/tsconfig.json',
      'tests/common/**/*.ts',
      'tests/unit/common/**/*.ts',
      'tests/unit/helpers/**/*.ts',
      { pattern: 'tests/**/*.feature', instrument: false },
      { pattern: 'tests/testFixture/**/*.{ts,html,json}', instrument: false },
      'tests/step-definitions/**/*.ts',

      'tests/minimal-jest/**/*.{ts,feature}',
      'tests/dev-test-helpers/**/*.{ts,json}',
      'tests/jest-cucumber-setup.spec.ts',
    ],

    tests: [
      // 'tests/testLauncher/withWallaby.spec.ts',
      'tests/unit/core/**/*.spec.ts'
    ],

    testFramework: 'jest',
    env: {
      type: 'node',
    },
    debug: true,
    filesWithNoCoverageCalculated: [
      '**/node_modules/**',
      'client/**',
      'server/src/common/@aurelia-runtime-patch/**/*',
      'tests/**/*.spec.ts',
    ]
  }
};
