Feature: Test about battery regulation, according to the price

  @price_up
  Scenario: When the price changes and is too expensive, battery arent charging anymore
    Given Current price is set at 5€/kWh
    And Battery currently charging
    When the price goes up to 20€/kWh
    Then Batteries are now discharging
