@regulation_cycle
Feature: Test about regulation cycle at morning
  Background:
    Given All fresh database
    And regulation reset
    And 15 customers
    And it's 8:00
    And A production of 92kWh
    And A community 1 consisting of customers [1,2,3,4,5] which consume a total of 30kWh
    And A community 2 consisting of customers [6,7,8,9,10] which consume a total of 34kWh
    And A community 3 consisting of customers [11,12,13,14,15] which consume a total of 28kWh

  Scenario: At morning, when production == consumption, auto consumption are OFF and house consumption are ON
    When all event are send and receive
    Then None of electrical car is charging
    And All house consume without restriction

  Scenario: At morning, when production < consumption, 1 house consumption switched ON
    Given it's 8:01
    And A production of 92kWh
    And A fresh community database
    And A community 1 consisting of customers [1,2,3,4,5] which consume a total of 31kWh
    And A community 2 consisting of customers [6,7,8,9,10] which consume a total of 35kWh
    And A community 3 consisting of customers [11,12,13,14,15] which consume a total of 27kWh

    When all event are send and receive
    Then None of electrical car is charging
    And houses of 1 community consumes with restriction

  # At morning, when production > consumption, 1 house consumption switched OFF
    Given it's 8:02
    And A production of 92kWh
    And A fresh community database
    And A community 1 consisting of customers [1,2,3,4,5] which consume a total of 25kWh
    And A community 2 consisting of customers [6,7,8,9,10] which consume a total of 35kWh
    And A community 3 consisting of customers [11,12,13,14,15] which consume a total of 27kWh

    When all event are send and receive
    Then None of electrical car is charging
    And All house consume without restriction
