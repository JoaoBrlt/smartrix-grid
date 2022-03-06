import axios from 'axios';
import { logger } from '../utilities/logger';

export class HouseholdMetricsCalculator {
  /**
   * Returns the service URL.
   */
  public static getServiceURL(): string {
    return `http://${process.env.HOUSEHOLD_METRICS_CALCULATOR_HOST}:${process.env.HOUSEHOLD_METRICS_CALCULATOR_PORT}/household-metrics-calculator`;
  }

  /**
   * Returns the last state.
   */
  public static async setCounter( value: number ): Promise<any> {
    logger.log('http', `POST ${this.getServiceURL()}/counter/${value}`);
    return axios
      .post(`${this.getServiceURL()}/counter/${value}`)
      .catch((e) => {
        console.error('error while setting counter limit', e);
        throw e;
      });
  }
}
