Feature: Content change on open

  @focus
  Scenario: Prevent hydration for file in project, that is already hydrated
    Given the project is named "cli-generated"
    And I open VSCode with no active files
    When I open the file "filename"
    Then the extension should not rehydrate