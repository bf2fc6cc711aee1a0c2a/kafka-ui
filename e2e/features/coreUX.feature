Feature: Strimzi-ui core UX

Scenario: When a user accesses the Strimzi-ui, they see the home page
    Given I am on the strimzi-ui homepage
    Then the welcome message appears
    And version information about this UI is displayed