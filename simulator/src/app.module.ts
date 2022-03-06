import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SimulationController } from './controllers/simulation.controller';
import { HouseholdMetricsCalculatorService } from './external/household-metrics-calculator.service';
import { CommunityManagerService } from './external/community-manager.service';
import { HouseholdMetricsWriterService } from './external/household-metrics-writer.service';
import { ProductionEvaluatorService } from './external/production-evaluator.service';
import { SimulationService } from './services/simulation.service';
import { MeterControllerService } from './external/meter-controller.service';
import Configuration from './config/configuration';
import { ProductionWriterService } from './external/production-writer.service';

@Module({
  imports: [
    HttpModule,

    // Configuration.
    ConfigModule.forRoot({
      load: [Configuration],
    }),
  ],
  controllers: [
    // Controllers.
    SimulationController,
  ],
  providers: [
    // Services.
    SimulationService,

    // External services.
    HouseholdMetricsWriterService,
    ProductionWriterService,
    ProductionEvaluatorService,
    CommunityManagerService,
    MeterControllerService,
    HouseholdMetricsCalculatorService,
  ],
})
export class AppModule {}
