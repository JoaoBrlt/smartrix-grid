import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AssignerController } from './controllers/assigner.controller';
import { ProviderController } from './controllers/provider.controller';
import { AssignerService } from './services/assigner.service';
import { ProviderService } from './services/provider.service';
import { Assigner } from './entities/assigner.entity';
import { Provider } from './entities/provider.entity';
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
    TypeOrmModule.forFeature([Assigner, Provider]),
  ],
  controllers: [
    // Controllers.
    AssignerController,
    ProviderController,
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
    AssignerService,
    ProviderService,
  ],
})
export class AppModule {}
