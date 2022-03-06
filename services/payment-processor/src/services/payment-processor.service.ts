import { Injectable } from '@nestjs/common';
import { InvoiceDto } from '../dtos/invoice.tdo';

@Injectable()
export class PaymentProcessorService {
  public processPayment(invoice: InvoiceDto) {
    console.log('New payment: from --> ', invoice.customerId, ' : ', invoice.amount);
  }
}
