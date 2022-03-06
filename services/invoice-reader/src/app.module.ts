import { Module } from '@nestjs/common';
import { InvoiceReaderController } from './controllers/invoice-reader.controller';
import { InvoiceReaderService } from './services/invoice-reader.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Invoice } from './entities/invoice.entity';

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
    TypeOrmModule.forFeature([Invoice]),
  ],
  controllers: [InvoiceReaderController],
  providers: [InvoiceReaderService],
})
export class AppModule {}
