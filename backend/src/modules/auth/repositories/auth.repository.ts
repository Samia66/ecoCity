import { Injectable } from '@nestjs/common';
import {
  Prisma,
  RoleName,
  User,
  Organization,
  Role,
} from '@prisma/client';

import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

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

}