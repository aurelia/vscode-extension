@scoped_for_testing
Feature: Definition in View Model.
  Background:
    Given the project is named "scoped-for-testing"

  Scenario Outline: Variable in View Model.
    And I open VSCode with the following file "custom-element.ts"
    And I'm on the line <LINE> at character <CODE>
    When I execute Go To Definition
    Then I should land in the file <TARGET_FILE_NAME>
    And the number of defintions should be <NUM_DEFINTIONS>

    Examples:
      | DESCRIPTION    | LINE | CODE                                          | NUM_DEFINTIONS | TARGET_FILE_NAME         |
      | Bindable       | 1    | `export class \|CustomElementCustomElement {` | 17             | custom-element-user.html |
      | Bindable       | 2    | `  @bindable \|foo;`                          | 11             | custom-element.html      |
      | Bindable       | 3    | `  @bindable \|bar;`                          | 6              | custom-element.html      |
      | Class Variable | 4    | `  \|qux;`                                    | 5              | custom-element.html      |
      | Class Member   | 7    | `    this.\|foo;`                             | 1              | custom-element.ts        |
