import axios from "axios";
import { logger } from '../utilities/logger';
import { PriceDto } from "../dtos/price-estimator.dto";

export class PriceEstimatorService {
  /**
   * Returns the service URL.
   */
  public static getServiceURL(): string {
    return `http://${process.env.PRICE_ESTIMATOR_HOST}:${process.env.PRICE_ESTIMATOR_PORT}/price-estimator`;
  }

  /**
   * Change the current price to use
   * @param price the latest price
   */
  public static async changePrice(price: PriceDto): Promise<void> {
    logger.log('http', `POST ${this.getServiceURL()}`);
    await axios
      .post(this.getServiceURL(), price)
      .catch((e) => {
        console.error(e);
        throw e;
      });
  }
}
