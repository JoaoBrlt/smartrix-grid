import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  // Initialize the service.
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable the validation.
  app.useGlobalPipes(new ValidationPipe());

  // Start the service.
  await app.listen(configService.get<number>('port'));
}
bootstrap();
