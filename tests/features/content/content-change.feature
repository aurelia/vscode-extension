Feature: Content change on open

  @focus
  Scenario: Prevent hydration for file in project, that is already hydrated
    Given the project is named "cli-generated"
    And I open VSCode with the following file "minimal-component.ts"
    When I open the file "tsconfig.json"
    Then the extension should not rehydrate