@scoped_for_testing
Feature: Definition after file change

  Background:
    Given the project is named "scoped-for-testing"
    And I open VSCode with the following file "custom-element.ts"
    And I'm on the line <LINE> at character <CODE>
    And I open VSCode with the following file "custom-element-user.ts"

  @focus
  Scenario Outline: Definition after file change
    When I change the file "custom-element-user.ts" by adding a new line
    And I execute Go To Definition in the file "custom-element.ts"
    Then the defintion in "custom-element-user.ts" should be correct

    Examples:
      | DESCRIPTION | LINE | CODE                                          |
      | Import      | 1    | `export class \|CustomElementCustomElement {` |
