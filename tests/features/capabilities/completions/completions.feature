@cli_generated
Feature: Completions.
  Background:
    Given the project is named "cli-generated"
    And I open VSCode with the following file "minimal-component.html"

  Scenario Outline: View Model.
    Given I'm replacing the file content with <CODE>
    And I'm on the line <LINE> at character <CODE>
    When I trigger Suggestions with <TRIGGER_CHARACTER>
    Then I should get the correct suggestions <SUGGESTION>

    Examples:
      | DESCRIPTION                 | LINE | CODE                                           | SUGGESTION          | TRIGGER_CHARACTER |
      | Attribute (Std HTML)        | 0    | `<div \|></div>`                               | class               | ' '               |
      | Attribute                   | 0    | `<div click.delegate="\|"></div>`              | minimalVar          | "                 |
      | Attribute Interplolation    | 0    | `<div class="${m\|}"></div>`                   | minimalVar          |                   |
      | Attribute Interplolation    | 0    | `<div css="width: ${m\|}px;"></div>`           | minimalVar          |                   |
      | Attribute (object)          | 0    | `<div if.bind="minimalInterfaceVar.\|"></div>` | field               | .                 |
      | Custom element              | 0    | `<div></div><\|`                               | compo-user          | <                 |
      | Repeat For                  | 0    | `<p repeat.for=" \|of "></p>`                  | minimalVar          | <                 |
      | Repeat For                  | 0    | `<p repeat.for=" of \|"></p>`                  | minimalVar          | <                 |
      | Text Interplolation         | 0    | `foo ${\|}<p></p>`                             | minimalVar          |                   |
      | Text Interplolation         | 0    | `${'foo'} ${\|}<p></p>`                        | minimalVar          |                   |
      | Text Interplolation         | 0    | `${minimalVar} ${\|}<p></p>`                   | minimalVar          |                   |
      | Text Interplolation         | 0    | `${'foo'} ${\|} bar<p></p>`                    | minimalVar          |                   |
      | Text Interplolation         | 0    | `${'foo'} ${ \|} bar<p></p>`                   | minimalVar          |                   |
      | Text Interplolation         | 0    | `<div>${minimalI\|}</div>`                     | minimalInterfaceVar | .                 |
      | Text Inpol - Methods on var | 0    | `${minimalVar.\|}<p>${minimalVar}</p>`         | toLowerCase         | .                 |
      | Text Inpol - Methods on var | 0    | `<p>${minimalVar}</p>${minimalVar.\|}<p></p>`  | toLowerCase         | .                 |
      | Text Inpol - Object         | 0    | `<div>${minimalInterfaceVar.\|}</div>`         | field               | .                 |
      | Text Inpol - Same part name | 0    | `<p>${inter.\|}</p>`                           | interA              |                   |
      | Text Inpol - Same part name | 0    | `<p>${inter.interA.\|}</p>`                    | Binter              |                   |
      | Text Inpol - Same part name | 0    | `<p>${inter.interA.Binter.\|}</p>`             | toPrecision         |                   |
      | Bindable Attribute          | 0    | `<my-compo \|></my-compo>`                     | string-bindable     | ' '               |
      | Aurelia Attribute Keywords  | 0    | `<div \|></div>`                               | if.bind             | ' '               |