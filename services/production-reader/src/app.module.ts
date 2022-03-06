import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductionReaderController } from './controllers/production-reader.controller';
import { ProductionReaderService } from './services/production-reader.service';
import { Production } from './entities/production.entity';
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
      Production,
    ]),
  ],
  controllers: [ProductionReaderController],
  providers: [ProductionReaderService],
})
export class AppModule {}
