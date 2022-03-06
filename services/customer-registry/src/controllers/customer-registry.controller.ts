import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CustomerRegistryService } from '../services/customer-registry.service';
import { CustomerDto } from '../dtos/customer.dto';
import { Customer } from '../entities/customer.entity';

@Controller('customer-registry')
export class CustomerRegistryController {
  /**
   * Constructs the customer registry controller.
   * @param customerRegistryService The customer registry service.
   */
  constructor(private readonly customerRegistryService: CustomerRegistryService) {}

  /**
   * Register a customer to the company's customer registry.
   * @param customerCreationRequest The customer to register.
   */
  @Post('customer-creation')
  public async registerCustomer(@Body() customerCreationRequest: CustomerDto): Promise<void> {
    await this.customerRegistryService.storeCustomer(customerCreationRequest);
  }

  /**
   * Returns the customer associated to the given id.
   * @param customerId The customer identifier.
   */
  @Get('customer/:customerId')
  public getCustomer(@Param('customerId', ParseIntPipe) customerId: number): Promise<Customer> {
    return this.customerRegistryService.getCustomer(customerId);
  }

  /**
   * Removes the given customer.
   * @param customerId The customer identifier.
   */
  @Delete('customer-remove/:customerId')
  public async removeCustomer(@Param('customerId', ParseIntPipe) customerId: number): Promise<void> {
    await this.customerRegistryService.removeCustomer(customerId);
  }

  /**
   * Update a customer from the company's customer registry.
   * @param customerUpdateRequest The customer to update.
   * @param customerId The customer identifier.
   */
  @Put('customer-update/:customerId')
  public async updateCustomer(
    @Body() customerUpdateRequest: CustomerDto,
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<void> {
    await this.customerRegistryService.updateCustomer(customerUpdateRequest, customerId);
  }

  /**
   * Clears the entities.
   */
  @Get('clear')
  public async clear() {
    await this.customerRegistryService.clear();
  }
}
