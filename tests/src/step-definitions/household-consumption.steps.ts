import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { DateTime } from 'luxon';
import { HouseholdMetricsWriterService } from '../services/household-metrics-writer.service';
import { HouseholdMetricsReaderService } from '../services/household-metrics-reader.service';
import { assert } from 'chai';

let metricsResult: any[] = [];

//============================================================================//
// GIVEN
//============================================================================//

Given(/^the customer (\d+) consumed a total of (\d+)Wh on (.*) at (.*)$/,
  async (customerId: number, totalAmount: number, dateString: string, timeString: string) => {
    const date = DateTime.fromFormat(`${dateString} ${timeString}`, 'dd/MM/yyyy HH:mm').toJSDate();
    await HouseholdMetricsWriterService.reportConsumption(customerId, totalAmount, date);
  });

//============================================================================//
// WHEN
//============================================================================//

When(/^the customer (\d+) checks its electrical consumption for (.*)$/,
  async (customerId: number, dateString: string) => {
    const date = DateTime.fromFormat(dateString, 'dd/MM/yyyy').toFormat('yyyy-MM-dd');
    metricsResult = await HouseholdMetricsReaderService.getMetricsForADay(customerId, date);
  });

//============================================================================//
// THEN
//============================================================================//

Then(/^the customer (\d+) receives the following electrical consumption for (.*)$/,
  (customerId: number, dateString: string, table: DataTable) => {
    // Initialize the expected result.
    let expectedResult: number[] = new Array(24).fill(0);
    let isPreviousDay = true;

    // Compute the expected result.
    table
      .transpose()
      .hashes()
      .forEach((item: { Hour: string, Consumption: string }) => {
        const hour = DateTime.fromFormat(`${dateString} ${item.Hour}`, 'dd/MM/yyyy HH').hour;
        if (hour === 0 || !isPreviousDay) {
          isPreviousDay = false;
          expectedResult[hour] = parseInt(item.Consumption, 10);
        }
      });

    const consumptionResult = metricsResult.map((metric) => metric.consumption);
    // Compare the expected result with the actual result.
    assert.deepEqual(consumptionResult, expectedResult);
  });
