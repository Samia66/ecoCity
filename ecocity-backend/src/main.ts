import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AppConfig } from './config/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: false });

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app')!;

  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cookieParser());

  // ✅ CORS pour Angular + Flutter Web
  app.enableCors({
    origin: (origin: string | undefined, callback: any) => {
      if (
        !origin ||
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1')
      ) {
        callback(null, true);
      } else {
        callback(new Error('CORS non autorisé'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix(appConfig.apiPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('EcoCity API')
    .setDescription('Documentation de l’API EcoCity')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(appConfig.port);

  console.log(
    `🌿 EcoCity API démarrée sur http://localhost:${appConfig.port}/${appConfig.apiPrefix}`,
  );

  console.log('📘 Swagger disponible sur http://localhost:3000/docs');
}

bootstrap();