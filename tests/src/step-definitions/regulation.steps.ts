import {Given, Then, When} from '@cucumber/cucumber';
import {communities} from "./communities-consumption.steps";
import {ConsumptionRegulatorService} from '../services/consumption-regulator.service';
import {assert} from 'chai'
import {DirectiveBatteryStatus} from "../types/DirectiveBatteryStatus";
import {PriceDto} from "../dtos/price-estimator.dto";
import {PriceEstimatorService} from "../services/price-estimator.service";
import {DirectiveStatus} from "../types/DirectiveStatus";

// Will store the result of the call to the reader (When)
// Algorithm that will get the customers needed to cover up a production need by the power plant.
let customersResults: number[] = [];

//============================================================================//
// GIVEN
//============================================================================//

// Scenario: When the price changes and is too expensive, battery arent charging anymore
Given(/^Current price is set at (\d+)€\/kWh$/,
  async (price: number) => {
    let dto = {
      price: price,
      date: new Date(),
    } as PriceDto;
    await PriceEstimatorService.changePrice(dto);
  });

// Scenario: When the price changes and is too expensive, battery arent charging anymore
Given(/^Battery currently charging$/,
  async () => {
    const batteryStatus: DirectiveBatteryStatus = (await ConsumptionRegulatorService.getBatteryDirective()).data;
    console.log(batteryStatus);
    assert.equal(batteryStatus, 'CHARGE');
  });


//============================================================================//
// WHEN
//============================================================================//

When(/^regulation reset$/,
  async () => {
    await ConsumptionRegulatorService.reset();
  });


// Scenario: When the price changes and is too expensive, battery arent charging anymore
When(/^the price goes up to (\d+)€\/kWh$/,
  async (price: number) => {
    let dto = {
      price: price,
      date: new Date(),
    } as PriceDto;
    await PriceEstimatorService.changePrice(dto);
  });


//============================================================================//
// THEN
//============================================================================//

Then(/^None of electrical car is charging$/,
  async () => {
    const state = (await ConsumptionRegulatorService.getLastState()).data
    console.log(state);
    communities.forEach((c) => {
      assert.equal(state[c].car, 'OFF');
    })
  });

Then(/^All house consume without restriction$/,
  async () => {
    const state = (await ConsumptionRegulatorService.getLastState()).data
    communities.forEach((c) => {
      assert.equal(state[c].house, 'ON');
    })
  });

Then(/^houses of (\d+) community consumes with restriction$/,
  async (nbCommunity: number) => {
    const state = (await ConsumptionRegulatorService.getLastState()).data
    const states = communities.map((cId) => state[cId]?.house);

    assert.isNotTrue(states.some((s) => s == undefined)); // all community must be assigned => error
    assert.equal(nbCommunity, states.reduce((count, state) => count + (state == 'OFF' ? 1 : 0), 0))
  });


// Scenario: When the price changes and is too expensive, battery arent charging anymore
Then(/^Batteries are now discharging$/,
  async () => {
    const batteryStatus: DirectiveBatteryStatus = (await ConsumptionRegulatorService.getBatteryDirective()).data;
    console.log(batteryStatus);
    assert.equal(batteryStatus, 'DISCHARGE');
  });


//Scenario: Cars charging over the night
Then(/^cars of only one community charge$/,
  async () => {
    const state = (await ConsumptionRegulatorService.getLastState()).data
    let cars: DirectiveStatus[] = [];
    communities.forEach((c) => {
      cars.push(state[c].car);
    })

    let count = 0;
    cars.forEach((c) => {
      if(c === DirectiveStatus.ON) count++;
    })
    assert.equal(count, 1);
  });

//Scenario: Cars charging over the night
Then(/^all communities had an equivalent charge time$/,
  async () => {

  });
