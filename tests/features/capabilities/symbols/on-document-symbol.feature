@scoped_for_testing
Feature: Document symbol
  Background:
    Given the project is named "scoped-for-testing"
    And I open VSCode with the following file "custom-element.html"

  Scenario Outline: Scenario Outline name
    Given I'm on the line <LINE> at character <CODE>
    When I execute Document symbols
    Then I should get <NUM_SYMBOLS> of symbols

    Examples:
      | Description | LINE | CODE       | TARGET_FILE_NAME                      |
      |             | 1    | `\|${foo}` | realdworld-advanced/settings/index.ts |

