Feature: Global consumption

  Scenario: The director checks the total consumption for a month
    Given A fresh consumption database
    When the director checks the total consumption for the month 01/2021
    Then the director receives a total consumption for the month 01/2021 of 6827Wh
