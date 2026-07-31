import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `🚀 EcoCity API running on http://localhost:${process.env.PORT ?? 3000}/api/v1`,
  );
}

bootstrap();