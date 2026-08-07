import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,

    private readonly authService: AuthService,
  ) {
    super({

      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey:
        config.getOrThrow<string>(
          'JWT_SECRET',
        ),
    });
  }

  async validate(
    payload: JwtPayload,
  ) {
    return this.authService.validateJwtUser(
      payload,
    );
  }
}