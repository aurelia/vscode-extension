@cli_generated
Feature: Completions.
  Background:
    Given the project is named "cli-generated"
    And I open VSCode with the following file "minimal-component.html"

  Scenario Outline: View Model.
    Given I'm replacing the file content with <CODE>
    And I'm on the line <LINE> at character <CODE>
    When I trigger Suggestions
    Then I should get the correct suggestions <SUGGESTION>

    Examples:
      | DESCRIPTION                  | LINE | CODE                                           | SUGGESTION      |
      | Attribute (Std HTML)         | 0    | `<div \|></div>`                               | class           |
      | Attribute                    | 0    | `<div click.delegate="\|"></div>`              | minimalVar      |
      | Attribute Interplolation     | 0    | `<div class="${m\|}"></div>`                   | minimalVar      |
      | Attribute Interplolation     | 0    | `<div css="width: ${m\|}px;"></div>`           | minimalVar      |
      | Attribute (object)           | 0    | `<div if.bind="minimalInterfaceVar.\|"></div>` | field           |
      | Custom element               | 0    | `<div></div><\|`                               | compo-user      |
      | Text Interplolation          | 0    | `foo ${\|}<p></p>`                             | minimalVar      |
      | Text Interplolation (object) | 0    | `<div>${minimalInterfaceVar.\|}</div>`         | field           |
      | Bindable Attribute           | 0    | `<my-compo \|></my-compo>`                     | string-bindable |
      | Aurelia Attribute Keywords   | 0    | `<div \|></div>`                               | if.bind         |