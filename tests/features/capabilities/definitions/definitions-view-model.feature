@scoped_for_testing
Feature: Definition in View Model
  Background:
    Given the project is named "scoped-for-testing"

@focus
  Scenario Outline: Variable in View Model
    And I open VSCode with the following file "custom-element.ts"
    And I'm on the line <LINE> at character <CODE>
    When I execute Go To Definition
    Then I should land in the file <TARGET_FILE_NAME>

    Examples:
      | DESCRIPTION        | LINE | CODE                 | TARGET_FILE_NAME    |
      | Text Interploation | 3    | `  @bindable \|bar;` | custom-element.html |
