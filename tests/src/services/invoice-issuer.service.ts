import axios from "axios";
import { logger } from '../utilities/logger';
import { InvoiceDto } from '../dtos/invoice.dto';

export class InvoiceIssuerService {
  /**
   * Returns the service URL.
   */
  public static getServiceURL(): string {
    return `http://${process.env.INVOICE_ISSUER_HOST}:${process.env.INVOICE_ISSUER_PORT}/invoice-issuer`;
  }

  /**
   * Get the invoice of the given month for the given customer
   * @param customerId
   * @param dateString ex: 2021-06 (june 2021)
   */
  public static async getInvoice(customerId: number, dateString: string): Promise<InvoiceDto> {
    logger.log('http', `GET ${this.getServiceURL()}/${customerId}/${dateString}`);
    return await axios
      .get(`${this.getServiceURL()}/${customerId}/${dateString}`)
      .then((r) => r.data).catch((e) => {
        console.error(e);
        throw e;
      });
  }
}
