import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { DateTime } from 'luxon';
import { InvoiceReaderService } from '../services/invoice-reader.service';
import { Invoice } from '../entities/invoice.entity';

@Controller('invoice-reader')
export class InvoiceReaderController {
  /**
   * Construct the invoice issuer controller
   * @param invoiceReaderService the invoice issuer service
   */
  constructor(private readonly invoiceReaderService: InvoiceReaderService) {}

  /**
   * Returns the invoice of the given customer
   * @param customerId the customer identifier
   */
  @Get(':customerId')
  public async getInvoice(@Param('customerId') customerId: number): Promise<Invoice> {
    return this.invoiceReaderService.getInvoice(customerId, new Date(Date.now()));
  }

  /**
   * Returns the invoice of the given customer
   * @param customerId the customer identifier
   * @param dateString the date
   */
  @Get(':customerId/:date')
  public async getInvoiceByDate(
    @Param('customerId') customerId: number,
    @Param('date') dateString: string,
  ): Promise<Invoice> {
    const date = DateTime.fromFormat(dateString, 'yyyy-MM-dd');
    if (!date.isValid) {
      throw new BadRequestException("The date must be in the format 'yyyy-MM-dd'.");
    }
    return this.invoiceReaderService.getInvoice(customerId, date);
  }
}
