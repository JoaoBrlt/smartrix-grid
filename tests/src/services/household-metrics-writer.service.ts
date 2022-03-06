import axios from 'axios';
import { logger } from '../utilities/logger';

export class HouseholdMetricsWriterService {
  /**
   * Returns the service URL.
   */
  public static getServiceURL(): string {
    return `http://${process.env.HOUSEHOLD_METRICS_WRITER_HOST}:${process.env.HOUSEHOLD_METRICS_WRITER_PORT}/household-metrics-writer`;
  }

  /**
   * Reports the total energy consumption of a customer.
   * @param customerId The customer identifier.
   * @param totalAmount The total energy consumption of the customer (in Wh).
   * @param date The date of collection of the measurement.
   */
  public static async reportConsumption(
    customerId: number,
    totalAmount: number,
    date: Date = new Date(),
  ): Promise<void> {
    logger.log('http', `POST ${this.getServiceURL()}`);
    await axios
      .post(this.getServiceURL(),
      {
        customerId: customerId,
        consumption: totalAmount,
        production: 0,
        batteryUsage: 0,
        currentBattery: 0,
        maxBattery: 0,
        date:date
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });
  }

  /**
   * Loads the fixtures.
   */
  public static async loadFixtures(): Promise<void> {
    logger.log('http', `GET ${this.getServiceURL()}/fixtures`);
    await axios
      .get(`${this.getServiceURL()}/fixtures`)
      .catch((e) => {
        console.error(e);
        throw e;
      });
  }

  /**
   * Generates a consumption about epsilon around the average consumption
   * for the given customer at the given date.
   * @param customerId the customer identifier.
   * @param consumption the average consumption for the given date.
   * @param epsilon the variance (in %).
   * @param date the date of consumption.
   */
  public static async generateConsumption(customerId: number, consumption: number, epsilon: number, date: Date) {
    let value = Math.round((1 + (Math.random()*2 - 1) * epsilon) * consumption);
    await this.reportConsumption(customerId, value, date)
  }

  /**
   * Returns the average consumption value based on the hour of the day.
   * Transforms a sinusoid from X[-pi,+pi] Y[-1,+1] to X[0,24] Y[min,max].
   * @param min the minimal average consumption in a day
   * @param max the maximal average consumption in a day
   * @param hour the hour of day
   */
  public static averageConsumption(min: number, max: number, hour: number){
    const x = (hour * (Math.PI / 12)) - Math.PI;
    return (((Math.cos(x) + 1) * (max - min)) / 2) + min;
  }

  /**
   * Clears the entities.
   */
  public static async clear(): Promise<void> {
    logger.log('http', `GET ${this.getServiceURL()}/clear`);
    await axios
      .get(`${this.getServiceURL()}/clear`)
      .catch((e) => {
        console.error(e);
        throw e;
      });
  }
}
