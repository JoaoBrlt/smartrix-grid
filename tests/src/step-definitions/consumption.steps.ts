import { Given } from '@cucumber/cucumber';
import { HouseholdMetricsWriterService } from '../services/household-metrics-writer.service';

//============================================================================//
// GIVEN
//============================================================================//

Given(/^a customer (\d+) which consume (\d+)Wh during the month of (\d{4})-(\d{2})$/,
  async (id: number, totalConsumption: number, year: number, month: number) => {
  let timestamp = new Date(year, month-1).getTime(); // -30j
  const timestampLim = timestamp + 2419200000 - 1; // +28 j excluded
  const step = 30;
  let base_value = totalConsumption / step;
  const variance = (totalConsumption * 10) / (step * 100);

  while (timestamp < timestampLim) {
    let value = Math.round(base_value + (Math.random() * 2 - 1) * variance);
    totalConsumption -= value;
    if (totalConsumption < 0) {
      timestamp = timestampLim;
      value += totalConsumption;
    }
    await HouseholdMetricsWriterService.reportConsumption(id, value, new Date(timestamp)).then()
    timestamp += 2419200000 / step;
  }
  if (totalConsumption > 0)
    await HouseholdMetricsWriterService.reportConsumption(id, totalConsumption, new Date(timestampLim)).then()
})
