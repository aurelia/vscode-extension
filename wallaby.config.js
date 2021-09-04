module.exports = function () {
  return {
    files: [
      'client/**/*.ts',
      'server/**/*.ts',
      '**/tsconfig.json',
      'tests/testFixture/**/*.{ts,html,json}',
      'tests/common/**/*.ts',
      'tests/unit/helpers/**/*.ts',
      'tests/step-definitions/**/*.spec.ts',
      'tests/**/*.feature',
    ],

    tests: [
      // 'tests/unit/**/*.spec.ts',
      // 'tests/unit/**/*Map.spec.ts',
      // 'tests/unit/**/*embeddedSupport.spec.ts',
      // 'tests/unit/**/AureliaExtension.spec.ts',
      // 'tests/unit/**/aureliaServer.spec.ts',
      'tests/jest-cucumber-setup.spec.ts',
      // "tests/unit/**/languageModes.spec.ts",
      // "tests/unit/feature/embeddedLanguages/modes*.spec.ts",
      // "tests/unit/feature/embeddedLanguages/modes__definitions.spec.ts",
      // "tests/unit/feature/embeddedLanguages/modes__completions.spec.ts",
      // 'tests/unit/**/AureliaProgram.spec.ts',
    ],

    testFramework: 'jest',
    env: {
      type: 'node',
    },
    debug: true,
  };
};
