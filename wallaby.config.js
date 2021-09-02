module.exports = function () {
  return {
    files: [
      "client/**/*.ts",
      "server/**/*.ts",
      "**/tsconfig.json",
      "tests/testFixture/**/*.{ts,html,json}",
      "tests/unit/helpers/**/*.ts",
      "cypress/integration/common/**/*.ts",
      "cypress/integration/**/*.feature",
    ],

    tests: [
      // 'tests/unit/**/*.spec.ts',
      // 'tests/unit/**/*Map.spec.ts',
      // 'tests/unit/**/*embeddedSupport.spec.ts',
      // 'tests/unit/**/AureliaExtension.spec.ts',
      // 'tests/unit/**/aureliaServer.spec.ts',
      'cypress/integration/initialization/on-initialized/on-initialized.spec.ts'
      // "tests/unit/**/languageModes.spec.ts",
      // "tests/unit/feature/embeddedLanguages/modes*.spec.ts",
      // "tests/unit/feature/embeddedLanguages/modes__definitions.spec.ts",
      // "tests/unit/feature/embeddedLanguages/modes__completions.spec.ts",
      // 'tests/unit/**/AureliaProgram.spec.ts',
    ],

    testFramework: "jest",
    env: {
      type: "node",
    },
    debug: true,
  };
};
