import axios from "axios";
import { logger } from '../utilities/logger';

export class ProductionWriterService {
  /**
   * Returns the service URL.
   */
  public static getServiceURL(): string {
    return `http://${process.env.PRODUCTION_WRITER_HOST}:${process.env.PRODUCTION_WRITER_PORT}/production-writer`;
  }

  /**
   * Indicates the production registered at a given date.
   * @param amount The production amount.
   * @param date The sampling date.
   */
  public static async indicateProd(amount: number, date: Date): Promise<void> {
    logger.log('http', `POST ${this.getServiceURL()}`);
    await axios.post(this.getServiceURL(), { amount, date });
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
