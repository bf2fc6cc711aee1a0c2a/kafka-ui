# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: Topics component

  Scenario: Basic rendering
    Given a Topics component
    When it is rendered
    Then it should display the topics element
