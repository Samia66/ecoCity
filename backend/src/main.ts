import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(
    new GlobalExceptionFilter(),
  );

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );
  app.setGlobalPrefix('api/v1');

  app.enableCors();

 app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);

  const config = new DocumentBuilder()
    .setTitle('EcoCity API')
    .setDescription(
      'Backend API for EcoCity Smart Waste Management',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT',
    )
    .build();

  const document =
    SwaggerModule.createDocument(
      app,
      config,
    );

  SwaggerModule.setup(
    'api',
    app,
    document,
  );
  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `🚀 EcoCity API : http://localhost:${process.env.PORT ?? 3000}`,
  );

  console.log(
    `📘 Swagger : http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}

bootstrap();