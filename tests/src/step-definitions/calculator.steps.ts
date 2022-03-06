import { Given, When } from '@cucumber/cucumber';
import { HouseholdMetricsCalculator } from '../services/household-metrics-calculator.service';

// Will store the result of the call to the reader (When)
// Algorithm that will get the customers needed to cover up a production need by the power plant.

//============================================================================//
// GIVEN
//============================================================================//

Given(/^(\d+) customers$/,
  async (count: number) => {
    await HouseholdMetricsCalculator.setCounter(count);
  });

//============================================================================//
// WHEN
//============================================================================//

When(/^all event are send and receive$/,
  async () => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // sleep 1000ms
  })
