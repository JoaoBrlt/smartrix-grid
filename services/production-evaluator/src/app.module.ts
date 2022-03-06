import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductionEvaluatorController } from './controllers/production-evaluator.controller';
import { ProductionEvaluatorService } from './services/production-evaluator.service';
import Configuration from './config/configuration';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  imports: [
    // Configuration.
    ConfigModule.forRoot({
      load: [Configuration],
    }),
  ],
  controllers: [ProductionEvaluatorController],
  providers: [
    // Kafka.
    {
      provide: 'KAFKA_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(configService.get('kafka'));
      },
    },

    //Services
    ProductionEvaluatorService,
  ],
})
export class AppModule {}
