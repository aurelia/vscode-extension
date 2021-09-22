Feature: Completions
  Background:
    Given the project is named "cli-generated"
    And I open VSCode with the following file "minimal-component.html"

  # @focus
  Scenario Outline: View Model - without Trigger Character
    Given I'm replacing the file content with <CODE>
    And I'm on the line <LINE> at character <CODE>
    When I trigger Suggestions
    Then I should get the correct suggestions

    Examples:
      | LINE | CODE                              |
      | 0    | `<div click.delegate="\|"></div>` |
  # | 0    | `<div class="${m\|}"></div>`      |
  # | 0    | `<div css="width: ${m\|}px;"></div>` |

  # @focus
  Scenario Outline: View Model - with Trigger Character
    Given I'm replacing the file content with <CODE>
    And I'm on the line <LINE> at character <CODE>
    When I trigger Suggestions
    Then I should get the correct suggestions

    Examples:
      | LINE | CODE                                         |
      | 0    | `<div></div><\|` |
      # | 0    | `<div if.bind="minimalInterfaceVar.\|"></div>` |
      # | 0    | `<minimal-component \|></minimal-component>` |
# TODO: Aurelia Attribute Keywords | 0    | `<div \|></div>` |