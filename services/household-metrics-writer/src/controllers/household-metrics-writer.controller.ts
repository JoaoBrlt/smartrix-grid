import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReportHouseholdMetricsDto } from '../dtos/report-household-metrics.dto';
import { HouseholdMetricsWriterService } from '../services/household-metrics-writer.service';
import { EventPattern } from '@nestjs/microservices';
import { PriceDto } from '../dtos/price-estimator.dto';
import { PriceService } from '../external/price.service';

@Controller('household-metrics-writer')
export class HouseholdMetricsWriterController {
  /**
   * Constructs the household metrics writer controller.
   * @param householdMetricsWriterService The household metrics writer service.
   * @param priceService
   */
  constructor(
    private readonly householdMetricsWriterService: HouseholdMetricsWriterService,
    private readonly priceService: PriceService,
  ) {}

  /**
   * Consumer of topic 'price-updated'
   * When a new price is set (within price-estimator service) it will be sent in the bus
   * This consumer will receive it, so it can be updated here => Faster than a lookup in DB
   * @param data
   */
  @EventPattern('price-updated')
  public async getLatestPriceThroughBus(data: { value: PriceDto }) {
    this.priceService.purchasePrice = data.value.price;
    this.priceService.sellingPrice = data.value.price;
  }

  /**
   * Reports the household metrics of a customer at a given date.
   * @param householdMetricsRequest The household metrics request.
   */
  @Post()
  public async reportHouseholdMetrics(@Body() householdMetricsRequest: ReportHouseholdMetricsDto): Promise<void> {
    householdMetricsRequest.date = householdMetricsRequest.date || new Date();
    await this.householdMetricsWriterService.storeHouseholdMetrics(householdMetricsRequest);
  }

  /**
   * Loads the household metric fixtures.
   */
  @Get('fixtures')
  public async loadFixtures(): Promise<void> {
    await this.householdMetricsWriterService.loadFixtures();
  }

  /**
   * Clears the household metric records.
   */
  @Get('clear')
  public async clearConsumptions(): Promise<void> {
    await this.householdMetricsWriterService.clear();
  }
}
