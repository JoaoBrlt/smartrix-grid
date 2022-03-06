Feature: Household consumption

  Scenario: Customer 1 checks its electrical consumption
    Given A fresh consumption database
    When the customer 1 checks its electrical consumption for 01/01/2021
    Then the customer 1 receives the following electrical consumption for 01/01/2021
      | Hour        | 00 | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 |
      | Consumption | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 2744 | 2019 | 1662 | 402 | 0 | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  |
