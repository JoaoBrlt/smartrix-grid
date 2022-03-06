import axios from 'axios';
import { logger } from '../utilities/logger';

export class ConsumptionRegulatorService {
  /**
   * Returns the service URL.
   */
  public static getServiceURL(): string {
    return `http://${process.env.CONSUMPTION_REGULATOR_HOST}:${process.env.CONSUMPTION_REGULATOR_PORT}/consumption-regulator`;
  }

  /**
   * Runs a regulation.
   */
  public static async run(date: Date): Promise<void> {
    logger.log('http', `POST ${this.getServiceURL()}/test?date=${date.toISOString()}`);
    return axios.post(this.fixedEncodeURI(`${this.getServiceURL()}/test?date=${date.toISOString()}`));
  }

  /**
   * Returns the last state.
   */
  public static async getLastState(): Promise<any> {
    logger.log('http', `GET ${this.getServiceURL()}/state`);
    return axios.get(`${this.getServiceURL()}/state`);
  }

  /**
   * Returns the current battery directive.
   */
  public static async getBatteryDirective(): Promise<any> {
    logger.log('http', `GET ${this.getServiceURL()}/battery`);
    return axios.get(`${this.getServiceURL()}/battery`);
  }

  public static fixedEncodeURI(uri: string) {
    return encodeURI(decodeURI(uri));
  }

  public static async reset() {
    logger.log('http', `DELETE ${this.getServiceURL()}/state`);
    return axios.delete(`${this.getServiceURL()}/state`);
  }
}
