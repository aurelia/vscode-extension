Feature: Detecting an Aurelia project

  Scenario: Non Aurelia project
    Given the project is named "non-aurelia-project"
    And I open VSCode with no active files
    Then the extension should not activate

  Scenario: CLI generated project
    Given the project is named "cli-generated"
    And I open VSCode with no active files
    Then the extension should detect the Aurelia project

  # @focus
  Scenario: Monorepo project
    Given the project is named "monorepo"
    And I open VSCode with no active files
    Then the extension should detect all Aurelia projects
