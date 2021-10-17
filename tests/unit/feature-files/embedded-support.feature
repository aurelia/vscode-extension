Feature: Embedded support
  Background:
    Given I'm in the project "scoped-for-testing"

  Scenario: Parsing - Custom Element - Bindable Attribute
    When I parse the file "custom-element-user.html"
    Then the result should include Custom element bindable attributes

  Scenario: Parsing - Custom Element - Closing Tag
    When I parse the file "other-custom-element-user.html"
    Then the result should include Custom element closing tag

  Scenario Outline: Parsing - Offsets
    When I parse the file "custom-element.html"
    And I'm on line <LINE>
    Then the result should have the correct <START_OFFSET> and <END_OFFSET> for the whole region

    Examples:
      | DESCRIPTION             | CODE                                         | REGION_VALUE | START_OFFSET | END_OFFSET | LINE |
      | Text Interpolation      | `${foo}`                                     | foo          | 2            | 6          | 1    |
      | Attribute Interpolation | `<div id="${foo}"></div>`                    | foo          | 18           | 22         | 2    |
      | Attribute               | `<div id.bind="foo"></div>`                  | foo          | 45           | 49         | 3    |
      | Repeat For              | `<div repeat.for="fooElement of foo"></div>` | foo          | 88           | 92         | 4    |

