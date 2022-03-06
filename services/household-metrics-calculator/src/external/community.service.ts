import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Community } from '../dtos/community.dto';

@Injectable()
export class CommunityService {
  /**
   * The URL of the community manager service.
   */
  private readonly serviceURL: string;

  /**
   * Constructs the community manager service.
   * @param configService The configuration service.
   * @param httpService
   */
  constructor(
    private readonly configService: ConfigService,
    private httpService: HttpService,
  ) {
    const host = configService.get<string>('communityManager.host');
    const port = configService.get<number>('communityManager.port');
    this.serviceURL = `http://${host}:${port}`;
  }

  /**
   * Returns the list of communities.
   */
  public async getCommunities(): Promise<Community[]> {
    return await firstValueFrom(
      this.httpService.get<Community[]>(
        `${this.serviceURL}/assigner/communities`,
      ),
    ).then((response) => {
      return response.data;
    });
    // return [{ communityId: 1, customersIds: [1] }];
  }

  /**
   * Returns the list of customer identifiers belonging to a community
   * @param communityId The community identifier.
   */
  public async getCustomersByCommunity(communityId: number): Promise<number[]> {
    return await firstValueFrom(
      this.httpService.get<number[]>(
        `${this.serviceURL}/assigner/get_customers/${communityId}`,
      ),
    ).then((response) => {
      return response.data;
    });
  }
}
