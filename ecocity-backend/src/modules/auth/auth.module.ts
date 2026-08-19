import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { StringValue } from 'ms';

import { AppConfig } from '../../config/configuration';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { AuthMapper } from './auth.mapper';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const appConfig = configService.get<AppConfig>('app')!;

        return {
          secret: appConfig.jwt.accessSecret,

          signOptions: {
            expiresIn:
              appConfig.jwt.accessExpiresIn as StringValue,
          },
        };
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    AuthRepository,
    AuthMapper,
    JwtStrategy,
  ],

  exports: [AuthService, AuthRepository],
})
export class AuthModule {}