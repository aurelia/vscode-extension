@scoped_for_testing
Feature: When completions should trigger.
  Background:
    Given the project is named "scoped-for-testing"
    And I open VSCode with the following file "empty-view.html"

  Scenario Outline: When completions should trigger.
    Given I'm replacing the file content with <CODE>
    And I'm on the line <LINE> at character <CODE>
    When I trigger Suggestions with <TRIGGER_CHARACTER>
    Then I should get the correct suggestions <SUGGESTION>

    Examples:
      | DESCRIPTION                | LINE | CODE                                              | SUGGESTION     | TRIGGER_CHARACTER |
      | HTML Text trigger CE (not) | 0    | `<p><\|${pub}</p>`                                |                |                   |
      | HTML Text trigger CE       | 0    | `<p><\|_${pub}</p>`                               | custom-element |                   |
      | HTML Text trigger CE       | 0    | `<p>${pub}<\|</p>`                                | custom-element |                   |
      | Comment                    | 0    | `<!-- \|-->`                                      |                |                   |
      | Aurelia Keyword            | 0    | `<p \|></p>`                                      | if.bind        | ' '               |
      | Aurelia Keyword            | 0    | `<p s\|></p>`                                     | show.bind      | s                 |
      | HTML Attributes            | 0    | `<p \|></p>`                                      | aria-checked   | ' '               |
      | Attribute Value            | 0    | `<p id="\|"></p>`                                 |                |                   |
      | Attribute Interpolation    | 0    | `<p id="${\|}"></p>`                              | readOnly       |                   |
      | Attribute - .bind          | 0    | `<p id.bind="\|"></p>`                            | readOnly       |                   |
      | Bindable Attr - Empty ""   | 0    | `<custom-element foo="$\|"></custom-element>`     |                |                   |
      | Bindable Attr - .bind      | 0    | `<custom-element foo.bind="\|"></custom-element>` | readOnly       |                   |
      | Bindable Attr - Interpol   | 0    | `<custom-element foo="${\|}"></custom-element>`   | readOnly       |                   |
      | Bindable Attr - Interpol   | 0    | `<custom-element foo="${r\|}"></custom-element>`  | readOnly       |                   |
