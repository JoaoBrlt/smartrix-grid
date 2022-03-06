import axios from "axios";
import { logger } from '../utilities/logger';

export class ProductionReaderService {
  /**
   * Returns the service URL.
   */
  public static getServiceURL(): string {
    return `http://${process.env.PRODUCTION_READER_HOST}:${process.env.PRODUCTION_READER_PORT}/production-reader`;
  }

  /**
   * Return the production made during the month.
   */
  public static async getMonthSumProd(dateStr: string): Promise<number> {
    logger.log('http', `GET ${this.getServiceURL()}/total-production/months/${dateStr}`);
    return await axios
      .get<number>(`${this.getServiceURL()}/total-production/months/${dateStr}`)
      .then((r) => r.data);
  }
}
