@scoped_for_testing
Feature: Rename in View

  Scenario Outline: Normal rename
    Given the project is named "scoped-for-testing"
    And I open VSCode with the following file "other-custom-element-user.html"
    And I'm on the line <LINE> at character <CODE>
    When I trigger Rename to <NEW_WORD>
    Then the View model variable should be renamed
    And all other components, that also use the Bindable should be renamed

    Examples:
      | DESCRIPTION | LINE | CODE          | NEW_WORD |
      | View model  | 5    | `    \|id=""` | new-new   |

  @focus
  Scenario Outline: Rename Bindable attribute
    Given the project is named "scoped-for-testing"
    And I open VSCode with the following file "other-custom-element-user.html"
    And I'm on the line <LINE> at character <CODE>
    When I trigger Rename to <NEW_WORD>
    Then the View model variable should be renamed
    And all other components, that also use the Bindable should be renamed

    Examples:
      | DESCRIPTION | LINE | CODE                | NEW_WORD |
      # | View model  | 20    | `    \|foo.bind=""` | newnew |
      | View model  | 3    | `    \|foo.bind=""` | new-new   |
