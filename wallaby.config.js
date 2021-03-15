module.exports = function () {
  return {
    files: [
      "client/**/*.ts",
      "server/**/*.ts",
      "**/tsconfig.json",
      "tests/testFixture/src/**/*.{ts,html,json}",
      "tests/unit/helpers/**/*.ts",
    ],

    tests: [
      // 'tests/unit/**/*.spec.ts',
      // 'tests/unit/**/*Map.spec.ts',
      // 'tests/unit/**/*embeddedSupport.spec.ts',
      'tests/unit/**/AureliaProject.spec.ts',
      // "tests/unit/**/languageModes.spec.ts",
      // "tests/unit/feature/embeddedLanguages/modes*.spec.ts",
      // "tests/unit/feature/embeddedLanguages/modes__definitions.spec.ts",
      // "tests/unit/feature/embeddedLanguages/modes__completions.spec.ts",
      // 'tests/unit/**/AureliaProgram.spec.ts',
    ],

    testFramework: "mocha",
    env: {
      type: "node",
    },
    debug: true,
  };
};
