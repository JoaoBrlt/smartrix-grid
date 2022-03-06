import { Body, Controller, Param, Post } from '@nestjs/common';
import { MeterService } from '../services/meter.service';
import { MetersIndicationDto } from '../dtos/meters-indication.dtos';
import { EventPattern } from '@nestjs/microservices';
import { SimulationSubscriptionService } from '../externals/simulation-subscription.service';

@Controller('meter-controller')
export class MeterController {
  /**
   * construct the meter controller
   * @param meterService the meter service
   */
  constructor(
    private readonly meterService: MeterService,
    private readonly simulatorService: SimulationSubscriptionService,
  ) {}

  /**
   * => Create a Consumer for the topic 'meter-directives'
   * Send a single meter indication to the customers (access through reading the bus)
   * : @EventPattern() is the decorator associated with emit() events => Dont send any reply, can work in parallel
   *    If we want a reply, we will use the @MessagePattern() and @Payload() decorator
   * @param data the data in the bus (Event values and headers).The value property should type of MetersIndicationDto
   */
  @EventPattern('meter-directives')
  public async sendMetersIndicationsThroughBusEvent(data: { value: MetersIndicationDto }) {
    await this.meterService.sendMeterIndications(data.value);
  }

  /**
   * Send every given meter indications
   * @param metersIndication
   */
  @Post('consumption/communities/send-all')
  public async sendMetersIndications(@Body() metersIndication: MetersIndicationDto[]) {
    await this.meterService.sendMetersIndications(metersIndication);
  }

  /**
   * Send a given meter indications
   * @param meterIndication
   */
  @Post('consumption/communities/send')
  public async sendMeterIndication(@Body() meterIndication: MetersIndicationDto) {
    await this.meterService.sendMeterIndications(meterIndication);
  }

  /**
   * Send every given meter indications
   * @param ids customer ids
   */
  @Post('consumption/communities/send-all')
  public async sendProductionIndications(@Body() ids: number[]) {
    await this.meterService.sendProductionIndications(ids);
  }

  /**
   * Send every given meter indications
   * @param id customer id
   */
  @Post('consumption/communities/send/:id')
  public async sendProductionIndication(@Param('id') id: number) {
    await this.meterService.sendProductionIndications([id]);
  }

  @Post('sub')
  public subscribe() {
    this.simulatorService.sub();
  }
}
