import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export const AUTH_USER_INCLUDE = {
  role: { include: { permissions: true } },
  organization: true,
} satisfies Prisma.UserInclude;

export type UserWithRoleAndOrg = Prisma.UserGetPayload<{ include: typeof AUTH_USER_INCLUDE }>;

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string): Promise<UserWithRoleAndOrg | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: AUTH_USER_INCLUDE,
    });
  }

  findUserById(id: string): Promise<UserWithRoleAndOrg | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: AUTH_USER_INCLUDE,
    });
  }

  findDefaultRoleByName(name: string) {
    return this.prisma.role.findUnique({ where: { name } });
  }

  findDefaultOrganization() {
    return this.prisma.organization.findFirst({ orderBy: { createdAt: 'asc' } });
  }

  createUser(data: Prisma.UserCreateInput): Promise<UserWithRoleAndOrg> {
    return this.prisma.user.create({ data, include: AUTH_USER_INCLUDE });
  }

  updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  recordSuccessfulLogin(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date(), failedLoginAttempts: 0, lockedUntil: null },
    });
  }

  incrementFailedAttempts(id: string, attempts: number, lockedUntil: Date | null): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { failedLoginAttempts: attempts, lockedUntil },
    });
  }

  // --- Refresh tokens --------------------------------------------------

  createRefreshToken(data: Prisma.RefreshTokenCreateInput) {
    return this.prisma.refreshToken.create({ data });
  }

  findRefreshTokenByHash(tokenHash: string) {
    return this.prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null },
      include: { user: { include: AUTH_USER_INCLUDE } },
    });
  }

  revokeRefreshToken(id: string, replacedBy?: string) {
    return this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date(), replacedBy },
    });
  }

  revokeAllUserRefreshTokens(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // --- Password reset ----------------------------------------------------

  createPasswordResetToken(data: Prisma.PasswordResetTokenCreateInput) {
    return this.prisma.passwordResetToken.create({ data });
  }

  findPasswordResetTokenByHash(tokenHash: string) {
    return this.prisma.passwordResetToken.findFirst({
      where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
    });
  }

  markPasswordResetTokenUsed(id: string) {
    return this.prisma.passwordResetToken.update({ where: { id }, data: { usedAt: new Date() } });
  }

  // --- Email verification --------------------------------------------------

  createEmailVerificationToken(data: Prisma.EmailVerificationTokenCreateInput) {
    return this.prisma.emailVerificationToken.create({ data });
  }

  findEmailVerificationTokenByHash(tokenHash: string) {
    return this.prisma.emailVerificationToken.findFirst({
      where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
    });
  }

  markEmailVerificationTokenUsed(id: string) {
    return this.prisma.emailVerificationToken.update({ where: { id }, data: { usedAt: new Date() } });
  }
}
