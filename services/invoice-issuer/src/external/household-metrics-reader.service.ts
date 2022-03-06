import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CustomerMetricsDto } from '../dtos/customer-metrics.dto';

@Injectable()
export class HouseholdMetricsReaderService {
  HOUSEHOLD_METRICS_READER_URL = `http://${process.env.HOUSEHOLD_METRICS_READER_HOST || 'localhost'}:${
    process.env.HOUSEHOLD_METRICS_READER_PORT || '3001'
  }/household-metrics-reader`;

  constructor(private httpService: HttpService) {}

  /**
   * Returns the given customer monthly metrics for the given month.
   * @param customerId the customer id.
   * @param dateString the required month.
   */
  public async getMonthlyMetricsByCustomerId(customerId: number, dateString: string): Promise<CustomerMetricsDto> {
    return await firstValueFrom(
      this.httpService.get<CustomerMetricsDto>(
        this.HOUSEHOLD_METRICS_READER_URL + '/customers/' + customerId + '/months/' + dateString,
      ),
    )
      .then(async (response) => response.data)
      .catch((e) => {
        console.log(e);
        throw new BadRequestException(e);
      });
  }
}
