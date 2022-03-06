import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductionMetrics } from '../dtos/production-metrics.dto';
import { ProductionWriterService } from '../services/production-writer.service';

@Controller('production-writer')
export class ProductionWriterController {
  /**
   * Constructs the production writer controller.
   * @param productionInputService The production input service.
   */
  constructor(private readonly productionInputService: ProductionWriterService) {}

  /**
   * Indicates the amount of energy produced by a power plant on a given date.
   * @param productionRequest The production request.
   */
  @Post()
  public async indicateProduction(@Body() productionRequest: ProductionMetrics) {
    await this.productionInputService.storeProductionRecord(productionRequest);
  }

  /**
   * Clears the entities.
   */
  @Get('clear')
  public async clear() {
    await this.productionInputService.clear();
  }
}
