import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime, Duration } from 'luxon';
import { HouseholdMetrics } from '../entities/household-metrics.entity';
import { GlobalHouseholdMetricsDto } from '../dtos/global-household-metrics.dto';
import { HouseholdMetricsReaderService } from './household-metrics-reader.service';

@Injectable()
export class GlobalMetricsReaderService {
  /**
   * Constructs the global metrics reader service.
   * @param householdMetricsRepository The household metrics repository.
   * @param householdMetricsReaderService The household metrics reader service.
   */
  constructor(
    @InjectRepository(HouseholdMetrics)
    private readonly householdMetricsRepository: Repository<HouseholdMetrics>,
    private readonly householdMetricsReaderService: HouseholdMetricsReaderService,
  ) {}

  /**
   * Returns household metrics in a time interval.
   * @param start The start date.
   * @param end The end date.
   * @param step The duration of a time slot.
   */
  public async getGlobalHouseholdMetrics(
    start: DateTime,
    end: DateTime,
    step: Duration,
  ): Promise<GlobalHouseholdMetricsDto> {
    // Get the household metrics of the customer.
    const metrics = await this.householdMetricsRepository
      .createQueryBuilder('metrics')
      .andWhere('metrics.date >= :start', { start: start.toJSDate() })
      .andWhere('metrics.date < :end', { end: end.toJSDate() })
      .orderBy('metrics.date', 'ASC')
      .getMany();

    // Aggregate the household metrics by time slots.
    return {
      metrics: this.householdMetricsReaderService.aggregateHouseholdMetricsByTimeSlots(metrics, start, end, step),
    };
  }

  /**
   * Returns the global household metrics for a given day.
   * @param date The day for which we want to retrieve the household metrics.
   */
  public async getDailyGlobalHouseholdMetrics(date: DateTime): Promise<GlobalHouseholdMetricsDto> {
    return this.getGlobalHouseholdMetrics(date.startOf('day'), date.endOf('day'), Duration.fromISO('PT1H'));
  }

  /**
   * Returns the global household metrics for a given month.
   * @param date The month for which we want to retrieve the household metrics.
   */
  public async getMonthlyGlobalHouseholdMetrics(date: DateTime): Promise<GlobalHouseholdMetricsDto> {
    return this.getGlobalHouseholdMetrics(date.startOf('month'), date.endOf('month'), Duration.fromISO('P1D'));
  }

  /**
   * Returns the global household metrics for a given year.
   * @param date The year for which we want to retrieve the household metrics.
   */
  public async getYearlyGlobalHouseholdMetrics(date: DateTime): Promise<GlobalHouseholdMetricsDto> {
    return this.getGlobalHouseholdMetrics(date.startOf('year'), date.endOf('year'), Duration.fromISO('P1M'));
  }
}
