import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { HouseholdMetricsEvent } from '../dtos/household-metrics.event.dto';
import { CacheService } from '../services/cache.service';
import { CalculatorService } from '../services/calculator.service';
import { Community } from '../dtos/community.dto';

@Controller('household-metrics-calculator')
export class CalculatorController {
  static NB_EVENT_BEFORE_RUN = 1000;

  constructor(
    private readonly cache: CacheService,
    private readonly calculator: CalculatorService,
  ) {}

  /**
   * Register household metrics when emitted.
   * After 1000 reception, run the calculator to transform and emit the registered data.
   *
   * @param data
   */
  @EventPattern('consumption-metrics')
  async registerMetrics(data: { value: HouseholdMetricsEvent }) {
    this.cache.recordNewEntry(data.value);

    if (
      this.cache.getNewEntriesCount() >=
      CalculatorController.NB_EVENT_BEFORE_RUN
    ) {
      this.cache.resetCount();
      this.calculator.run();
    }
  }

  /**
   * When a change in communities data is captured, update the data registered.
   * @param data
   */
  @EventPattern('communities-updated')
  async updateCommunities(data: { value: Community[] }) {
    // const communities: Community[] = this.community_service.getCommunities();
    this.cache.updateCommunities(data.value);
  }

  @Post('counter/:nbLeft')
  public setCounter(@Param('nbLeft') nbLeft: number): void {
    CalculatorController.NB_EVENT_BEFORE_RUN = nbLeft;
    this.cache.setCounter(0);
  }
}
