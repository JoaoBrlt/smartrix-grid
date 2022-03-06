import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { HouseholdMetricsDto } from '../dtos/household-metrics.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HouseholdMetricsWriterService {
  /**
   * The household metrics writer service URL.
   */
  private readonly serviceURL: string;

  /**
   * Constructs the household-metrics service.
   * @param httpService The HTTP client.
   * @param configService The configuration service.
   */
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    const host = configService.get<string>('householdMetricsWriter.host');
    const port = configService.get<number>('householdMetricsWriter.port');
    this.serviceURL = `http://${host}:${port}/household-metrics-writer`;
  }

  /**
   * Send household metrics.
   */
  public async sendMetrics(metrics: HouseholdMetricsDto): Promise<void> {
    await axios.post(`${this.serviceURL}`, metrics).catch((e) => {
      console.error(e);
      throw e;
    });
    // await this.httpService.post<void>(`${this.serviceURL}`, metrics).subscribe(
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
