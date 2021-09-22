Feature: Definition in View
  Background:
    Given the project is named "cli-generated"
    And I open VSCode with the following file "compo-user.html"

  # @focus
  Scenario Outline: Custom Element
    Given I'm on the line <LINE> at character <CODE>
    When I execute Go To Definition on <TARGET_WORD>
    Then I should land in the view model <TARGET_FILE_NAME>

    Examples:
      | LINE | CODE                                                    | TARGET_WORD     | TARGET_FILE_NAME |
      | 7    | `  <div click.delegate="\|increaseCounter()">`          | increaseCounter | compo-user.ts    |
      # | 11   | `  <div css="width: ${\|message}px;"></div>`            | message         | compo-user.ts    |
      # | 15   | `  <\|my-compo></my-compo>`                             | my-compo        | my-compo.ts      |
      # | 20   | `            \|inter-bindable.bind="increaseCounter()"` | inter-bindable  | my-compo.ts      |
      # | 21   | `            \|string-bindable.bind="grammarRules"`     | string-bindable | my-compo.ts      |
      # | 26   | `  ${} ${\|grammarRules.length}`                        | grammarRules    | compo-user.ts    |
      # | 29   | `    <label repeat.for="\|rule of grammarRules">`       | rule            | compo-user.ts    |
      # | 29   | `    <label repeat.for="rule of \|grammarRules">`       | grammarRules    | compo-user.ts    |
      # | 32   | `      ${\|rule.id}-${rule.saying}`                     | rule            | compo-user.html  |


  # @focus
  Scenario Outline: Value Converter
    Given I'm on the line <LINE> at character <CODE>
    When I execute Go To Definition on <TARGET_WORD>
    Then I should land in the view model <TARGET_FILE_NAME>

    Examples:
      | LINE | CODE                                                                                      | TARGET_WORD | TARGET_FILE_NAME        |
      | 47   | `        repeat.for="repo of repos \|>>\|<<sort:column.value:direction.value \|take:10">` | sort        | sort-value-converter.ts |
# TODO auvsc(7001) | 47   | `        repeat.for="repo of repos \| sort:column.value:direction.value \| >>\|<<take:10">` | sort        | sort-value-converter.ts |
