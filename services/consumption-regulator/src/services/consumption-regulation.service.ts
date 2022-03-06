import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { DirectiveBatteryStatus, DirectiveStatus, MetersIndicationDto } from '../dtos/meters-indication.dto';
import { ProducerService } from '../external/producer.service';
import { CacheService } from './cache.service';
import { CommunityMetricsSumEvent } from '../dtos/community-metrics-sum-event.dto';

@Injectable()
export class ConsumptionRegulationService {
  save = {};
  starting_night_hour = 23;
  ending_night_hour = 5;

  /**
   * Constructs the consumption regulator service.
   * @param httpService The HTTP service.
   * @param schedulerRegistry The scheduler registry.
   * @param producerService The producer service.
   * @param cacheService The cache service.
   */
  constructor(
    private httpService: HttpService,
    private schedulerRegistry: SchedulerRegistry,
    private readonly producerService: ProducerService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Estimates the state of every electricity meter for the minute and send directive to all electric meters
   * the point is to avoid a local peak of consumption and to equalize as much as possible every consumption
   */
  public async analyseAndRegulate(sums: CommunityMetricsSumEvent[]) {
    const now: Date = sums
      .map((c) => (c.date ? new Date(Date.parse(c.date)) : undefined))
      .reduce((a, b) => (a < b ? b : a), new Date(0));
    let consumptions = sums
      .sort((a, b) => a.totalBoughtConsumption - b.totalBoughtConsumption)
      .map((c) => {
        return {
          ...c,
          state: this.save[c.community?.communityId]
            ? this.save[c.community?.communityId]
            : { house: DirectiveStatus.ON, car: DirectiveStatus.OFF },
        };
      });
    if (now.getHours() < this.starting_night_hour && now.getHours() >= this.ending_night_hour) {
      // si jour, tout OFF
      consumptions = consumptions.map((c) => {
        c.state.car = DirectiveStatus.OFF;
        return c;
      });
    } else {
      // si nuit, découper entre 23h et 5h
      const tab = this.splitNight(consumptions, now);

      consumptions = consumptions.map((c) => {
        if (now.getTime() >= tab[c.community?.communityId].start && now.getTime() < tab[c.community?.communityId].end) {
          c.state.car = DirectiveStatus.ON;
        } else {
          c.state.car = DirectiveStatus.OFF;
        }
        return c;
      });
    }

    const amounts = consumptions.map((c) => c.totalBoughtConsumption);
    const totalConsumption = amounts.reduce((a, b) => a + b, 0);
    const production = await this.getLastProductionByMinute();

    if (totalConsumption <= production) {
      // si manque de conso : passe en ON celui en OFF avec le moins de conso
      const idx = consumptions.findIndex((c) => c.state.house == DirectiveStatus.OFF);
      if (idx != -1) {
        consumptions[idx].state.house = DirectiveStatus.ON;
      }
      // console.log('totalConsumption < production', consumptions);
    } else {
      // si manque de prod : passe en OFF celui en ON avec le plus de conso
      // sort by amount DESC
      consumptions = consumptions.sort((a, b) => b.totalBoughtConsumption - a.totalBoughtConsumption);
      const idx = consumptions.findIndex((c) => c.state.house == DirectiveStatus.ON);
      if (idx != -1) {
        consumptions[idx].state.house = DirectiveStatus.OFF;
      }
      // console.log('totalConsumption > production');
    }

    //Same battery directive for every customer, because the price it depends on the global price of the production
    const batteryDirective = this.returnDirectiveForBattery();

    consumptions.forEach((c) => {
      const result = new MetersIndicationDto();
      result.communityId = c.community?.communityId;
      result.customersIds = c.community?.customersIds;
      result.cars = c.state.car;
      result.house = c.state.house;
      result.battery = batteryDirective;
      this.save[c.community?.communityId] = c.state;
      this.sendDirective(result).then();
    });
  }

  /**
   * Returns last production per minute form the responsible service.
   */
  public async getLastProductionByMinute(): Promise<number> {
    return this.cacheService.getSumOfProduction();
  }

  /**
   * Sends the directive to the broadcast unit service
   * This value means the strategy of consumption that every electricity meter of the community will assume from now on.
   * @param directive data to send
   */
  public async sendDirective(directive: MetersIndicationDto): Promise<void> {
    this.producerService.emitNewDirective(directive);
  }

  public splitNight(
    consumptions: CommunityMetricsSumEvent[],
    now: Date,
  ): { [communityId: number]: { start: number; end: number } } {
    now = new Date(now.getTime());
    const result = {};
    const ids = consumptions.map((c) => c.community?.communityId).sort((a, b) => a - b);
    now.setHours(now.getHours() - this.starting_night_hour);
    now.setHours(this.starting_night_hour);

    const nbMin = ((this.ending_night_hour - this.starting_night_hour + 24) % 24) * 60;
    ids.forEach((id) => {
      const start = now.getTime();
      now.setMinutes(now.getMinutes() + nbMin / ids.length);
      const end = now.getTime();
      result[id] = { start: start, end: end };
    });

    return result;
  }

  public returnDirectiveForBattery(): DirectiveBatteryStatus {
    //If the current price is not higher than the threshold then its cheap, so we want to buy! (Charge Battery)
    if (this.cacheService.priceCurrent <= this.cacheService.priceThreshold) return DirectiveBatteryStatus.CHARGE;
    //else, we don't buy anything
    return DirectiveBatteryStatus.DISCHARGE;
  }
}
