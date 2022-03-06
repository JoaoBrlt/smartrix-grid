Feature: Invoice are generated for a consumer
  Background:
    Given All fresh database
    And the price goes up to 1€/kWh

  Scenario: Create a invoice
    Given a customer 12 which consume 30000Wh during the month of 2021-06
    When the customer 12 ask for the month of 2021-06
    Then he receive a invoice of 30€
