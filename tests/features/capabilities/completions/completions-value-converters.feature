Feature: Completions - Value converters
  Background:
    Given the project is named "cli-generated"
    And I open VSCode with the following file "minimal-component.html"

  # @focus
  Scenario Outline: Completions for Value converters
    Given I'm replacing the file content with <CODE>
    And I'm on the line <LINE> at character <CODE>
    When I trigger Suggestions with <TRIGGER_CHARACTER>
    Then I should get the correct suggestions for Value converters

    Examples:
      | LINE | CODE                               | TRIGGER_CHARACTER |
      | 0    | `<div if.bind="m \|>>\|<<"></div>` | \|                |
