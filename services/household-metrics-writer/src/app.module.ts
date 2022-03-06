import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HouseholdMetricsWriterController } from './controllers/household-metrics-writer.controller';
import { HouseholdMetricsWriterService } from './services/household-metrics-writer.service';
import { HouseholdMetrics } from './entities/household-metrics.entity';
import Configuration from './config/configuration';
import { ClientProxyFactory } from '@nestjs/microservices';
import { PriceService } from './external/price.service';

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
    TypeOrmModule.forFeature([HouseholdMetrics]),
  ],
  controllers: [HouseholdMetricsWriterController],
  providers: [
    // Kafka.
    {
      provide: 'KAFKA_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(configService.get('kafka'));
      },
    },

    // Services.
    HouseholdMetricsWriterService,
    PriceService,
  ],
})
export class AppModule {}
