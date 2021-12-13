@scoped_for_testing
Feature: Completions.
  Background:
    Given the project is named "scoped-for-testing"
    And I open VSCode with the following file "empty-view.html"

  @focus
  Scenario Outline: When completions should trigger
    Given I'm replacing the file content with <CODE>
    And I'm on the line <LINE> at character <CODE>
    When I trigger Suggestions with <TRIGGER_CHARACTER>
    Then I should get the correct suggestions <SUGGESTION>

    Examples:
      | DESCRIPTION                        | LINE | CODE                                              | SUGGESTION   | TRIGGER_CHARACTER |
      | Comment                            | 0    | `<!-- \|-->`                                      |              |                   |
      | Aurelia Keyword                    | 0    | `<p \|></p>`                                      | if.bind      | ' '               |
      | Aurelia Keyword                    | 0    | `<p s\|></p>`                                     | show.bind    | s                 |
      | HTML Attributes                    | 0    | `<p \|></p>`                                      | aria-checked | ' '               |
      | Attribute Value                    | 0    | `<p id="\|"></p>`                                 |              |                   |
      | Attribute Interpolation            | 0    | `<p id="${\|}"></p>`                              | readOnly     |                   |
      | Attribute - .bind                  | 0    | `<p id.bind="\|"></p>`                            | readOnly     |                   |
      | Bindable Attribute - Empty ""      | 0    | `<custom-element foo="$\|"></custom-element>`     |              |                   |
      | Bindable Attribute - .bind         | 0    | `<custom-element foo.bind="\|"></custom-element>` | readOnly     |                   |
      | Bindable Attribute - Interpolation | 0    | `<custom-element foo="${\|}"></custom-element>`   | readOnly     |                   |
      | Bindable Attribute - Interpolation | 0    | `<custom-element foo="${r\|}"></custom-element>`  | readOnly     |                   |