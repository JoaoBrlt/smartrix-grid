import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Configuration from './config/configuration';
import { ClientProxyFactory } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import { PaymentProcessorController } from './controllers/payment-processor.controller';
import { PaymentProcessorService } from './services/payment-processor.service';

@Module({
  imports: [
    // Configuration.
    ConfigModule.forRoot({
      load: [Configuration],
    }),
    HttpModule,
  ],
  controllers: [PaymentProcessorController],
  providers: [
    // Kafka.
    {
      provide: 'KAFKA_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(configService.get('kafka'));
      },
    },

    //Services.
    PaymentProcessorService,
  ],
})
export class AppModule {}
