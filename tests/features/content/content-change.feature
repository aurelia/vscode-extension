@cli_generated
Feature: Content change on open

  Background:
    Given the project is named "cli-generated"
    And I open VSCode with the following file "minimal-component.ts"

  Scenario: Prevent hydration for file in project, that is already hydrated
    When I open the file "tsconfig.json"
    Then the extension should not rehydrate

  Scenario: Rehydrate on file changed
    When I change the file "minimal-component.ts"
    Then the extension should rehydrate