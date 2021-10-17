@core
Feature: AureliaComponents
  @focus
  Scenario: Component Identifier
    Given the project is named "scoped-for-testing"
    And the active file is "custom-element.ts"
    # And I open VSCode with the following file "custom-element.ts"
    When I call AureliaComponents#init
    Then the correct view model name should be returned
