Feature: Definition in View - index.ts
  Background:
    Given the project is named "cli-generated"
    And I open VSCode with the following file "realdworld-advanced/settings/index.html"

  @focus
  Scenario Outline: View model of components with index.ts
    Given I'm on the line <LINE> at character <CODE>
    When I execute Go To Definition on <TARGET_WORD>
    Then I should land in the view model <TARGET_FILE_NAME>

    Examples:
      | LINE | CODE                                                             | TARGET_WORD | TARGET_FILE_NAME                      |
      | 3    | `      <h1 class="text-xs-center ${\|dirty}">Your Settings</h1>` | dirty       | realdworld-advanced/settings/index.ts |
