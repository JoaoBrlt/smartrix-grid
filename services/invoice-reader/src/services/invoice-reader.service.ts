import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';

@Injectable()
export class InvoiceReaderService {
  /**
   * Constructs the invoice issuer service.
   * @param invoiceRepository The invoice repository.
   */
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  /**
   * Returns the invoice of the given customer for the month of the given date.
   * @param customerId the customer identifier.
   * @param date the date of monthly invoice.
   */
  public async getInvoice(customerId: number, date: Date): Promise<Invoice> {
    return this.invoiceRepository
      .createQueryBuilder()
      .where('Invoice.customerId = :id', { id: customerId })
      .andWhere('Invoice.firstDate <= :date', { date: date })
      .andWhere('Invoice.lastDate >= :date', { date: date })
      .getOne();
  }
}
