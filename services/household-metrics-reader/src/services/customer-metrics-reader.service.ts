import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime, Duration } from 'luxon';
import { CustomerMetricsDto } from '../dtos/customer-metrics.dto';
import { HouseholdMetrics } from '../entities/household-metrics.entity';
import { HouseholdMetricsReaderService } from './household-metrics-reader.service';

@Injectable()
export class CustomerMetricsReaderService {
  /**
   * Constructs the customer metrics reader service.
   * @param householdMetricsRepository The household metrics repository.
   * @param householdMetricsReaderService The household metrics reader service.
   */
  constructor(
    @InjectRepository(HouseholdMetrics)
    private readonly householdMetricsRepository: Repository<HouseholdMetrics>,
    private readonly householdMetricsReaderService: HouseholdMetricsReaderService,
  ) {}

  /**
   * Returns the household metrics of a customer.
   * @param customerId The customer identifier.
   * @param start The start date.
   * @param end The end date.
   * @param step The duration of a time slot.
   */
  public async getCustomerMetrics(
    customerId: number,
    start: DateTime,
    end: DateTime,
    step: Duration,
  ): Promise<CustomerMetricsDto> {
    // Get the household metrics of the customer.
    const metrics = await this.householdMetricsRepository
      .createQueryBuilder('metrics')
      .where('metrics.customerId = :id', { id: customerId })
      .andWhere('metrics.date >= :start', { start: start.toJSDate() })
      .andWhere('metrics.date < :end', { end: end.toJSDate() })
      .orderBy('metrics.date', 'ASC')
      .getMany();

    // Aggregate the household metrics by time slots.
    return {
      customerId,
      metrics: this.householdMetricsReaderService.aggregateHouseholdMetricsByTimeSlots(metrics, start, end, step),
    };
  }

  /**
   * Returns the household metrics of a customer for a given day.
   * @param customerId The customer identifier.
   * @param date The day for which we want to retrieve the household metrics.
   */
  public async getDailyCustomerMetrics(customerId: number, date: DateTime): Promise<CustomerMetricsDto> {
    return this.getCustomerMetrics(customerId, date.startOf('day'), date.endOf('day'), Duration.fromISO('PT1H'));
  }

  /**
   * Returns the household metrics of a customer for a given month.
   * @param customerId The customer identifier.
   * @param date The month for which we want to retrieve the household metrics.
   */
  public async getMonthlyCustomerMetrics(customerId: number, date: DateTime): Promise<CustomerMetricsDto> {
    return this.getCustomerMetrics(customerId, date.startOf('month'), date.endOf('month'), Duration.fromISO('P1D'));
  }

  /**
   * Returns the household metrics of a customer for a given year.
   * @param customerId The customer identifier.
   * @param date The year for which we want to retrieve the household metrics.
   */
  public async getYearlyCustomerMetrics(customerId: number, date: DateTime): Promise<CustomerMetricsDto> {
    return this.getCustomerMetrics(customerId, date.startOf('year'), date.endOf('year'), Duration.fromISO('P1M'));
  }
}
