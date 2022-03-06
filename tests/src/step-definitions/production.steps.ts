import { Given, When } from '@cucumber/cucumber';
import { ProductionWriterService } from '../services/production-writer.service';
import { date } from './clock.steps';

//============================================================================//
// GIVEN
//============================================================================//

Given(/^a production of (\d+)Wh registered during the month of (.*)$/, async (totalProduction: number, dateString: string) => {
  let timestamp = Date.parse(dateString);
  const timestampLim = timestamp + 2419200000 - 1; // +28 j excluded
  const step = 30;
  let base_value = totalProduction / step;
  const variance = (totalProduction * 10) / (step * 100);

  while (timestamp < timestampLim) {
    let value = Math.round(base_value + (Math.random() * 2 - 1) * variance);
    totalProduction -= value;
    if (totalProduction < 0) {
      timestamp = timestampLim;
      value += totalProduction;
    }
    await ProductionWriterService.indicateProd(value, new Date(timestamp)).then()
    timestamp += 2419200000 / step;
  }
  if (totalProduction > 0)
    await ProductionWriterService.indicateProd(totalProduction, new Date(timestampLim)).then()
})

//============================================================================//
// WHEN
//============================================================================//

When(/^A production of (\d+)kWh$/,
  async (amount: number) => {
    await ProductionWriterService.indicateProd( amount*1000, date);
  });
