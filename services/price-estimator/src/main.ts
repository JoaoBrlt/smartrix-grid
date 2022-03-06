import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  //Enable pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }));

  //Connect to Kafka
  app.connectMicroservice(configService.get('kafka'));

  // Start the service.
  await app.startAllMicroservices();
  await app.listen(configService.get<number>('port'));
}
bootstrap();
