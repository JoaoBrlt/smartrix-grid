import { Injectable } from '@nestjs/common';
import { MetersIndicationDto } from '../dtos/meters-indication.dtos';
import { SimulationSubscriptionService } from '../externals/simulation-subscription.service';

@Injectable()
export class MeterService {
  constructor(private readonly simulatorService: SimulationSubscriptionService) {}

  /**
   * Send every given meter indications
   * @param metersIndication
   */
  public async sendMetersIndications(metersIndication: MetersIndicationDto[]) {
    metersIndication.forEach((indication) => this.sendMeterIndications(indication));
  }

  /**
   * Send a given meter indications
   * @param meterIndication
   */
  public async sendMeterIndications(meterIndication: MetersIndicationDto) {
    await this.simulatorService.redirectIfSub(meterIndication);
    meterIndication.customersIds.forEach((customerId) => {
      console.log(
        'directive {house:',
        meterIndication.house + ', car:',
        meterIndication.cars + ', battery:',
        meterIndication.battery + '} was sent to customer id',
        customerId,
        'at community id',
        meterIndication.communityId,
      );
    });
  }

  async sendProductionIndications(ids: number[]) {
    console.log('production directive was send to customers', ids);
  }
}
