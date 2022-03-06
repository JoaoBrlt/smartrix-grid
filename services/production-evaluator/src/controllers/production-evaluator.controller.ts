import { Controller, Get } from '@nestjs/common';
import { ProductionEvaluatorService } from '../services/production-evaluator.service';
import { EventPattern } from '@nestjs/microservices';
import { CommunityMetricsSumDto } from '../dtos/community-metrics-sum.dto';

@Controller('/production-evaluator')
export class ProductionEvaluatorController {
  /**
   * Constructs the production evaluator controller.
   * @param productionService The production service.
   */
  constructor(private readonly productionService: ProductionEvaluatorService) {}

  /**
   * Evaluates the next order of energy production of a power plant.
   */
  @Get('next')
  public evaluateNextProduction(): number {
    return this.productionService.getNextProduction();
  }

  @EventPattern('communities-metrics-calculated')
  public updateLastGlobalConsumption(message: { value: CommunityMetricsSumDto[] }): void {
    this.productionService.updateLastGlobalConsumption(message.value);
  }
}
