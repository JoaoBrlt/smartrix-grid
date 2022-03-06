import { Module } from '@nestjs/common';
import { InvoiceIssuerController } from './controllers/invoice-issuer.controller';
import { InvoiceIssuerService } from './services/invoice-issuer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Invoice } from './entities/invoice.entity';
import { HttpModule } from '@nestjs/axios';
import { HouseholdMetricsReaderService } from './external/household-metrics-reader.service';
import { ClientProxyFactory } from '@nestjs/microservices';

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
    TypeOrmModule.forFeature([Invoice]),
  ],
  controllers: [InvoiceIssuerController],
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
    InvoiceIssuerService,
    HouseholdMetricsReaderService,
  ],
})
export class AppModule {}
