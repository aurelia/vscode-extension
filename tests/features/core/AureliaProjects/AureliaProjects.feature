Feature: AureliaProjects - update
  Scenario: updateManyViewModel
    Given the project is named "scoped-for-testing"
    And I open VSCode with the following file "custom-element.ts"
    When I call updateManyViewModel
    Then the view model should change