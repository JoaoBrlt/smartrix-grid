import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CommunityMetricsSumDto } from '../dtos/community-metrics-sum.dto';

@Injectable()
export class ProductionEvaluatorService {
  private static VARIANCE = 10000;
  /**
   * The total consumption used from the last call for evaluation.
   * @private
   */
  private lastGlobalConsumption = 0;
  private prevGlobalConsumption = 0;
  private nextProd: number;

  /**
   * Returns the next order of energy production of a power plant.
   */
  public getNextProduction(): number {
    return this.nextProd;
  }

  /**
   * Evaluate the next order of energy production of a power plant.
   */
  public evaluateNextProduction() {
    if (!this.nextProd) {
      this.nextProd = this.lastGlobalConsumption;
      return;
    }
    const average = (this.lastGlobalConsumption + this.prevGlobalConsumption) / 2;
    this.nextProd += Math.round(
      Math.min(ProductionEvaluatorService.VARIANCE, Math.abs(average - this.nextProd)) *
        (average < this.nextProd ? -1 : 1),
    );
    // Math.round(this.nextProd);
  }

  public updateLastGlobalConsumption(message: CommunityMetricsSumDto[]): void {
    console.log('last sums got');
    this.prevGlobalConsumption = this.lastGlobalConsumption;
    this.lastGlobalConsumption = 0;
    message.forEach((communityMetrics) => {
      this.lastGlobalConsumption += communityMetrics.totalBoughtConsumption;
    });
    this.evaluateNextProduction();
  }
}
