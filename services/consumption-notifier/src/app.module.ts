import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConsumptionNotifierController } from './controllers/consumption-notifier.controller';
import { ConsumptionNotifierService } from './services/consumption-notifier.service';
import { MailServerService } from './external/mail-server.service';
import { ConsumptionStatus } from './entities/consumption-status.entity';
import Configuration from './config/configuration';

@Module({
  imports: [
    HttpModule,

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
    TypeOrmModule.forFeature([ConsumptionStatus]),
  ],
  controllers: [
    // Controllers.
    ConsumptionNotifierController,
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
    ConsumptionNotifierService,
    MailServerService,
  ],
})
export class AppModule {}
