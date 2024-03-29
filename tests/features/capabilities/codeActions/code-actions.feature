@scoped_for_testing
Feature: Code Actions.
  Background:
    Given the project is named "scoped-for-testing"

  Scenario Outline: View Refactor.
    And I open VSCode with the following file "custom-element.html"
    And I'm on the line <LINE> at character <CODE>
    When I trigger Code Action <CODE_ACTION>
    Then the the refactor Code Action should have been performed <NEW_CODE>

    Examples:
      | DESCRIPTION | CODE_ACTION   | LINE | CODE                   | NEW_CODE |
      | Import      | refactor.aTag | 7    | `<\|a href="foo"></a>` | import   |

  Scenario Outline: View Refactor - on change content.
    Given I open VSCode with the following file "empty-view.html"
    And I'm replacing the file content with <CODE>
    And I'm on the line <LINE> at character <CODE>
    When I trigger Code Action <CODE_ACTION>
    Then the the refactor Code Action should have been performed <NEW_CODE>

    Examples:
      | DESCRIPTION | CODE_ACTION   | LINE | CODE                   | NEW_CODE |
      | Import      | refactor.aTag | 0    | `<\|a href="foo"></a>` | import   |