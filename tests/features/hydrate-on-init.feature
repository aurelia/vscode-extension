Feature: Hydrate on initialization

  # @focus
  Scenario: Hydrate cli generated project
    Given the project is named "cli-generated"
    And I open VSCode with the following files:
      | fileName             |
      | minimal-component.ts |
    Then the extension should hydrate the Aurelia project

  # @focus
  Scenario Outline: Hydrate monorepo project
    Given the project is named "monorepo"
    And I open VSCode with the following files:
      | fileName    |
      | <FILE_NAME> |
    Then the extension should hydrate the Aurelia project

    Examples:
      | FILE_NAME  |
      | aurelia.ts |
      | burelia.ts |

