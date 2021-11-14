@scoped_for_testing
Feature: Completions.
  Background:
    Given the project is named "scoped-for-testing"
    And I open VSCode with the following file "other-custom-element-user.html"

  @focus
  Scenario Outline: Aurelia key words.
    Given I'm replacing the file content with <CODE>
    And I'm on the line <LINE> at character <CODE>
    When I trigger Suggestions
    Then I should get the correct suggestions <SUGGESTION>

    Examples:
      | DESCRIPTION | LINE | CODE | SUGGESTION |
      | import      | 8    | `\|` | import     |