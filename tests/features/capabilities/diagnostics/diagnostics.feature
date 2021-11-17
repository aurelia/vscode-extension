Feature: Diagnostics.
#   Background:
#     Given the project is named "scoped-for-testing"
#     And I open VSCode with the following file "view-diagnostics.html"

#   Scenario Outline: Diagnostics view.
#     Given I'm on the line <LINE> at character <CODE>
#     Then the following <DIAGNOSTIC> should show up

#     Examples:
#       | LINE | CODE                  | DIAGNOSTIC |
#       | 3    | `\|<p id.bind=""></p` | hello      |
