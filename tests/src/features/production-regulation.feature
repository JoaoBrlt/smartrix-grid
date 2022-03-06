Feature: Production regulation

  Scenario: A power plant require the next month amount of energy needed
    Given A fresh production database
    And a production of 2772Wh registered during the month of 2021-02
    When a power plant require the total of energy used during the month of 2021-02
    Then the result for the total of energy used during the last month is 2772Wh
