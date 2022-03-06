import { Then, When } from '@cucumber/cucumber';
import { assert } from 'chai';
import { ProductionReaderService } from '../services/production-reader.service';

let lastMonthConsumption: number;

//============================================================================//
// WHEN
//============================================================================//

When(/^a power plant require the total of energy used during the month of (.*)$/, async (dateString: string) => {
  lastMonthConsumption = await ProductionReaderService.getMonthSumProd(dateString);
});

//============================================================================//
// THEN
//============================================================================//

Then(/^the result for the total of energy used during the last month is (\d+)Wh$/, (totalConsumption: number) => {
  assert.equal(totalConsumption, lastMonthConsumption);
})
