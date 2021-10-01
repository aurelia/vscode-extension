Feature: Rename
  Scenario Outline: Rename

    Given the project is named "scoped-for-testing"
    And I open VSCode with the following file "custom-element-user.html"
    And I'm on the line <LINE> at character <CODE>
    When I trigger rename

    Examples:
      | DESCRIPTION | LINE | CODE                              |
      # | View model  | 20    | `    \|foo.bind=""` |
      | View model  | 3    | `    \|foo.bind=""` |
