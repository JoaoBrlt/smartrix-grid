import { Injectable, OnModuleInit } from '@nestjs/common';
import { HouseholdMetricsEvent } from '../dtos/household-metrics.event.dto';
import { Community } from '../dtos/community.dto';
import { CommunityService } from '../external/community.service';

@Injectable()
export class CacheService implements OnModuleInit {
  /**
   * Count the number of entry since the last reset
   */
  private entriesCount = 0;
  /**
   * Map registering all metrics.
   *
   *    customerId => metrics
   */
  private lastMetrics: { [p: number]: HouseholdMetricsEvent } = {};
  /**
   * Map associating all customer to his associated community.
   *
   *  customerId => community
   */
  private customerCommunityMap: { [p: number]: Community } = {};
  private communities: Community[] = [];

  constructor(private readonly community_service: CommunityService) {}

  /**
   * At the initiation of the module, request the communities.
   */
  public async onModuleInit(): Promise<void> {
    // this.updateCommunities(await this.community_service.getCommunities()); //Problem : call service before initiation
  }

  /**
   * Record a new data (a metrics)
   * If the customer already send a metrics, the previous will be replace by the new one
   * @param data
   */
  public recordNewEntry(data: HouseholdMetricsEvent): void {
    this.lastMetrics[data.customerId] = data;
    this.entriesCount++;
  }

  /**
   * Register the communities and associate them to their customer.
   * @param communities
   */
  public updateCommunities(communities: Community[]): void {
    this.communities = communities;
    communities.forEach((c) =>
      c.customersIds.forEach(
        (customerId) => (this.customerCommunityMap[customerId] = c),
      ),
    );
  }

  /**
   * get all last metrics (one by customer)
   */
  public getLastMetrics(): HouseholdMetricsEvent[] {
    return Object.values(this.lastMetrics);
  }

  /**
   * get the map associating all customer to his associated community.
   *
   *  customerId => communityId
   */
  public async getCommunitiesMap(): Promise<{ [p: number]: Community }> {
    if (!this.communities)
      this.updateCommunities(await this.community_service.getCommunities());
    return this.customerCommunityMap;
  }

  /**
   * get the number of entry since the last reset
   */
  public getNewEntriesCount(): number {
    return this.entriesCount;
  }

  /**
   * reset the counter of entry.
   */
  public resetCount(): void {
    this.entriesCount = 0;
  }

  public setCounter(value: number) {
    this.entriesCount = value;
  }
}
