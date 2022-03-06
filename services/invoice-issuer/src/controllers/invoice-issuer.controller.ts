import { Controller, Get, Param } from '@nestjs/common';
import { InvoiceIssuerService } from '../services/invoice-issuer.service';
import { Invoice } from '../entities/invoice.entity';

@Controller('invoice-issuer')
export class InvoiceIssuerController {
  /**
   * Construct the invoice issuer controller
   * @param invoiceIssuerService the invoice issuer service
   */
  constructor(private readonly invoiceIssuerService: InvoiceIssuerService) {}

  /**
   * Creates the invoice of the given customer for the month of the given date
   * @param customerId the customer identifier
   * @param dateString the date
   */
  @Get(':customerId/:date')
  public async getInvoice(
    @Param('customerId') customerId: number,
    @Param('date') dateString: string,
  ): Promise<Invoice> {
    return await this.invoiceIssuerService.createInvoice(customerId, dateString);
  }
}
