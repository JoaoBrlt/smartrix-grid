import { HouseholdMetricsDto } from './household-metrics.dto';

export class CustomerMetricsDto {
  /**
   * The customer identifier.
   */
  public customerId: number;

  /**
   * The customer metrics.
   */
  public metrics: HouseholdMetricsDto[];
}
