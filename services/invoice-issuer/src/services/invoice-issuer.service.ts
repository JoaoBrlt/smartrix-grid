import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from '../entities/invoice.entity';
import { HouseholdMetricsReaderService } from '../external/household-metrics-reader.service';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class InvoiceIssuerService {
  /**
   * Constructs the invoice issuer service.
   * @param invoiceRepository the invoice repository.
   * @param householdMetricsReaderService The household metrics reader service.
   */
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly householdMetricsReaderService: HouseholdMetricsReaderService,
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  /**
   * Triggered when the module is initialized.
   */
  public async onModuleInit(): Promise<void> {
    await this.kafkaClient.connect();
  }

  /**
   * Triggered when the module is destroyed.
   */
  public async onModuleDestroy(): Promise<void> {
    await this.kafkaClient.close();
  }

  /**
   * Creates the invoice of the given customer for the month of the given date
   * @param customerId the customer identifier
   * @param dateString the date
   */
  public async createInvoice(customerId: number, dateString: string): Promise<Invoice> {
    const customerMetrics = await this.householdMetricsReaderService.getMonthlyMetricsByCustomerId(
      customerId,
      dateString,
    );
    const invoice = {
      customerId: customerId,
      amount: 0,
    } as Invoice;
    customerMetrics.metrics.forEach((metrics) => {
      invoice.firstDate = invoice.firstDate || metrics.date;
      invoice.lastDate = metrics.date;
      invoice.amount += metrics.amount;
    });
    this.invoiceRepository.create(invoice);
    this.kafkaClient.emit('invoice-created', invoice); //Kafka
    console.log('invoice-created');
    await this.invoiceRepository.save(invoice); //DB
    return invoice;
  }
}
