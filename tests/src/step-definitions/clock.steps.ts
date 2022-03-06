import { Given } from '@cucumber/cucumber';

export let date: Date = new Date();

//============================================================================//
// GIVEN
//============================================================================//

Given(/^it's the (\d+)\/(\d+)\/(\d+)$/, (day: number, month: number, year: number) => {
  date.setFullYear(year, month, day);
});

Given(/^it's (\d+):(\d+)$/, (hours: number, minutes: number) => {
  //Hours+1 because, otherwise, saying "it's 00h00" will result in 23h00 => UTC associated problem
  date.setHours(hours+1, minutes,0,0);
});
