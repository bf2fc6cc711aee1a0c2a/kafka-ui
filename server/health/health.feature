# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
Feature: health module

    Behaviours and capabilities provided by the health module

    Scenario: Returns with the expected HTTP response for a /health call
    Given a 'health_only' server configuration
    And I run an instance of the Strimzi-UI server
    When I make a 'get' request to '/health'
    Then I get the expected health response
