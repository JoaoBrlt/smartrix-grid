import { Injectable } from '@nestjs/common';
import { ProductionEvent } from '../dtos/production-event.dto';

@Injectable()
export class CacheService {
  public productions: { [type: string]: number } = {};

  public readonly priceThreshold = 10; //Threshold to determine if the production is worth to buy (cheap) or not
  //Readonly => Cannot change its value during runtime
  public priceCurrent = 12; //Global price to be used by the service to send directives
  //Default value > priceThreshold so the default directive is DISCHARGE (we dont want to buy)

  public updateProduction(prod: ProductionEvent): void {
    this.productions[prod.type] = prod.production;
  }

  public getSumOfProduction(): number {
    return Object.values(this.productions).reduce((a, b) => a + b, 0);
  }
}
