import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { HouseholdMetricsEvent } from '../dtos/household-metrics.event.dto';
import { CacheService } from './cache.service';
import { CommunityMetricsSumEvent } from '../dtos/community-metrics-sum.event.dto';
import {
  ProductionMetrics,
  ProductionType,
} from '../dtos/production-metrics.dto';

@Injectable()
export class CalculatorService {
  constructor(
    @Inject('KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
    private readonly cache: CacheService,
  ) {}

  /**
   * run all calculation and emit their result
   */
  public run(): void {
    this.calculateAndEmitHouseholdProduction().then();
    this.calculateAndEmitCommunitiesMetrics().then();
  }

  /**
   * calculate and emit the metrics of a community since the last 1000 measures.
   */
  private async calculateAndEmitCommunitiesMetrics(): Promise<void> {
    const idsMap = await this.cache.getCommunitiesMap();
    const allMetrics = this.cache.getLastMetrics();
    const lastDate = allMetrics
      .map((c) => (c.date ? new Date(Date.parse(c.date)) : undefined))
      .reduce((a, b) => (a < b ? b : a), new Date(0));

    // group metrics by community
    const metricsGroupedByMetrics: {
      [communityId: number]: HouseholdMetricsEvent[];
    } = allMetrics.reduce(function (r, a) {
      r[idsMap[a.customerId]?.communityId] =
        r[idsMap[a.customerId]?.communityId] || [];
      r[idsMap[a.customerId]?.communityId].push(a);
      return r;
    }, {});

    const result: CommunityMetricsSumEvent[] = [];

    Object.values(metricsGroupedByMetrics).forEach((metrics) => {
      const reduce = metrics.reduce((a, b) => {
        return {
          consumption: a.consumption + b.consumption,
          boughtConsumption: a.boughtConsumption + b.boughtConsumption,
          production: a.production + b.production,
          soldProduction: a.soldProduction + b.soldProduction,
          currentBattery: a.currentBattery + b.currentBattery,
          batteryUsage: a.batteryUsage + b.batteryUsage,
          maxBattery: a.maxBattery + b.maxBattery,
          customerId: b.customerId,
        } as HouseholdMetricsEvent;
      }, new HouseholdMetricsEvent());

      const sum: CommunityMetricsSumEvent = {
        totalConsumption: reduce.consumption,
        totalBoughtConsumption: reduce.boughtConsumption,
        totalProduction: reduce.production,
        totalSoldProduction: reduce.soldProduction,
        totalBatteryUsage: reduce.batteryUsage,
        totalCurrentBattery: reduce.currentBattery,
        totalMaxBattery: reduce.maxBattery,
        community: idsMap[reduce.customerId],
        date: lastDate,
      };
      result.push(sum);
    });

    this.kafkaClient.emit('communities-metrics-calculated', result);
    console.log('community sum send');
  }

  /**
   * calculate and emit the total of sold household production since the last 1000 measures.
   */
  private async calculateAndEmitHouseholdProduction(): Promise<void> {
    const allMetrics = this.cache.getLastMetrics();
    const sum = allMetrics
      .map((c) => c.soldProduction)
      .reduce((a, b) => a + b, 0);
    const lastDate = allMetrics
      .map((c) => (c.date ? new Date(Date.parse(c.date)) : undefined))
      .reduce((a, b) => (a < b ? b : a), new Date(0));

    const result = new ProductionMetrics();
    result.production = sum;
    result.type = ProductionType.HOUSEHOLD;
    result.date = lastDate;

    this.kafkaClient.emit('production-metrics', { ...result });
  }
}
