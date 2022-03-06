import { Module } from '@nestjs/common';
import { ConsumptionRegulationService } from './services/consumption-regulation.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ConsumptionRegulationController } from './controllers/consumption-regulator.controller';
import Configuration from './config/configuration';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ProducerService } from './external/producer.service';
import { CacheService } from './services/cache.service';

@Module({
  imports: [
    HttpModule,

    // Scheduler.
    ScheduleModule.forRoot(),

    // Configuration.
    ConfigModule.forRoot({
      load: [Configuration],
    }),
  ],
  controllers: [ConsumptionRegulationController],
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
    ConsumptionRegulationService,
    ProducerService,
    CacheService,
  ],
})
export class AppModule {}
