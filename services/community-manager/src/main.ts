import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  // Initialize the service.
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice(configService.get('kafka'));

  // Start the service.
  await app.startAllMicroservices();
  await app.listen(configService.get<number>('port'));
}
bootstrap();
