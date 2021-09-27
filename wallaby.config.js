module.exports = function (wallaby) {
  return {
    files: [
      'client/**/*.ts',
      'server/**/*.ts',
      'server/node_modules/parse5-sax-parser/**/*.{js,json}',
      'server/node_modules/parse5/**/*.{js,json}',
      '**/tsconfig.json',
      'tests/testFixture/**/*.{ts,html,json}',
      'tests/common/**/*.ts',
      'tests/unit/helpers/**/*.ts',
      'tests/step-definitions/**/*.{spec,step}.ts',
      'tests/dev-test-helpers/**/*.{ts,json}',
      'tests/**/*.feature',
    ],

    tests: [
      // 'tests/unit/**/*.spec.ts',
      // 'tests/unit/**/*Map.spec.ts',
      // 'tests/unit/**/*embeddedSupport.spec.ts',
      // 'tests/unit/**/AureliaExtension.spec.ts',
      // 'tests/unit/**/aureliaServer.spec.ts',
      'tests/jest-cucumber-setup.spec.ts',
      // 'tests/unit/common/documens/find-source-word.spec.ts',
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
