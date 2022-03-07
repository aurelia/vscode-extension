@scoped_for_testing
Feature: Rename after file change

  Background:
    Given the project is named "scoped-for-testing"
    And I open VSCode with the following file "custom-element.ts"
    And I'm on the line <LINE> at character <CODE>
    And I open VSCode with the following file "custom-element-user.ts"

  Scenario Outline: Rename after file change
    When I change the file "custom-element-user.ts" by adding a new line
    And I trigger Rename in the file "custom-element.ts" to "newNew"
    Then the View model variable in "custom-element-user.ts" should be renamed

    Examples:
      | DESCRIPTION | LINE | CODE                                          |
      | Import      | 1    | `export class \|CustomElementCustomElement {` |
