import { Injectable } from '@nestjs/common';
import { UserWithRoleAndOrg } from './auth.repository';
import { JwtPayload } from './strategies/jwt.strategy';

/** Correspond exactement à `AuthUser` (Angular) / `UserModel` (Flutter). */
export interface AuthUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organizationId: string;
  avatarUrl?: string | null;
  phone?: string | null;
  permissions: string[];
}

@Injectable()
export class AuthMapper {
  toAuthUser(user: UserWithRoleAndOrg): AuthUserDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
      organizationId: user.organizationId,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
      permissions: user.role.permissions.map((p) => p.code),
    };
  }

  toJwtPayload(user: UserWithRoleAndOrg): Omit<JwtPayload, 'sub'> {
    return {
      email: user.email,
      organizationId: user.organizationId,
      roleId: user.roleId,
      roleName: user.role.name,
      permissions: user.role.permissions.map((p) => p.code),
    };
  }
}
