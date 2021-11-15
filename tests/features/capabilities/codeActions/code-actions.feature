@scoped_for_testing
Feature: Rename in View Model.
  Background:
    Given the project is named "scoped-for-testing"

  @focus
  Scenario Outline: Variable in View Model.
    And I open VSCode with the following file "custom-element.html"
    And I'm on the line <LINE> at character <CODE>
    When I trigger Code Action <CODE_ACTION>
    Then the correct Code Action should have been performed <NEW_CODE>

    Examples:
      | DESCRIPTION | CODE_ACTION | LINE | CODE                   | NEW_WORD | NEW_CODE |
      | Import      | "hi"        | 7    | `<\|a href="foo"></a>` | newNew   | NEW_CODE |
