module.exports = function (wallaby) {
  return {
    files: [
      'client/**/*.ts',
      'server/**/*.ts',
      'server/node_modules/parse5-sax-parser/**/*.{js,json}',
      'server/node_modules/parse5/**/*.{js,json}',
      'server/node_modules/@ts-morph/**/*.{d.ts}',
      '**/tsconfig.json',
      'tests/common/**/*.ts',
      'tests/unit/helpers/**/*.ts',
      'tests/**/*.feature',
      'tests/testFixture/**/*.{ts,html,json}',
      // 'tests/step-definitions/capabilities/new-common/**/*.ts',
      'tests/step-definitions/**/*.ts',

      'tests/minimal-jest/**/*.{ts,feature}',
      'tests/dev-test-helpers/**/*.{ts,json}',
      'tests/jest-cucumber-setup.spec.ts',
    ],

    tests: [
      'tests/testLauncher/withWallaby.spec.ts',
      // 'tests/unit/step-definitions/embeddedLanguages/embedded-support.spec.ts',
      // 'tests/unit/core/**/*.spec.ts'
    ],

    testFramework: 'jest',
    env: {
      type: 'node',
    },
    debug: true,
  };
};
