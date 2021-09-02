@math
# Some comment
Feature: using feature files in jest
  As a developer
  I want to write tests in cucumber
  So that the business can understand my tests

  # Bar
  Background: Calculator
    Given I can calculate

  @addition
  Scenario: A simple addition test
    Given I have the following numbers:
      | a | b |
      | 3 | 4 |
    When I add the numbers
    And I do nothing
    Then I get
      """
      7
      """

  @multiplication
  # Foo
  Scenario: A simple multiplication test
    Given I have numbers 3 and 4
    When I multiply the numbers
    Then I get 12

  @substraction
  Scenario Outline: A simple subtraction test
    Given I have numbers <num1> and <num2>
    When I subtract the numbers
    Then I get <total>

    Examples:
      | num1 | num2 | total |
      | 3    | 4    | -1    |
      | 10   | 2    | 8     |
