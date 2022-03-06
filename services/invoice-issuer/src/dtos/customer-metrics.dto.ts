import { HouseholdMetricsDto } from './household-metrics.dto';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerMetricsDto {
  /**
   * The customer identifier.
   */
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  public customerId: number;

  /**
   * The customer metrics.
   */
  @IsNotEmpty()
  @Type(() => HouseholdMetricsDto)
  public metrics: HouseholdMetricsDto[];
}
