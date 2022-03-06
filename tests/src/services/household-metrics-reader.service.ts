import axios from 'axios';
import { GlobalHouseholdMetricsDto } from '../dtos/global-household-metrics.dto';
import { logger } from '../utilities/logger';

export class HouseholdMetricsReaderService {
  /**
   * Returns the service URL.
   */
  public static getServiceURL(): string {
    return `http://${process.env.HOUSEHOLD_METRICS_READER_HOST}:${process.env.HOUSEHOLD_METRICS_READER_PORT}/household-metrics-reader`;
  }

  /**
   * Returns the metrics of a customer for a specific day.
   * @param customerId The customer identifier.
   * @param dateString The date string.
   */
  public static async getMetricsForADay(
    customerId: number,
    dateString: string,
  ): Promise<number[]> {
    logger.log('http', `GET ${this.getServiceURL()}/customers/${customerId}/days/${dateString}`);
    const response: any = await axios.get(`${this.getServiceURL()}/customers/${customerId}/days/${dateString}`).catch((e) => {
      console.log('error while requesting metrics of a day',e);
      throw e;
    });
    return response.data.metrics;
  }

  /**
   * Returns the total consumption for a given month.
   * @param dateString The date string.
   */
  public static async getMonthlyGlobalHouseholdMetrics(dateString: string): Promise<GlobalHouseholdMetricsDto> {
    logger.log('http', `GET ${this.getServiceURL()}/months/${dateString}`);
    const response = await axios
      .get(`${this.getServiceURL()}/months/${dateString}`)
      .catch((e) => {
        console.error(e);
        throw e;
      });
    return response.data;
  }
}
