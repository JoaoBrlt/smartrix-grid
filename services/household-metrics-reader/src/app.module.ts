import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { GlobalMetricsReaderController } from './controllers/global-metrics-reader.controller';
import { CustomerMetricsReaderController } from './controllers/customer-metrics-reader.controller';
import { CommunityMetricsReaderController } from './controllers/community-metrics-reader.controller';
import { HouseholdMetricsReaderService } from './services/household-metrics-reader.service';
import { GlobalMetricsReaderService } from './services/global-metrics-reader.service';
import { CommunityMetricsReaderService } from './services/community-metrics-reader.service';
import { CustomerMetricsReaderService } from './services/customer-metrics-reader.service';
import { CommunityManagerService } from './external/community-manager.service';
import { HouseholdMetrics } from './entities/household-metrics.entity';
import Configuration from './config/configuration';

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
  controllers: [
    // Controllers.
    GlobalMetricsReaderController,
    CustomerMetricsReaderController,
    CommunityMetricsReaderController,
  ],
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
    HouseholdMetricsReaderService,
    GlobalMetricsReaderService,
    CustomerMetricsReaderService,
    CommunityMetricsReaderService,

    // External services.
    CommunityManagerService,
  ],
})
export class AppModule {}
