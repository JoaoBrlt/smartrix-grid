import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  // Initialize the simulator.
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable the validation.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Start the simulator.
  await app.listen(configService.get<number>('port'));
}
bootstrap();
