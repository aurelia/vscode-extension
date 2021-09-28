@cli_generated
Feature: Completions - Methods
  Background:
    Given the project is named "cli-generated"
    And I open VSCode with the following file "view-model-test.html"

  # @focus
  Scenario Outline: Completions of class methods - empty brackets
    Given I'm replacing the file content with <CODE>
    And I'm on the line <LINE> at character <CODE>
    When I trigger Suggestions
    Then I should get the correct method <METHOD_NAME> with brackets

    Examples:
      | LINE | CODE                        | METHOD_NAME      |
      | 0    | `<div if.bind="f\|"></div>` | functionVariable |

  # @focus
  Scenario Outline: Completions of class methods - argument completed
    Given I'm replacing the file content with <CODE>
    And I'm on the line <LINE> at character <CODE>
    When I trigger Suggestions
    Then I should get the correct method <METHOD_NAME> with its arguments

    Examples:
      | LINE | CODE                        | METHOD_NAME    |
      | 0    | `<div if.bind="f\|"></div>` | methodWithArgs |