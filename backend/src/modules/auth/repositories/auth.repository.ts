import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  Prisma,
  RoleName,
  User,
  Organization,
  Role,
} from '@prisma/client';

import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { VerifyEmailDto } from '../dto/verify-email.dto';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  findUserByEmail(
    email: string,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findRoleByName(
    name: RoleName,
  ): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { name },
    });
  }

  findOrganizationByCode(
    code: string,
  ): Promise<Organization | null> {
    return this.prisma.organization.findUnique({
      where: { code },
    });
  }

  createUser(
    data: Prisma.UserCreateInput,
  ) {
    return this.prisma.user.create({
      data,
      include: {
        role: true,
        organization: true,
      },
    });
  }

  async findUserByEmailWithRelations(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        organization: true,
      },
    });
  }

  async createRefreshToken(data: Prisma.RefreshTokenCreateInput) {
    return this.prisma.refreshToken.create({
      data,
    });
  }


  async findRefreshToken(tokenHash: string) {
    return this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
      },
      include: {
        user: {
          include: {
            role: true,
            organization: true,
          },
        },
      },
    });
  }

  async revokeRefreshToken(id: string) {
    return this.prisma.refreshToken.update({
      where: { id },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async findActiveRefreshTokens(userId: string) {
    return this.prisma.refreshToken.findMany({
      where: {
        userId,
        revokedAt: null,
      },
    });
  }


  async findRefreshTokenByUserId(userId: string) {
    return this.prisma.refreshToken.findFirst({
      where: {
        userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          include: {
            role: true,
            organization: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }


  async revokeAllRefreshTokens(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async logout(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async findValidRefreshTokens() {
    return this.prisma.refreshToken.findMany({
      where: {
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          include: {
            role: true,
            organization: true,
          },
        },
      },
    });
  }


  async deleteExpiredRefreshTokens() {
    return this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  async findUserSessions(
    userId: string,
  ) {
    return this.prisma.refreshToken.findMany({

      where: {
        userId,
        revokedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async revokeSession(
    sessionId: string,
  ) {
    return this.prisma.refreshToken.update({

      where: {
        id: sessionId,
      },

      data: {
        revokedAt: new Date(),
      },
    });
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        role: true,
        organization: true,
      },
    });
  }

  async updatePassword(
    userId: string,
    password: string,
  ) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password,
      },
    });
  }

  async createEmailVerificationToken(
    data: Prisma.EmailVerificationTokenCreateInput,
  ) {
    return this.prisma.emailVerificationToken.create({
      data,
    });
  }

  async findValidEmailVerificationTokens() {
    return this.prisma.emailVerificationToken.findMany({
      where: {
        verifiedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },

      include: {
        user: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }


  async verifyEmailToken(
    id: string,
  ) {
    return this.prisma.emailVerificationToken.update({
      where: {
        id,
      },

      data: {
        verifiedAt: new Date(),
      },
    });
  }



  //verify user email
  async verifyUserEmail(
    userId: string,
  ) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        emailVerified: true,
      },
    });
  }

  //delete all unverified email verification tokens for a user
  async deleteEmailVerificationTokens(
    userId: string,
  ) {
    return this.prisma.emailVerificationToken.deleteMany({
      where: {
        userId,
        verifiedAt: null,
      },
    });
  }

  //delete all expired email verification tokens
  async createPasswordResetToken(
    data: Prisma.PasswordResetTokenCreateInput,
  ) {
    return this.prisma.passwordResetToken.create({
      data,
    });
  }

  //find all valid password reset tokens
  async deletePasswordResetTokens(
  userId: string,
) {
  return this.prisma.passwordResetToken.deleteMany({
    where: {
      userId,
      usedAt: null,
    },
  });
}

//find all valid password reset tokens
async findValidPasswordResetTokens() {
  return this.prisma.passwordResetToken.findMany({
    where: {
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },

    include: {
      user: true,
    },
  });
}

//find a valid password reset token by id
async usePasswordResetToken(
  id: string,
) {
  return this.prisma.passwordResetToken.update({
    where: {
      id,
    },

    data: {
      usedAt: new Date(),
    },
  });
}



async findUserPermissions(
    userId: string,
) {
    return this.prisma.user.findUnique({

        where: {
            id: userId,
        },

        include: {

            role: {

                include: {

                    rolePermissions: {

                        include: {
                            permission: true,
                        },

                    },

                },

            },

        },

    });
}
}