import { DataTable, Then } from '@cucumber/cucumber';
import { assert } from 'chai';

// Will store the result of the call to the reader (When)
// Algorithm that will get the customers needed to cover up a production need by the power plant.
let customersResults: number[] = [];

//============================================================================//
// THEN
//============================================================================//

Then(/^the power plant will buy the production from the following customers$/,
  (table: DataTable) => {
    const customersExpected: number[] = [];
    table.raw()[0].forEach((user: string) => customersExpected.push(parseInt(user,10)))
    assert.deepEqual(customersResults, customersExpected);
  });
