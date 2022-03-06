import { Given, When } from '@cucumber/cucumber';
import { CommunityManagerService } from '../services/community-manager.service';
import { HouseholdMetricsWriterService } from '../services/household-metrics-writer.service';
import { date } from './clock.steps';

export const communities: number[] = [];

//============================================================================//
// GIVEN
//============================================================================//

Given(/^A community (\d+) consisting of customers (\[[0-9,]+]) which consume a total of (\d+)kWh$/,
  async (communityId: number, customerIdsString: string, totalAmount: number) => {
    const customerIds = JSON.parse(customerIdsString);
    totalAmount*=1000; // kW -> W

    for (const id of customerIds) {
      await CommunityManagerService.addCustomerToCommunity(id, communityId);
    }

    let values: any = {};
    const variance = totalAmount / customerIds.length * 10/100;
    const base_value = totalAmount / customerIds.length;
    for (const id of customerIds) {
      let value = Math.round(base_value + (Math.random()*2 - 1) * variance);
      totalAmount -= value;
      values[id] = value;
    }
    values[customerIds[0]] += totalAmount;

    for (const id of customerIds) {
      await HouseholdMetricsWriterService.reportConsumption(id, values[id], date)
    }
    if(!communities.some((id) => id == communityId)) communities.push(communityId);
 });

//============================================================================//
// WHEN
//============================================================================//

When(/^The community (\d+) of customers (\[[0-9,]+]) consumed an average of (\d+)Wh at daytime and (\d+)Wh at night for \+-(\d+)% today$/,
  {timeout: 50000},
  async (communityId: number, customerIdsString: string, averageDayConsumption: number, averageNightConsumption: number, variance: number) => {

    // Registers the community
    const customerIds = JSON.parse(customerIdsString);
    await CommunityManagerService.addCustomersToCommunity(customerIds, communityId);

    // Creates time intervals
    const endingDate = new Date();
    const startingDate = new Date(Date.UTC(endingDate.getFullYear(), endingDate.getMonth(), endingDate.getDate()));
    let timestamp = startingDate.getTime();
    const duration = endingDate.getTime() - startingDate.getTime();
    const timestampLim = timestamp + duration;
    const step = duration / 60000;

    // Generates the data
    while (timestamp < timestampLim) {
      const date = new Date(timestamp);
      const value = HouseholdMetricsWriterService.averageConsumption(averageNightConsumption, averageDayConsumption, date.getHours());
      for (const id of customerIds) {
        await HouseholdMetricsWriterService.generateConsumption(id, value, variance/100, date);
      }
      timestamp += duration / step;
    }
  });
