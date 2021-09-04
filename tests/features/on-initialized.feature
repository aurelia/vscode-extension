Feature: Initialization

  @focus
  Scenario: Non Aurelia project
    Given I open VSCode with no active files
    And the project is named "non-aurelia-project"
    Then the extension should not activate

  Scenario: Detecting simple CLI generated project - no active files on initialization
    Given I open VSCode with no active files
    And I have a CLI generated Aurelia project structure "cli-generated"
    Then the extension should recognize the Aurelia project
