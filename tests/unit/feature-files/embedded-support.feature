Feature: Embedded support
  Background:
    Given I'm in the project "scoped-for-testing"

  Scenario: Parsing - Import
    When I parse the file "other-custom-element-user.html"
    Then the result should include import tags

  Scenario: Parsing - Custom Element - Bindable Attribute
    When I parse the file "other-custom-element-user.html"
    Then the result should include Custom element bindable attributes

  Scenario: Parsing - Custom Element - Whole Opening Tag
    When I parse the file "other-custom-element-user.html"
    Then the result should include Custom element opening tag

  Scenario: Parsing - Custom Element - Opening Tag name
    When I parse the file "other-custom-element-user.html"
    Then the result should include Custom element opening tag

  Scenario: Parsing - Custom Element - Closing Tag name
    When I parse the file "other-custom-element-user.html"
    Then the result should include Custom element closing tag

  Scenario Outline: Parsing - Offsets
    When I parse the file "custom-element.html"
    And I'm on line <LINE>
    Then the result should have the correct <START_OFFSET> and <END_OFFSET> for the whole region

    Examples:
      | DESCRIPTION             | LINE | CODE                                         | REGION_VALUE | START_OFFSET | END_OFFSET |
      | Text Interpolation      | 0    | `${foo}`                                     | foo          | 2            | 6          |
      | Attribute Interpolation | 1    | `<div id="${foo}"></div>`                    | foo          | 18           | 21         |
      | Attribute               | 2    | `<div id.bind="bar"></div>`                  | foo          | 45           | 49         |
      | Repeat For              | 3    | `<div repeat.for="fooElement of foo"></div>` | foo          | 88           | 92         |
  # TODO: replace parse5 with htmlparser2 (parse5 not uptodate, and bug with this case | Text Interpolation      | `${foo.qux}`                                     | foo          | 2            | 6          | 6    |

  Scenario Outline: Parsing - Access Scopes
    When I parse the file "custom-element.html"
    And I'm on line <LINE>
    Then the result should have the following Access scopes <ACCESS_SCOPES>
    And the result should have the correct <START> and <END> scope location

    Examples:
      | DESCRIPTION             | LINE | CODE                                                | ACCESS_SCOPES      | START           | END             |
      | Text Interpolation      | 0    | `${foo}`                                            | foo                | 2               | 5               |
      | Attribute Interpolation | 1    | `<div id="${foo}"></div>`                           | foo                | 18              | 21              |
      | Attribute               | 2    | `<div id.bind="bar"></div>`                         | bar                | 45              | 48              |
      | Many                    | 4    | `<span id.bind="qux.attr">${qux.interpol}</span>`   | qux;qux            | 115;127         | 118;130         |
      | Many                    | 5    | `<p class="${useFoo(qux)}">${arr[qux] \|hello}</p>` | useFoo,qux;arr,qux | 160,167;176,180 | 166,170;179,183 |
