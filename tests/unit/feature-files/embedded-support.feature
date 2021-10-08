Feature: Embedded support
  Background:
    Given I'm in the project "scoped-for-testing"

  Scenario: Parsing - Custom Element - Bindable Attribute
    When I parse the file "custom-element-user.html"
    Then the result should include Custom element bindable attributes

  Scenario Outline: Parsing - Offsets
    When I parse the file "custom-element.html"
    And I'm on line <LINE>
    Then the result should have the correct <START_OFFSET> and <END_OFFSET> for the whole region
    And the result should have the correct <REGION_VALUE_START_OFFSET> and <REGION_VALUE_END_OFFSET> for the region value

    Examples:
      | DESCRIPTION        | CODE     | REGION_VALUE | START_OFFSET | END_OFFSET | REGION_VALUE_START_OFFSET | REGION_VALUE_END_OFFSET | LINE |
      | Text Interpolation | `${foo}` | foo          | 2            | 6          | 2                         | 6                       | 1    |
# | Attribute Interpolation | `<div id="${foo}"></div>`                    | foo          | 0            | 0          | 0                         | 0                       | 1    |
# | Attribute               | `<div id.bind="foo"></div>`                  | foo          | 0            | 0          | 0                         | 0                       | 2    |
# | Repeat For              | `<div repeat.for="fooElement of foo"></div>` | foo          | 0            | 0          | 0                         | 0                       | 3    |

