Feature: Hydrate on initialization

  @cli_generated
  Scenario: Hydrate cli generated project
    Given the project is named "cli-generated"
    And I open VSCode with the following file "minimal-component.ts"
    Then the extension should hydrate the Aurelia project

  @monorepo
  Scenario Outline: Hydrate monorepo project
    Given the project is named "monorepo"
    And I open VSCode with the following file "<FILE_NAME>"
    Then the extension should hydrate the Aurelia project

    Examples:
      | FILE_NAME  |
      | aurelia.ts |
      | burelia.ts |


  @cli_generated
  Scenario: Don't hydrate cli generated project
    TODO: Don't activate on .json file
    Extension only activate for .ts/.html, and does not for
    .json. In reality, onInitialized() is not called, but in tests
    we call that directly.
    Thus for tests, we would need to handle activation-extensions as well.

    Given the project is named "cli-generated"
    And I open VSCode with the following file "tsconfig.json"
# Then the extension should hydrate the Aurelia project