import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConsumptionStatus } from '../entities/consumption-status.entity';
import { HouseholdMetricsEvent } from '../dtos/household-metrics.event.dto';
import { MailServerService } from '../external/mail-server.service';

@Injectable()
export class ConsumptionNotifierService {
  /**
   * Constructs the consumption notifier service.
   * @param consumptionStatusRepository The consumption status repository.
   * @param mailServerService The mail server service.
   */
  constructor(
    @InjectRepository(ConsumptionStatus)
    private readonly consumptionStatusRepository: Repository<ConsumptionStatus>,
    private readonly mailServerService: MailServerService,
  ) {}

  /**
   * Computes the consumption status.
   * @param householdMetricsEvent The household metrics event.
   */
  public computeConsumptionStatus(householdMetricsEvent: HouseholdMetricsEvent): ConsumptionStatus {
    return {
      customerId: householdMetricsEvent.customerId,
      autarky: householdMetricsEvent.boughtConsumption === 0,
      date: new Date(),
    };
  }

  /**
   * Updates the consumption status.
   * @param householdMetricsEvent The household metrics event.
   */
  public async updateConsumptionStatus(householdMetricsEvent: HouseholdMetricsEvent): Promise<void> {
    // Get the previous consumption status.
    const previousConsumptionStatus = await this.consumptionStatusRepository.findOne(householdMetricsEvent.customerId);

    // Compute and save the new consumption status.
    const newConsumptionStatus = this.computeConsumptionStatus(householdMetricsEvent);
    await this.consumptionStatusRepository.save(newConsumptionStatus);

    // Send a notification.
    if (previousConsumptionStatus && previousConsumptionStatus.autarky !== newConsumptionStatus.autarky) {
      await this.notifyCustomer(newConsumptionStatus);
    }
  }

  /**
   * Notifies a customer.
   * @param consumptionStatus The new consumption status.
   */
  public async notifyCustomer(consumptionStatus: ConsumptionStatus): Promise<void> {
    // TODO: Get customer details from the customer registry service.
    await this.mailServerService.send(
      'contact@smartrix-grid.com',
      `customer-${consumptionStatus.customerId}@example.org`,
      consumptionStatus.autarky ? 'You have reached autarky!' : 'You are no longer in autarky!',
      consumptionStatus.autarky
        ? `Dear customer ${consumptionStatus.customerId}, you have reached autarky.`
        : `Dear customer ${consumptionStatus.customerId}, you are no longer in autarky.`,
    );
  }
}
