import { Injectable } from '@nestjs/common';
import { Prisma, Organization } from '@prisma/client';

import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class OrganizationsRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(params: {
    skip: number;
    take: number;
    search?: string;
  }) {
    const { skip, take, search } = params;

    return this.prisma.organization.findMany({
      skip,
      take,

      where: {
        deletedAt: null,

        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              code: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              city: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },

      include: {
        users: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async count(search?: string) {
    return this.prisma.organization.count({
      where: {
        deletedAt: null,

        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              code: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              city: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },
    });
  }

  async findById(id: string) {
    return this.prisma.organization.findFirst({
      where: {
        id,
        deletedAt: null,
      },

      include: {
        users: true,
      },
    });
  }

  async findByCode(code: string) {
    return this.prisma.organization.findUnique({
      where: {
        code,
      },
    });
  }

  async create(data: Prisma.OrganizationCreateInput) {
    return this.prisma.organization.create({
      data,

      include: {
        users: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.OrganizationUpdateInput,
  ) {
    return this.prisma.organization.update({
      where: {
        id,
      },

      data,

      include: {
        users: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.organization.update({
      where: {
        id,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  }
}