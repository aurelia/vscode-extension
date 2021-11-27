@cli_generated
Feature: Completions - Value converters
  Background:
    Given the project is named "cli-generated"
    And I open VSCode with the following file "minimal-component.html"

  Scenario Outline: Completions for Value converters
    Given I'm replacing the file content with <CODE>
    And I'm on the line <LINE> at character <CODE>
    When I trigger Suggestions
    Then I should get the correct Value converters suggestions

    Examples:
      | LINE | CODE                               |
      | 0    | `<div if.bind="m \|>>\|<<"></div>` |
