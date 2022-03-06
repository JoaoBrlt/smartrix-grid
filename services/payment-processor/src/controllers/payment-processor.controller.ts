import { Controller, Get } from '@nestjs/common';
import { PaymentProcessorService } from '../services/payment-processor.service';
import { EventPattern } from '@nestjs/microservices';
import { InvoiceDto } from '../dtos/invoice.tdo';

@Controller()
export class PaymentProcessorController {
  constructor(private readonly paymentProcessorService: PaymentProcessorService) {}

  @EventPattern('invoice-created')
  public async onInvoiceCreatedEvent(data: { value: InvoiceDto }) {
    console.log('invoice-got');
    await this.paymentProcessorService.processPayment(data.value);
  }
}
