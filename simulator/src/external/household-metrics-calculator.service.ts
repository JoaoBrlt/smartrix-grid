import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class HouseholdMetricsCalculatorService {
  /**
   * The household metrics calculator service URL.
   */
  private readonly serviceURL: string;

  /**
   * Constructs the household metrics calculator service.
   * @param httpService The HTTP client.
   * @param configService The configuration service.
   */
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    const host = configService.get<string>('householdMetricsCalculator.host');
    const port = configService.get<number>('householdMetricsCalculator.port');
    this.serviceURL = `http://${host}:${port}/household-metrics-calculator`;
  }

  /**
   * Indicates the number of customer to the calculator.
   */
  public async setCounter(nbCustomer: number): Promise<void> {
    await axios.post(`${this.serviceURL}/counter/${nbCustomer}`).catch((e) => {
      console.error(e);
      throw e;
    });
    // await this.httpService.post(`${this.serviceURL}/counter/${nbCustomer}`);
  }
}
