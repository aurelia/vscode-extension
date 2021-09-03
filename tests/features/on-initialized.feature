Feature: Initialization
  Scenario: Detecting simple CLI generated project - no active files on initialization
    Given I open VSCode with no active files
    And I have a CLI generated Aurelia project structure "cli-generated"
    Then the extension should recognize the Aurelia project
