import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { DateTime } from 'luxon';
import { GlobalMetricsReaderService } from '../services/global-metrics-reader.service';
import { GlobalHouseholdMetricsDto } from '../dtos/global-household-metrics.dto';

@Controller('household-metrics-reader')
export class GlobalMetricsReaderController {
  /**
   * Constructs the global metrics reader.
   * @param globalMetricsReaderService The household metrics reader service.
   */
  constructor(private readonly globalMetricsReaderService: GlobalMetricsReaderService) {}

  /**
   * Returns the global household metrics for the current day.
   */
  @Get()
  public getGlobalHouseholdMetrics(): Promise<GlobalHouseholdMetricsDto> {
    const date = DateTime.now();
    return this.globalMetricsReaderService.getDailyGlobalHouseholdMetrics(date);
  }

  /**
   * Returns the global household metrics for a given day.
   * @param dateString The date string.
   */
  @Get('days/:date')
  public getDailyGlobalHouseholdMetrics(@Param('date') dateString: string): Promise<GlobalHouseholdMetricsDto> {
    const date = DateTime.fromFormat(dateString, 'yyyy-MM-dd');
    if (!date.isValid) {
      throw new BadRequestException("The date must be in the format 'yyyy-MM-dd'.");
    }
    return this.globalMetricsReaderService.getDailyGlobalHouseholdMetrics(date);
  }

  /**
   * Returns the global household metrics for a given month.
   * @param dateString The date string.
   */
  @Get('months/:date')
  public getMonthlyGlobalHouseholdMetrics(@Param('date') dateString: string): Promise<GlobalHouseholdMetricsDto> {
    const date = DateTime.fromFormat(dateString, 'yyyy-MM');
    if (!date.isValid) {
      throw new BadRequestException("The date must be in the format 'yyyy-MM'.");
    }
    return this.globalMetricsReaderService.getMonthlyGlobalHouseholdMetrics(date);
  }

  /**
   * Returns the global household metrics for a given year.
   * @param dateString The date string.
   */
  @Get('years/:date')
  public getYearlyGlobalHouseholdMetrics(@Param('date') dateString: string): Promise<GlobalHouseholdMetricsDto> {
    const date = DateTime.fromFormat(dateString, 'yyyy');
    if (!date.isValid) {
      throw new BadRequestException("The date must be in the format 'yyyy'.");
    }
    return this.globalMetricsReaderService.getYearlyGlobalHouseholdMetrics(date);
  }
}
