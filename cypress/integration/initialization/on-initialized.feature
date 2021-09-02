Feature: Calculator
  Scenario: Detecting simple CLI generated project
    Given I have a CLI genrated Aurelia project
    Then the extension should recognize it
