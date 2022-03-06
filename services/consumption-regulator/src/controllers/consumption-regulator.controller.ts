import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ConsumptionRegulationService } from '../services/consumption-regulation.service';
import { OptionalDateDto } from '../dtos/optional-date.dto';
import { ProducerService } from '../external/producer.service';
import { DirectiveBatteryStatus, DirectiveStatus, MetersIndicationDto } from '../dtos/meters-indication.dto';
import { CommunityMetricsSumEvent } from '../dtos/community-metrics-sum-event.dto';
import { ProductionEvent } from '../dtos/production-event.dto';
import { CacheService } from '../services/cache.service';
import { PriceDto } from '../dtos/price-estimator.dto';

@Controller('consumption-regulator')
export class ConsumptionRegulationController {
  /**
   * Constructs the consumption regulator controller.
   * @param regulationService The consumption service.
   * @param producerService
   * @param cache
   */
  constructor(
    private readonly regulationService: ConsumptionRegulationService,
    private readonly producerService: ProducerService,
    private readonly cache: CacheService,
  ) {}

  /**
   * Consumer => Runs a regulation based on data received in the bus
   * @param data the full event in the kafka bus
   */
  @EventPattern('communities-metrics-calculated')
  public async consumeCommunitySumEvent(data: { value: CommunityMetricsSumEvent[] }) {
    await this.regulationService.analyseAndRegulate(data.value);
  }

  /**
   * Consumer => update the production based on the newest metrics
   * @param data the full event in the kafka bus
   */
  @EventPattern('production-metrics')
  public async consumeProductionEvent(data: { value: ProductionEvent }) {
    console.log('production-got');
    await this.cache.updateProduction(data.value);
  }

  /**
   * Consumer => Listen to the topic 'price-updated', event produced by the price-estimator when a new price is set
   * Will update the global price used by the service whenever a new price has been updated by price-estimator
   * @param data the full event in the kafka bus, containing PriceDto as its value field
   */
  @EventPattern('price-updated')
  public async updatePrice(data: { value: PriceDto }) {
    this.cache.priceCurrent = data.value.price;
  }

  /**
   * DEBUG => Test route to make sure emits to meter-controller-mock are working properly (topic 'meter-directives')
   */
  @Get('/kafka')
  public async testKafkaProduce() {
    const res = {
      communityId: 1,
      customersIds: [1, 2, 3],
      house: DirectiveStatus.OFF,
      cars: DirectiveStatus.ON,
      battery: DirectiveBatteryStatus.DISCHARGE,
    } as MetersIndicationDto; //Dummy Data

    await this.producerService.emitNewDirective(res);
  }

  /**
   * Runs a regulation.
   * @param sums array of sums of communities consumption/production
   * @param dateDto The body containing the date of the request.
   */
  @Post('test')
  public async runRegulation(
    @Body() sums: CommunityMetricsSumEvent[],
    @Query() dateDto: OptionalDateDto,
  ): Promise<void> {
    await this.regulationService.analyseAndRegulate(sums);
  }

  /**
   * Returns the actual state.
   */
  @Get('state')
  public async getState(): Promise<any> {
    return this.regulationService.save;
  }

  /**
   * Reset the actual state.
   */
  @Delete('state')
  public resetState() {
    this.regulationService.save = {};
  }

  /**
   * Returns the current battery directive.
   */
  @Get('battery')
  public getBatteryDirective(): DirectiveBatteryStatus {
    return this.regulationService.returnDirectiveForBattery();
  }
}
