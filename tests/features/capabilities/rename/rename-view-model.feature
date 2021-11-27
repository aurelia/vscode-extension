@scoped_for_testing
Feature: Rename in View Model.
  Background:
    Given the project is named "scoped-for-testing"

  Scenario Outline: Variable in View Model.
    And I open VSCode with the following file "custom-element.ts"
    And I'm on the line <LINE> at character <CODE>
    When I trigger Rename to <NEW_WORD>
    Then the View model variable should be renamed
    And all other components <NUM_OTHER_COMPONENTS>
    And only the Access scope should be renamed <SCOPE_START> <SCOPE_END>

    Examples:
      | DESCRIPTION | LINE | CODE                 | NEW_WORD | NUM_OTHER_COMPONENTS | SCOPE_START | SCOPE_END |
      | Bindable    | 2    | `  @bindable \|foo;` | newNew   | 5                    | 2           | 5         |
      | Variable    | 4    | `  \|qux`            | newNew   | 2                    | 15          | 18        |
      | Method      | 6    | `  \|useFoo() {`     | newNew   | 2                    | 12          | 18        |

  Scenario Outline: Class in View Model.
    And I open VSCode with the following file "custom-element.ts"
    And I'm on the line <LINE> at character <CODE>
    When I trigger Rename to <NEW_WORD>
    Then the View model class should be renamed
    And all other components, that also use the Custom Element should be renamed

    Examples:
      | DESCRIPTION        | LINE | CODE                                          | NEW_WORD |
      | Text Interploation | 1    | `export class \|CustomElementCustomElement {` | new-new  |

