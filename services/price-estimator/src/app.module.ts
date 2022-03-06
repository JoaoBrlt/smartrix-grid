import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PriceEstimatorController } from './controllers/price-estimator.controller';
import { PriceEstimatorService } from './services/price-estimator.service';
import { Price } from './entities/price-estimator.entity';
import Configuration from './config/configuration';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ProducerService } from './external/producer-service';

@Module({
  imports: [
    // Configuration.
    ConfigModule.forRoot({
      load: [Configuration],
    }),

    // Database.
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.get('database'),
    }),

    // Repositories.
    TypeOrmModule.forFeature([Price]),
  ],
  controllers: [PriceEstimatorController],
  providers: [
    // Kafka.
    {
      provide: 'KAFKA_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(configService.get('kafka'));
      },
    },
    PriceEstimatorService,
    ProducerService,
  ],
})
export class AppModule {}
