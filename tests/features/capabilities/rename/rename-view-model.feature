@scoped_for_testing
Feature: Rename in View Model
  Background:
    Given the project is named "scoped-for-testing"

  Scenario Outline: Variable in View Model
    And I open VSCode with the following file "custom-element.ts"
    And I'm on the line <LINE> at character <CODE>
    When I trigger Rename to <NEW_WORD>
    Then the View model variable should be renamed
    And all other components, that also use the Bindable should be renamed

    Examples:
      | DESCRIPTION        | LINE | CODE                 | NEW_WORD |
      | Text Interploation | 2    | `  @bindable \|foo;` | newNew  |

  Scenario Outline: Class in View Model
    And I open VSCode with the following file "custom-element.ts"
    And I'm on the line <LINE> at character <CODE>
    When I trigger Rename to <NEW_WORD>
    Then the View model class should be renamed
    And all other components, that also use the Custom Element should be renamed

    Examples:
      | DESCRIPTION        | LINE | CODE                                          | NEW_WORD |
      | Text Interploation | 1    | `export class \|CustomElementCustomElement {` | new-new  |

