import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from '../../../config/configuration';

/**
 * Utilisateur authentifié tel qu'injecté par `@CurrentUser()` dans les
 * contrôleurs. Reconstruit directement depuis le payload du JWT signé — pas
 * de requête DB à chaque appel (les permissions ne se rafraîchissent qu'au
 * prochain login/refresh, ce qui est acceptable vu la courte durée de vie
 * de l'access token).
 */
export interface AuthenticatedUser {
  userId: string;
  email: string;
  organizationId: string;
  roleId: string;
  roleName: string;
  permissions: string[];
}

export interface JwtPayload {
  sub: string;
  email: string;
  organizationId: string;
  roleId: string;
  roleName: string;
  permissions: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const appConfig = configService.get<AppConfig>('app')!;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwt.accessSecret,
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return {
      userId: payload.sub,
      email: payload.email,
      organizationId: payload.organizationId,
      roleId: payload.roleId,
      roleName: payload.roleName,
      permissions: payload.permissions ?? [],
    };
  }
}
