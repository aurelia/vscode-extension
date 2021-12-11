@core
Feature: AureliaComponents
  Scenario: Component Identifier
    Given the project is named "scoped-for-testing"
    And the active file is "custom-element.ts"
    # And I open VSCode with the following file "custom-element.ts"
    When I call AureliaComponents#init
    Then the correct view model name should be returned

  Scenario: Constructor modifier arguments
    Given the project is named "scoped-for-testing"
    And the active file is "empty-view.ts"
    When I call AureliaComponents#init
    Then the constructor arguments should have been processed correctly
