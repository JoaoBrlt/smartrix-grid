import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommunityManagerService {
  /**
   * The community manager service URL.
   */
  private readonly serviceURL: string;

  /**
   * Constructs the community manager service.
   * @param httpService The HTTP client.
   * @param configService The configuration service.
   */
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    const host = configService.get<string>('communityManager.host');
    const port = configService.get<number>('communityManager.port');
    this.serviceURL = `http://${host}:${port}`;
  }

  /**
   * Send a production.
   */
  public async addCustomerToCommunity(customerId: number, communityId: number): Promise<void> {
    await axios
      .post(`${this.serviceURL}/assigner/store`, { customerId: customerId, communityId: communityId })
      .catch((e) => {
        console.error(e);
        throw e;
      });
    // await this.httpService
    //   .post<void>(`${this.serviceURL}/assigner/store`, { customerId: customerId, communityId: communityId });
  }

  /**
   * clear.
   */
  public async clear(): Promise<void> {
    await axios.get(`${this.serviceURL}/assigner/clear`).catch((e) => {
      console.error(e);
      throw e;
    });
    // await this.httpService.post<void>(`${this.serviceURL}/assigner/clear`).subscribe(
    //   (r) => {
    //     return r;
    //   },
    //   (e) => {
    //     console.log(e);
    //     throw e;
    //   },
    // );
  }
}
