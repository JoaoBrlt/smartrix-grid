import { Injectable } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerDto } from '../dtos/customer.dto';

@Injectable()
export class CustomerRegistryService {
  /**
   * Constructs the customer registry service.
   * @param customerRepository The customer repository.
   */
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  /**
   * Stores a customer in the registry.
   * @param customerCreationRequest The consumption request.
   */
  public async storeCustomer(customerCreationRequest: CustomerDto): Promise<void> {
    // Store the customer.
    const customer = this.customerRepository.create({
      name: customerCreationRequest.name,
      paymentInfo: customerCreationRequest.paymentInfo,
      address: customerCreationRequest.address,
    });
    await this.customerRepository.save(customer);
  }

  /**
   * Returns the customer.
   * @param customerId The customer identifier.
   */
  public async getCustomer(customerId: number): Promise<Customer> {
    return this.customerRepository
      .createQueryBuilder()
      .where('Customer.customerId = :id', { id: customerId })
      .getOne();
  }

  /**
   * Removes the customer from the registry.
   * @param customerId The customer identifier.
   */
  public async removeCustomer(customerId: number): Promise<void> {
    await this.customerRepository
      .createQueryBuilder()
      .delete()
      .from(Customer)
      .where('customerId = :id', { id: customerId })
      .execute();
  }

  /**
   * Updates the customer from the registry.
   * @param customerUpdateRequest The customer update request.
   * @param customerId The customer identifier.
   */
  public async updateCustomer(customerUpdateRequest: CustomerDto, customerId: number): Promise<void> {
    await this.customerRepository
      .createQueryBuilder()
      .update(Customer)
      .set({
        name: customerUpdateRequest.name,
        paymentInfo: customerUpdateRequest.paymentInfo,
        address: customerUpdateRequest.address,
      })
      .where('customerId = :id', { id: customerId })
      .execute();
  }

  /**
   * Clears the entities.
   */
  public async clear() {
    await this.customerRepository.clear();
  }
}
