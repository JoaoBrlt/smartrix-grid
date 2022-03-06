import { Given, When, Then } from '@cucumber/cucumber';
import { DateTime } from 'luxon';
import { HouseholdMetricsWriterService } from '../services/household-metrics-writer.service';
import { HouseholdMetricsReaderService } from '../services/household-metrics-reader.service';
import { assert } from 'chai';
import { GlobalHouseholdMetricsDto } from '../dtos/global-household-metrics.dto';

let globalHouseholdMetrics: GlobalHouseholdMetricsDto;

//============================================================================//
// GIVEN
//============================================================================//

Given(/^the customer (\d+) consumed a total of (\d+)Wh on the day (.*)$/,
  async (customerId: number, totalAmount: number, dateString: string) => {
    const date = DateTime.fromFormat(`${dateString} 12:00`, 'dd/MM/yyyy HH:mm').toJSDate();
    await HouseholdMetricsWriterService.reportConsumption(customerId, totalAmount, date);
  });

//============================================================================//
// WHEN
//============================================================================//

When(/^the director checks the total consumption for the month (.*)$/,
  async (dateString: string) => {
    const newDateString = DateTime.fromFormat(dateString, 'MM/yyyy').toFormat('yyyy-MM');
    globalHouseholdMetrics = await HouseholdMetricsReaderService.getMonthlyGlobalHouseholdMetrics(newDateString);
  });

//============================================================================//
// THEN
//============================================================================//

Then(/^the director receives a total consumption for the month (.*) of (\d+)Wh$/,
  (dateString: string, expectedTotal: number) => {
    const totalConsumption = globalHouseholdMetrics.metrics.reduce((prev, val) => prev + val.consumption, 0);
    assert.equal(totalConsumption, expectedTotal);
  });
