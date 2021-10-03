@cli_generated
Feature: Hover in View
  Background:
    Given the project is named "cli-generated"
    And I open VSCode with the following file "compo-user.html"

  Scenario Outline: Custom Element
    Given I'm on the line <LINE> at character <CODE>
    When I execute Hover
    Then I should see hover details

    Examples:
      | DESCRIPTION             | LINE | CODE                                           | TARGET_FILE_NAME |
      | Attribute               | 7    | `  <div click.delegate="\|increaseCounter()">` | compo-user.ts    |
      | Attribute interpolation | 11   | `  <div css="width: ${\|message}px;"></div>`   | compo-user.ts    |
      # TODO | Custom Element | 15   | `  <\|my-compo></my-compo>` | my-compo.ts      |
      # TODO | Attribute (Bindable)           | 20   | `            \|inter-bindable.bind="increaseCounter()"` | my-compo.ts      |
      # TODO| Attribute (Bindable)    | 21   | `            \|string-bindable.bind="grammarRules"` | my-compo.ts      |
      | Text interpolation      | 26   | `  ${} ${\|grammarRules.length}`               | compo-user.ts    |
      # TODO | Attribute        | 29   | `    <label repeat.for="\|rule of grammarRules">`       | compo-user.ts    |
      # TODO | Attribute   | 29   | `    <label repeat.for="rule of \|grammarRules">` | compo-user.ts    |
      | Text interpolation      | 32   | `      ${\|rule.id}-${rule.saying}`            | compo-user.html  |
