import axios from 'axios';
import { logger } from '../utilities/logger';

export class ProductionEvaluatorService {
  /**
   * Returns the service URL.
   */
  public static getServiceURL(): string {
    return `http://${process.env.PRODUCTION_EVALUATOR_HOST}:${process.env.PRODUCTION_EVALUATOR_PORT}/production-evaluator`;
  }

  /**
   * Return an evaluation for the next production based on the previous month total consumption.
   */
  public static async evaluateNextProduction(date: string): Promise<number> {
    logger.log('http', `GET ${this.getServiceURL()}/next`);
    const response = await axios
      .get(`${this.getServiceURL()}/next`)
      .catch((e) => {
        console.error('error while request next production needed', e);
        throw e;
      });
    return response.data;
  }
}
