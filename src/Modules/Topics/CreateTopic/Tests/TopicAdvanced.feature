# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).

Feature: Create topic advanced wizard component

  Scenario: Basic rendering
    Given the create topic advanced wizard component
    When it is rendered
    Then it should display the expected text
