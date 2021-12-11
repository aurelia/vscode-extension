@scoped_for_testing
Feature: Completions.
  Background:
    Given the project is named "scoped-for-testing"
    And I open VSCode with the following file "empty-view.html"

  Scenario Outline: Aurelia key words.
    Given I'm replacing the file content with <CODE>
    And I'm on the line <LINE> at character <CODE>
    When I trigger Suggestions with ''
    Then I should get the correct suggestions <SUGGESTION>

    Examples:
      | DESCRIPTION | LINE | CODE | SUGGESTION |
      | import      | 0    | `\|` | import     |

  Scenario Outline: Constructor arguments
    Given I'm replacing the file content with <CODE>
    And I'm on the line <LINE> at character <CODE>
    When I trigger Suggestions with ''
    Then I should get the correct suggestions <SUGGESTION>

    Examples:
      | DESCRIPTION | LINE | CODE           | SUGGESTION |
      | Private     | 0    | `${\|}<p></p>` | pri        |
      | Public      | 0    | `${\|}<p></p>` | pub        |
      | Protected   | 0    | `${\|}<p></p>` | prot       |
      | Readonly    | 0    | `${\|}<p></p>` | readOnly   |