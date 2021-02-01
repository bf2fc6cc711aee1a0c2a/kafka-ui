# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).

Feature: Topic detail view component

  Scenario: Basic rendering
    Given the topic detail view component
    When it is rendered
    Then it should display the expected text
