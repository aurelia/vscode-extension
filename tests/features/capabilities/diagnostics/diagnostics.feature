@scoped_for_testing
Feature: Diagnostics.
  Background:
    Given the project is named "scoped-for-testing"
    And I open VSCode with the following file "view-diagnostics.html"

  Scenario Outline: Diagnostics view.
    Given I'm on the line <LINE> at character <CODE>
    When I run Diagnostics for the active file
    Then the following <DIAGNOSTIC> should show up

    Examples:
      | LINE | CODE                                                   | DIAGNOSTIC                                                                         |
      | 1    | `<require from='../does-not/exist-sorry\|'></require>` | File path does not exist.                                                          |
      | 8    | `  \|fooxbar.from-view="privateService.forbidden"`     | Not found. No such bindable: 'fooxbar'                                             |
      | 8    | `  fooxbar.from-view="\|privateService.forbidden"`     | Property 'forbidden' is private and only accessible within class 'PrivateService'. |
      | 9    | `  \|fooBar.from-view="privateService.forbidden"`      | Invalid casing. Did you mean: 'foo-bar'?                                           |
      | 9    | `  fooBar.from-view="\|privateService.forbidden"`      | Property 'forbidden' is private and only accessible within class 'PrivateService'. |
      | 16   | `<\|empty-view></empty-view>`                          | No local import found.                                                             |
