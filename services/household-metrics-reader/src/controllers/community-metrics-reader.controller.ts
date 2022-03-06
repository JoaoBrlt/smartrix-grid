import { Get, Controller, Param, Query, BadRequestException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { CommunityMetricsReaderService } from '../services/community-metrics-reader.service';
import { CommunityMetricsDto } from '../dtos/community-metrics.dto';
import { OptionalDateDto } from '../dtos/optional-date.dto';
import { CommunityMetricsSumDto } from '../dtos/community-metrics-sum.dto';

@Controller('household-metrics-reader/communities')
export class CommunityMetricsReaderController {
  /**
   * Constructs the community metrics reader.
   * @param communityMetricsReaderService The household metrics reader service.
   */
  constructor(private readonly communityMetricsReaderService: CommunityMetricsReaderService) {}

  /**
   * Returns the latest household metrics of all the communities.
   */
  @Get()
  public getLastMetricsOfAllCommunities(@Query() dateDto: OptionalDateDto): Promise<CommunityMetricsSumDto[]> {
    const date = dateDto?.date ? DateTime.fromJSDate(dateDto.date) : DateTime.now();
    return this.communityMetricsReaderService.getLastMetricsOfAllCommunities(date);
  }

  /**
   * Returns the household metrics of a community for the current day.
   * @param communityId The community identifier.
   */
  @Get(':id')
  public getCommunityMetrics(@Param('id') communityId: number): Promise<CommunityMetricsDto> {
    const date = DateTime.now();
    return this.communityMetricsReaderService.getDailyCommunityMetrics(communityId, date);
  }

  /**
   * Returns the household metrics of a community for a given day.
   * @param communityId The community identifier.
   * @param dateString The date string.
   */
  @Get(':id/days/:date')
  public getDailyCommunityMetrics(
    @Param('id') communityId: number,
    @Param('date') dateString: string,
  ): Promise<CommunityMetricsDto> {
    const date = DateTime.fromFormat(dateString, 'yyyy-MM-dd');
    if (!date.isValid) {
      throw new BadRequestException("The date must be in the format 'yyyy-MM-dd'.");
    }
    return this.communityMetricsReaderService.getDailyCommunityMetrics(communityId, date);
  }

  /**
   * Returns the household metrics of a community for a given month.
   * @param communityId The community identifier.
   * @param dateString The date string.
   */
  @Get(':id/months/:date')
  public getMonthlyCommunityMetrics(
    @Param('id') communityId: number,
    @Param('date') dateString: string,
  ): Promise<CommunityMetricsDto> {
    const date = DateTime.fromFormat(dateString, 'yyyy-MM');
    if (!date.isValid) {
      throw new BadRequestException("The date must be in the format 'yyyy-MM'.");
    }
    return this.communityMetricsReaderService.getMonthlyCommunityMetrics(communityId, date);
  }

  /**
   * Returns the household metrics of a community for a given year.
   * @param communityId The community identifier.
   * @param dateString The date string.
   */
  @Get(':id/years/:date')
  public getYearlyCommunityMetrics(
    @Param('id') communityId: number,
    @Param('date') dateString: string,
  ): Promise<CommunityMetricsDto> {
    const date = DateTime.fromFormat(dateString, 'yyyy');
    if (!date.isValid) {
      throw new BadRequestException("The date must be in the format 'yyyy'.");
    }
    return this.communityMetricsReaderService.getYearlyCommunityMetrics(communityId, date);
  }
}
