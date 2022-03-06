import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime, Duration } from 'luxon';
import { HouseholdMetrics } from '../entities/household-metrics.entity';
import { CommunityManagerService } from '../external/community-manager.service';
import { HouseholdMetricsReaderService } from './household-metrics-reader.service';
import { CommunityMetricsDto } from '../dtos/community-metrics.dto';
import { CommunityMetricsSumDto } from '../dtos/community-metrics-sum.dto';

@Injectable()
export class CommunityMetricsReaderService {
  /**
   * Constructs the community metrics reader service.
   * @param householdMetricsRepository The household metrics repository.
   * @param householdMetricsReaderService The household metrics reader service.
   * @param communityManagerService The community manager service.
   */
  constructor(
    @InjectRepository(HouseholdMetrics)
    private readonly householdMetricsRepository: Repository<HouseholdMetrics>,
    private readonly householdMetricsReaderService: HouseholdMetricsReaderService,
    private readonly communityManagerService: CommunityManagerService,
  ) {}

  /**
   * Returns the household metrics of a community.
   * @param communityId The community identifier.
   * @param start The start date.
   * @param end The end date.
   * @param step The duration of a time slot.
   */
  public async getCommunityMetrics(
    communityId: number,
    start: DateTime,
    end: DateTime,
    step: Duration,
  ): Promise<CommunityMetricsDto> {
    // Get the customers of the community.
    const customerIds = await this.communityManagerService.getCustomersByCommunity(communityId);

    // Get the household metrics of the community.
    let metrics = [];
    if (customerIds.length > 0) {
      metrics = await this.householdMetricsRepository
        .createQueryBuilder('metrics')
        .where('metrics.customerId IN (:...ids)', { ids: customerIds })
        .andWhere('metrics.date >= :start', { start: start.toJSDate() })
        .andWhere('metrics.date < :end', { end: end.toJSDate() })
        .orderBy('metrics.date', 'ASC')
        .getMany();
    }

    // Aggregate the household metrics by time slots.
    return {
      communityId,
      customerIds,
      metrics: this.householdMetricsReaderService.aggregateHouseholdMetricsByTimeSlots(metrics, start, end, step),
    };
  }

  /**
   * Returns the latest household metrics of all the communities.
   * @param date The date on which to check the household metrics.
   */
  public async getLastMetricsOfAllCommunities(date: DateTime): Promise<CommunityMetricsSumDto[]> {
    const result: CommunityMetricsSumDto[] = [];

    // Get the communities.
    const communities = await this.communityManagerService.getCommunities();

    // For each community.
    for (const community of communities) {
      // Get the household metrics of the community.
      let metrics = [];
      if (community.customersIds.length > 0) {
        metrics = await this.householdMetricsRepository
          .createQueryBuilder('metrics')
          .where('metrics.customerId IN (:...ids)', {
            ids: community.customersIds,
          })
          .andWhere('metrics.date < :date', { date: date.toJSDate() })
          .distinctOn(['metrics.customerId'])
          .orderBy('metrics.customerId', 'ASC')
          .addOrderBy('metrics.date', 'DESC', 'NULLS LAST')
          .getMany();
      }

      // Aggregate the household metrics.
      result.push({
        communityId: community.communityId,
        customerIds: community.customersIds,
        metrics: this.householdMetricsReaderService.aggregateHouseholdMetrics(metrics),
      });
    }
    return result;
  }

  /**
   * Returns the household metrics of a community for a given day.
   * @param communityId The community identifier.
   * @param date The day for which we want to retrieve the household metrics.
   */
  public async getDailyCommunityMetrics(communityId: number, date: DateTime): Promise<CommunityMetricsDto> {
    return this.getCommunityMetrics(communityId, date.startOf('day'), date.endOf('day'), Duration.fromISO('PT1H'));
  }

  /**
   * Returns the household metrics of a community for a given month.
   * @param communityId The community identifier.
   * @param date The month for which we want to retrieve the household metrics.
   */
  public async getMonthlyCommunityMetrics(communityId: number, date: DateTime): Promise<CommunityMetricsDto> {
    return this.getCommunityMetrics(communityId, date.startOf('month'), date.endOf('month'), Duration.fromISO('P1D'));
  }

  /**
   * Returns the household metrics of a community for a given year.
   * @param communityId The community identifier.
   * @param date The year for which we want to retrieve the household metrics.
   */
  public async getYearlyCommunityMetrics(communityId: number, date: DateTime): Promise<CommunityMetricsDto> {
    return this.getCommunityMetrics(communityId, date.startOf('year'), date.endOf('year'), Duration.fromISO('P1M'));
  }
}
