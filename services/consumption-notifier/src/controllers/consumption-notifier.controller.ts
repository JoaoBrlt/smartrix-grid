import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ConsumptionNotifierService } from '../services/consumption-notifier.service';
import { HouseholdMetricsEvent } from '../dtos/household-metrics.event.dto';

@Controller('consumption-notifier')
export class ConsumptionNotifierController {
  /**
   * Constructs the consumption notifier controller.
   * @param consumptionNotifierService The consumption notifier service.
   */
  constructor(private readonly consumptionNotifierService: ConsumptionNotifierService) {}

  /**
   * Triggered when a household metrics event is received.
   * @param data The received household metrics event.
   */
  @EventPattern('consumption-metrics')
  public async onHouseholdMetricsEvent(data: { value: HouseholdMetricsEvent }): Promise<void> {
    await this.consumptionNotifierService.updateConsumptionStatus(data.value);
  }
}
