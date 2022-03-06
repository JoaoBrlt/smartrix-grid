import { HouseholdMetricsDto } from './household-metrics.dto';

export class CommunityMetricsSumDto {
  /**
   * The community identifier.
   */
  public communityId: number;

  /**
   * The identifiers of the customers belonging to the community.
   */
  public customerIds: number[];

  /**
   * The community metrics.
   */
  public metrics: HouseholdMetricsDto;
}
