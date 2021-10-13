@scoped_for_testing
Feature: Rename in View
  Background:
    Given the project is named "scoped-for-testing"

  Scenario Outline: Normal rename
    And I open VSCode with the following file "other-custom-element-user.html"
    And I'm on the line <LINE> at character <CODE>
    When I trigger Rename to <NEW_WORD>
    Then the word should be renamed

    Examples:
      | DESCRIPTION      | LINE | CODE          | NEW_WORD |
      | Normal Attribute | 5    | `    \|id=""` | new-new  |

  @focus
  Scenario Outline: Rename Bindable attribute
    And I open VSCode with the following file "other-custom-element-user.html"
    And I'm on the line <LINE> at character <CODE>
    When I trigger Rename to <NEW_WORD>
    Then the View model variable should be renamed
    And all other components, that also use the Bindable should be renamed

    Examples:
      | DESCRIPTION        | LINE | CODE                | NEW_WORD |
      | Bindable Attribute | 3    | `    \|foo.bind=""` | new-new  |

  Scenario Outline: Rename variable in View
    And I open VSCode with the following file "custom-element.html"
    And I'm on the line <LINE> at character <CODE>
    When I trigger Rename to <NEW_WORD>
    Then the View model variable should be renamed
    And all other components, that also use the Bindable should be renamed

    Examples:
      | DESCRIPTION        | LINE | CODE                                           | NEW_WORD |
      | Text Interploation | 0    | `${\|foo}`                                     | new-new  |
      | View model         | 1    | `<div id="${\|foo}"></div>`                    | new-new  |
      | View model         | 2    | `<div id.bind="\|foo"></div>`                  | new-new  |
      | View model         | 3    | `<div repeat.for="fooElement of \|foo"></div>` | new-new  |
