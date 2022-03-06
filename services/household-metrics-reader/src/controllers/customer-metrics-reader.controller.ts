import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { DateTime } from 'luxon';
import { CustomerMetricsReaderService } from '../services/customer-metrics-reader.service';
import { CustomerMetricsDto } from '../dtos/customer-metrics.dto';

@Controller('household-metrics-reader/customers')
export class CustomerMetricsReaderController {
  /**
   * Constructs the customer metrics reader.
   * @param customerMetricsReaderService The customer metrics reader service.
   */
  constructor(private readonly customerMetricsReaderService: CustomerMetricsReaderService) {}

  /**
   * Returns the household metrics of a customer for the current day.
   * @param customerId The customer identifier.
   */
  @Get(':id')
  public getCustomerMetrics(@Param('id') customerId: number): Promise<CustomerMetricsDto> {
    const date = DateTime.now();
    return this.customerMetricsReaderService.getDailyCustomerMetrics(customerId, date);
  }

  /**
   * Returns the household metrics of a customer for a given day.
   * @param customerId The customer identifier.
   * @param dateString The date string.
   */
  @Get(':id/days/:date')
  public getDailyCustomerMetrics(
    @Param('id') customerId: number,
    @Param('date') dateString: string,
  ): Promise<CustomerMetricsDto> {
    const date = DateTime.fromFormat(dateString, 'yyyy-MM-dd');
    if (!date.isValid) {
      throw new BadRequestException("The date must be in the format 'yyyy-MM-dd'.");
    }
    return this.customerMetricsReaderService.getDailyCustomerMetrics(customerId, date);
  }

  /**
   * Returns the household metrics of a customer for a given month.
   * @param customerId The customer identifier.
   * @param dateString The date string.
   */
  @Get(':id/months/:date')
  public getMonthlyCustomerMetrics(
    @Param('id') customerId: number,
    @Param('date') dateString: string,
  ): Promise<CustomerMetricsDto> {
    const date = DateTime.fromFormat(dateString, 'yyyy-MM');
    if (!date.isValid) {
      throw new BadRequestException("The date must be in the format 'yyyy-MM'.");
    }
    return this.customerMetricsReaderService.getMonthlyCustomerMetrics(customerId, date);
  }

  /**
   * Returns the household metrics of a customer for a given year.
   * @param customerId The customer identifier.
   * @param dateString The date string.
   */
  @Get(':id/years/:date')
  public getYearlyCustomerMetrics(
    @Param('id') customerId: number,
    @Param('date') dateString: string,
  ): Promise<CustomerMetricsDto> {
    const date = DateTime.fromFormat(dateString, 'yyyy');
    if (!date.isValid) {
      throw new BadRequestException("The date must be in the format 'yyyy'.");
    }
    return this.customerMetricsReaderService.getYearlyCustomerMetrics(customerId, date);
  }
}
