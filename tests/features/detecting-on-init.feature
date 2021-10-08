Feature: Detecting an Aurelia project
  Note: This test is actually not valid from the code perspective, as
  the extension only activates, when there is a .ts/.html file active on open.

  #
  Scenario: Non Aurelia project
    Given the project is named "non-aurelia-project"
    And I open VSCode with no active files
    Then the extension should not activate

  @cli_generated
  Scenario: CLI generated project
    Given the project is named "cli-generated"
    And I open VSCode with no active files
    Then the extension should detect the Aurelia project

  @monorepo
  Scenario: Monorepo project
    Given the project is named "monorepo"
    And I open VSCode with no active files
    Then the extension should detect all Aurelia projects
