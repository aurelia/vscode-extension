@cli_generated
Feature: Definition in View.
  Background:
    Given the project is named "cli-generated"
    And I open VSCode with the following file "compo-user.html"

  Scenario Outline: Custom Element.
    Given I'm on the line <LINE> at character <CODE>
    When I execute Go To Definition
    Then I should land in the file <TARGET_FILE_NAME>

    Examples:
      | DESCRIPTION             | LINE | CODE                                              | TARGET_FILE_NAME |
      | Attribute               | 7    | `  <div click.delegate="\|increaseCounter()">`    | compo-user.ts    |
      | Attribute interpolation | 11   | `  <div css="width: ${\|message}px;"></div>`      | compo-user.ts    |
      | Custom Element          | 15   | `  <\|my-compo></my-compo>`                       | my-compo.ts      |
      | Text interpolation      | 26   | `  ${} ${\|grammarRules.length}`                  | compo-user.ts    |
      | Attribute               | 29   | `    <label repeat.for="\|rule of grammarRules">` | compo-user.ts    |
      | Attribute               | 29   | `    <label repeat.for="rule of \|grammarRules">` | compo-user.ts    |
      | Text interpolation      | 32   | `      ${\|rule.id}-${rule.saying}`               | compo-user.html  |

  # TODO: after refac to bindable attributes | Bindable Attribute           | 20   | `            \|inter-bindable.bind="increaseCounter()"` | my-compo.ts      |
  # TODO: after refac to bindable attributes | Bindable Attribute           | 21   | `            \|string-bindable.bind="grammarRules"` | my-compo.ts      |


  Scenario Outline: Value Converter.
    Given I'm on the line <LINE> at character <CODE>
    When I execute Go To Definition
    Then I should land in the file <TARGET_FILE_NAME>

    Examples:
      | LINE | CODE                                                                                      | TARGET_FILE_NAME        |
      | 47   | `        repeat.for="repo of repos \|>>\|<<sort:column.value:direction.value \|take:10">` | sort-value-converter.ts |
# TODO auvsc(7001) | 47   | `        repeat.for="repo of repos \| sort:column.value:direction.value \| >>\|<<take:10">` | sort-value-converter.ts |
