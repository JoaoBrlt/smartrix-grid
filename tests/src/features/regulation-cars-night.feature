Feature: Test about cars charging over night, equally distributed over all communities

  @cars_night
  Scenario: Cars charging over the night
    Given All fresh database
    And regulation reset
    And 15 customers
    And it's 0:00
    And A production of 92kWh
    And A community 1 consisting of customers [1,2,3,4,5] which consume a total of 30kWh
    And A community 2 consisting of customers [6,7,8,9,10] which consume a total of 34kWh
    And A community 3 consisting of customers [11,12,13,14,15] which consume a total of 28kWh

    When it's 0:00
    Then cars of only one community charge

    When it's 2:00
    Then cars of only one community charge

    When it's 4:00
    Then cars of only one community charge

    #Then all communities had an equivalent charge time
