@scoped_for_testing
Feature: Definition in View Model.
  Background:
    Given the project is named "scoped-for-testing"

  Scenario Outline: Variable in View Model.
    And I open VSCode with the following file "custom-element.ts"
    And I'm on the line <LINE> at character <CODE>
    When I execute Go To Definition
    Then I should land in the file <TARGET_FILE_NAME>
    And the number of definitions should be <NUM_DEFINTIONS>

    Examples:
      | DESCRIPTION    | LINE | CODE                                          | NUM_DEFINTIONS | TARGET_FILE_NAME         |
      | Bindable       | 1    | `export class \|CustomElementCustomElement {` | 9              | custom-element-user.html |
      | Bindable       | 2    | `  @bindable \|foo;`                          | 10             | custom-element.html      |
      | Bindable       | 3    | `  @bindable \|barBaz;`                       | 5              | custom-element.html      |
      | Class Variable | 4    | `  \|qux;`                                    | 4              | custom-element.html      |

  Scenario Outline: Not triggering
    And I open VSCode with the following file "custom-element-user.ts"
    And I'm on the line <LINE> at character <CODE>
    When I execute Go To Definition
    And the number of definitions should be <NUM_DEFINTIONS>

    Examples:
      | DESCRIPTION | LINE | CODE                                                               | NUM_DEFINTIONS |
      | Bindable    | 0    | `import { CustomElementCustomElement } from './\|custom-element';` | 0              |
      | Bindable    | 10   | `    this.\|quxUser`                                                 | 0              |
