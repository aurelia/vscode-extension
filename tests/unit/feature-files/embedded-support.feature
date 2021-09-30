Feature: Embedded support

    Scenario: Parsing - Custom Element - Bindable Attribute
      Given I'm in the project "scoped-for-testing"
      When I parse the file "custom-element-user.html"
      Then the result should include Custom element bindable attributes
