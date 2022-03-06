import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import Configuration from './config/configuration';
import { CalculatorController } from './controllers/calculator.controller';
import { CalculatorService } from './services/calculator.service';
import { CacheService } from './services/cache.service';
import { CommunityService } from './external/community.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    // Configuration.
    ConfigModule.forRoot({
      load: [Configuration],
    }),
    HttpModule,
  ],
  controllers: [
    // Controllers.
    CalculatorController,
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
    CacheService,
    CalculatorService,
    CommunityService,
  ],
})
export class AppModule {}
