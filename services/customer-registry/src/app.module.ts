import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerRegistryController } from './controllers/customer-registry.controller';
import { CustomerRegistryService } from './services/customer-registry.service';
import { Customer } from './entities/customer.entity';
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
    TypeOrmModule.forFeature([
      Customer,
    ]),
  ],
  controllers: [CustomerRegistryController],
  providers: [CustomerRegistryService],
})
export class AppModule {}
