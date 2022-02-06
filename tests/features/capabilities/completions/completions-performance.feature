@scoped_for_testing
Feature: Completions performance.
  Background:
    Given the project is named "scoped-for-testing"
    And I open VSCode with the following file "empty-view.html"

  Scenario Outline: Completions performance.
    Given I'm replacing the file content with <CODE>
    And I'm on the line <LINE> at character <CODE>
    When I trigger Suggestions by typing <TRIGGER_CHARACTER>
    Then I should get the correct suggestions <SUGGESTION>

    Examples:
      | DESCRIPTION                        | LINE | CODE                | SUGGESTION | TRIGGER_CHARACTER |
      | Text should trigger Custom Element | 0    | `<p>${\|${pub}</p>` | pri           | {                 |
      # | Text should trigger Custom Element | 0    | `<p>${\|${pub}</p>` |            | {                 |
      # ^ TODO Should be 0 suggestions
