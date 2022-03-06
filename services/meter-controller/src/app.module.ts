import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MeterController } from './controllers/meter.controller';
import { MeterService } from './services/meter.service';
import Configuration from './config/configuration';
import { ClientProxyFactory } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import { SimulationSubscriptionService } from './externals/simulation-subscription.service';

@Module({
  imports: [
    // Configuration.
    ConfigModule.forRoot({
      load: [Configuration],
    }),
    HttpModule,
  ],
  controllers: [MeterController],
  providers: [
    // Kafka.
    {
      provide: 'KAFKA_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(configService.get('kafka'));
      },
    },
    MeterService,
    SimulationSubscriptionService,
  ],
})
export class AppModule {}
