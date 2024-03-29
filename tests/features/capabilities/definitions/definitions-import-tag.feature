@scoped_for_testing
Feature: Definitions in View.
  Background:
    Given the project is named "scoped-for-testing"

  Scenario Outline: Bindable Attribute
    And I open VSCode with the following file "stage4.html"
    And I'm on the line <LINE> at character <CODE>
    When I execute Go To Definition
    Then I should land in the file <TARGET_FILE_NAME>
    And the number of definitions should be <NUM_DEFINTIONS>

    Examples:
      | DESCRIPTION | LINE | CODE                                                          | NUM_DEFINTIONS | TARGET_FILE_NAME |
      | Import      | 2    | `    \|output-as-string="true"`                               | 1              | numericInput.ts  |
      | Import      | 4    | `    value.bind="\|launchConfig.launchDetails.pricePerToken"` | 1              | stage4.ts        |

  Scenario Outline: Import tag.
    And I open VSCode with the following file "other-custom-element-user.html"
    And I'm on the line <LINE> at character <CODE>
    When I execute Go To Definition
    Then I should land in the file <TARGET_FILE_NAME>
    And the number of definitions should be <NUM_DEFINTIONS>

    Examples:
      | DESCRIPTION | LINE | CODE                                            | NUM_DEFINTIONS | TARGET_FILE_NAME  |
      | Import      | 1    | `  <import from="\|./custom-element"></import>` | 1              | custom-element.ts |
# | Import      | 2    | `  <import from="\|./custom-element.html"></import>` | 1              | custom-element.html |
