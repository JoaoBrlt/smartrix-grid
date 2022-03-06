import axios from 'axios';
import { logger } from '../utilities/logger';

export class CommunityManagerService {
  /**
   * Returns the service URL.
   */
  public static getServiceURL(): string {
    return `http://${process.env.COMMUNITY_MANAGER_HOST}:${process.env.COMMUNITY_MANAGER_PORT}`;
  }

  /**
   * Add a customer in a community.
   * @param customerId The customer identifier.
   * @param communityId The id of the community.
   */
  public static async addCustomerToCommunity(
    customerId: number,
    communityId: number,
  ): Promise<void> {
    logger.log('http', `POST ${this.getServiceURL()}/assigner/store`);
    await axios
      .post(`${this.getServiceURL()}/assigner/store`, { customerId, communityId })
      .catch((e) => {
        console.error(e);
        throw e;
      });
  }

  /**
   * Add a set of customer in a community.
   * @param customerIds The list of ids of customers.
   * @param communityId The id of the community.
   */
  public static async addCustomersToCommunity(
    customerIds: number[],
    communityId: number,
  ): Promise<void> {
    for (const customerId of customerIds) {
      await this.addCustomerToCommunity(customerId, communityId);
    }
  }

  /**
   * Clears the entities.
   */
  public static async clear(): Promise<void> {
    logger.log('http', `GET ${this.getServiceURL()}/assigner/clear`);
    await axios
      .get(`${this.getServiceURL()}/assigner/clear`)
      .catch((e) => {
        console.error('error during communities clear',e);
        throw e;
      });
  }
}
